import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WORD_CASES,WORD_SOURCES} from '../dist/word-cases.js';
import {CASES} from '../dist/cases.js';
import {createCaseUI} from '../dist/case-ui.js';
import {freshCase,submitCase,nextCaseStep,caseCorrect,caseScore,validateCasework} from '../dist/case-engine.js';
import {PRIMARY_LESSONS,PRIMARY_QUESTIONS,EXTRA_LESSONS} from '../dist/content.js';
import {freshState,validateState,examQuestions,completion} from '../dist/engine.js';
test('La actualización del caché puede arrancar aunque un módulo viejo no tenga los exports nuevos',()=>{
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert(html.indexOf("navigator.serviceWorker.register('./sw.js'")<html.indexOf('<script type="module"'));
 assert(html.includes("'controllerchange'"));assert(html.includes('wasControlled'));
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');assert(sw.includes("'./word-cases.js'"));
});
test('Cobertura de seis Word y numeración original, incluido el salto de Unidad 3',()=>{
 assert.equal(Object.keys(WORD_SOURCES).length,6);assert.equal(WORD_CASES.length,130);
 assert.equal(WORD_CASES.reduce((n,c)=>n+c.questions.length,0),410);
 const expected={u1:50,u3:40,u4:10,loc:10,lea:10,com:10};
 for(const [source,n] of Object.entries(expected))assert.equal(WORD_CASES.filter(c=>c.source===source).length,n);
 assert.deepEqual(WORD_CASES.filter(c=>c.source==='u3').map(c=>c.number),[...Array.from({length:20},(_,i)=>i+1),...Array.from({length:20},(_,i)=>i+30)]);
 for(const c of WORD_CASES){assert.equal(c.collection,'word');assert.deepEqual(c.steps[1].questions,c.questions);assert(c.location.includes('Word'));assert(c.facts.length>30);}
 assert.equal(CASES.filter(c=>c.collection==='extra').length,25);
});
test('Un escrito no recibe acierto automático ni altera el porcentaje',()=>{
 const c=WORD_CASES[0],r=freshCase();r.draft=1-c.steps[0].answer;submitCase(r,c);nextCaseStep(r,c);
 r.draft='Esta es una respuesta de desarrollo sin evaluar.';assert.equal(caseCorrect(c.steps[1],r.draft),null);submitCase(r,c);nextCaseStep(r,c);
 assert.equal(r.answers[1].ok,null);assert.equal(caseScore(r,c),0);assert.equal(r.best,0);
 const corrupted=structuredClone(r);corrupted.answers[1].ok=true;
 assert.equal(validateCasework({[c.id]:corrupted})[c.id].answers[1].ok,null);
});
test('Se conservan borradores incompletos, escritos, notas y marcas al importar',()=>{
 const c=WORD_CASES[0],r=freshCase();r.draft=c.steps[0].answer;submitCase(r,c);nextCaseStep(r,c);r.draft='Idea';r.status='review';r.note='Consultar requisitos.';
 const state=freshState();state.casework[c.id]=r;assert.deepEqual(validateState(JSON.parse(JSON.stringify(state))).casework[c.id],r);
});
test('Primer parcial: 24 lecciones, seis módulos y ningún ejercicio posterior en el simulacro',()=>{
 assert.equal(PRIMARY_LESSONS.length,24);assert.equal(PRIMARY_QUESTIONS.length,96);assert.equal(EXTRA_LESSONS.length,4);
 for(let i=0;i<10;i++)assert(examQuestions().every(q=>PRIMARY_QUESTIONS.includes(q)));
 const s=freshState();s.lessons.ga4={best:100,attempts:1,last:1};assert.equal(completion(s),0);assert.equal(validateState(s).lessons.ga4.best,100);
});
test('Catálogo distingue principales/extras, todas las fichas renderizan y conservan consignas',()=>{
 const state=freshState();const e=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 const ui=createCaseUI({getState:()=>state,save(){},go(){},refresh(){},e,btn:(t,a)=>`<button data-action="${a}">${t}</button>`,icon:()=>''});
 const main=ui.list();assert(main.includes('w-u1-01'));assert(!main.includes('case-open:cp01'));
 ui.action('case-collection:extra');assert(ui.list().includes('case-open:cp01'));assert(!ui.list().includes('case-open:w-u1'));
 for(const c of CASES){ui.action('case-open:'+c.id);const html=ui.detail();assert(html.includes(e(c.facts.split('\n')[0])));for(const q of c.questions||[])assert(html.includes(e(q)));}
 ui.action('case-open:w-u1-01');ui.action('case-option:1');ui.action('case-check');ui.action('case-next');assert(ui.detail().includes('data-case-input="reason"'));
 state.casework['w-u1-01'].draft='Razonamiento guardado con datos y conclusión.';ui.action('case-check');assert(ui.detail().includes('No se evaluó tu escrito'));ui.action('case-next');ui.action('case-mark:review');assert.equal(state.casework['w-u1-01'].status,'review');assert(ui.detail().includes('no evalúa tus respuestas escritas'));
});
