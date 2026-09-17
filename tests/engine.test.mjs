import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {LESSONS,QUESTIONS,MODULES,PRIMARY_MODULES,PRIMARY_LESSONS,PRIMARY_QUESTIONS,SOURCES} from '../dist/content.js';
import {freshState,makeSession,submitAnswer,advance,finish,correctAnswer,isCorrect,hasAnswer,validateState,dayKey,streakDays,completion,examQuestions,dueQuestions,mistakeQuestions} from '../dist/engine.js';
const now=new Date(2026,8,14,12).getTime();
test('Todo el contenido tiene referencias, ejercicios válidos e identificadores únicos',()=>{
 assert.equal(MODULES.length,7);assert.equal(LESSONS.length,28);assert.equal(QUESTIONS.length,112);
 assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,112);
 for(const l of LESSONS){assert(l.paragraphs.length>=2);assert(l.example&&l.remember);assert(l.refs.length);for(const [key] of l.refs)assert(SOURCES[key]?.url.startsWith('https://'));for(const q of l.questions){assert(q.explanation.length>20);assert(hasAnswer(q,correctAnswer(q)));assert(isCorrect(q,correctAnswer(q)));}}
 assert.deepEqual(new Set(QUESTIONS.map(q=>q.type)),new Set(['choice','multi','match','order']));
});
test('Elección, selección múltiple, asociaciones y orden corrigen sin falsos positivos',()=>{
 for(const q of QUESTIONS){const answer=correctAnswer(q);assert(!hasAnswer(q,999));assert(!hasAnswer(q,[999]));if(Array.isArray(answer)){assert(!isCorrect(q,[]));if(q.type==='multi')assert(isCorrect(q,[...answer].reverse()));else if(answer.length>1)assert(!isCorrect(q,[...answer].reverse()));}else assert(!isCorrect(q,(answer+1)%q.options.length));}
});
test('Las respuestas parciales no puntúan y los dobles clics no duplican XP',()=>{
 const s=freshState(),q=QUESTIONS[0];s.session=makeSession('lesson',LESSONS[0].questions,LESSONS[0].id);
 assert.equal(submitAnswer(s,null,now),null);assert.equal(s.xp,0);assert.equal(advance(s),false);
 assert.equal(submitAnswer(s,correctAnswer(q),now).earned,10);assert.equal(submitAnswer(s,correctAnswer(q),now),null);assert.equal(s.xp,10);assert.equal(s.days[dayKey(new Date(now))],1);
});
test('El mejor intento se conserva y finalizar exige todas las respuestas',()=>{
 const s=freshState(),l=LESSONS[0];s.session=makeSession('lesson',l.questions,l.id);finish(s);assert.equal(s.session.finished,false);
 for(const q of l.questions){submitAnswer(s,correctAnswer(q),now);advance(s);}assert.equal(s.lessons[l.id].best,100);assert.equal(completion(s),1);finish(s);assert.equal(s.lessons[l.id].attempts,1);
 s.session=makeSession('lesson',l.questions,l.id);for(const q of l.questions){submitAnswer(s,q.type==='choice'?(q.answer+1)%q.options.length:correctAnswer(q),now);advance(s);}assert.equal(s.lessons[l.id].best,100);assert.equal(s.lessons[l.id].attempts,2);
});
test('XP una vez por pregunta y día; errores y repasos pendientes se actualizan',()=>{
 const s=freshState(),q=QUESTIONS[0];const run=(answer,date)=>{s.session=makeSession('review',[q]);return submitAnswer(s,answer,date);};
 assert.equal(run(correctAnswer(q),now).earned,10);assert.equal(run(correctAnswer(q),now).earned,0);assert.equal(s.cards[q.id].streak,1);assert.equal(s.cards[q.id].due,now+86400000);assert.equal(run(correctAnswer(q),now+86400000).earned,10);
 run((q.answer+1)%q.options.length,now);assert.equal(mistakeQuestions(s).length,1);assert.equal(dueQuestions(s,now).length,1);
 run(correctAnswer(q),now);assert.equal(mistakeQuestions(s).length,0);assert.equal(dueQuestions(s,now).length,0);assert.equal(dueQuestions(s,now+86400000).length,1);
});
test('Copiar progreso conserva sesión, orden y selección sin volver a puntuar',()=>{
 const s=freshState(),l=LESSONS[0];s.session=makeSession('lesson',l.questions,l.id);s.session.questions[0].value=correctAnswer(l.questions[0]);submitAnswer(s,correctAnswer(l.questions[0]),now);
 const restored=validateState(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s);assert.equal(submitAnswer(restored,correctAnswer(l.questions[0]),now),null);advance(restored);assert.equal(restored.session.index,1);
});
test('Copias con sesiones corruptas no rompen la app ni inventan dominio',()=>{
 assert.throws(()=>validateState({}));
 for(const change of [s=>s.questions[0].value={},s=>s.questions[0].order=[99],s=>s.questions[0]=null,s=>s.finished=true,s=>s.index=999,s=>s.lessonId='ga4']){const raw=freshState();raw.session=makeSession('lesson',LESSONS[0].questions,LESSONS[0].id);change(raw.session);assert.equal(validateState(raw).session,null);}
});
test('Rachas respetan días locales, ayer y cortes de actividad',()=>{
 const s=freshState();s.days['2026-09-12']=2;s.days['2026-09-13']=2;assert.equal(streakDays(s,new Date(2026,8,14,23)),2);assert.equal(streakDays(s,new Date(2026,8,15,1)),0);s.days['2026-09-14']=1;assert.equal(streakDays(s,new Date(2026,8,14)),3);
});
test('Simulacro equilibrado: 24 sin repetición y 4 de cada módulo',()=>{
 for(let i=0;i<20;i++){const qs=examQuestions();assert.equal(qs.length,24);assert.equal(new Set(qs.map(q=>q.id)).size,24);for(const m of PRIMARY_MODULES)assert.equal(qs.filter(q=>LESSONS.find(l=>l.id===q.lesson).module===m.id).length,4);}
});
test('La instalación incluye todos los archivos del caché y rutas relativas',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../dist/manifest.webmanifest',import.meta.url),'utf8'));assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');for(const icon of manifest.icons)assert(existsSync(new URL('../dist/'+icon.src,import.meta.url)));
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');for(const entry of sw.matchAll(/'\.\/([^']+)'/g))assert(existsSync(new URL('../dist/'+entry[1].split('?')[0],import.meta.url)));
});
