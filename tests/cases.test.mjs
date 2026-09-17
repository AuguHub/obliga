import test from 'node:test';
import assert from 'node:assert/strict';
import {CASES,CASE_SOURCES} from '../dist/cases.js';
import {SOURCES} from '../dist/content.js';
import {freshState,validateState} from '../dist/engine.js';
import {freshCase,caseReady,caseCorrect,submitCase,nextCaseStep,resetCase,validateCasework} from '../dist/case-engine.js';
test('130 casos Word, 23 extras y dos talleres con trazabilidad',()=>{
 assert.equal(CASES.filter(c=>c.kind==='case').length,153);assert.equal(CASES.filter(c=>c.kind==='workshop').length,2);assert.equal(new Set(CASES.map(c=>c.id)).size,155);
 for(const c of CASES){assert(CASE_SOURCES[c.source]);assert(c.location&&c.facts&&c.revision&&c.model);assert(c.refs.every(([id])=>SOURCES[id]));assert(c.steps.length>=2);for(const s of c.steps){assert(caseReady(s,s.answer));assert.equal(caseCorrect(s,s.answer),s.type==='reason'?null:true);assert(s.explanation&&s.hint);}}
});
test('Todos los casos se pueden terminar; doble envío no duplica intentos',()=>{
 for(const c of CASES){const r=freshCase();for(const s of c.steps){assert.equal(nextCaseStep(r,c),false);r.draft=s.answer;assert(submitCase(r,c));assert.equal(submitCase(r,c),false);assert(nextCaseStep(r,c));}assert.equal(r.index,c.steps.length);assert.equal(r.best,100);assert.equal(r.attempts,1);assert.equal(submitCase(r,c),false);}
});
test('Cálculo con coma decimal, valores vacíos e incorrectos',()=>{
 const s=CASES.find(c=>c.id==='cp05').steps[1];assert(caseCorrect(s,'41,10'));assert(caseCorrect(s,'41.10'));assert(!caseReady(s,''));assert(!caseReady(s,'  '));assert(!caseReady(s,'Infinity'));assert(!caseCorrect(s,'500'));assert(!caseCorrect(s,'41.12'));
});
test('Selección múltiple exige todas y solo las opciones correctas',()=>{
 const s=CASES.find(c=>c.id==='ta02').steps[0];assert(caseCorrect(s,[2,0,1]));assert(!caseCorrect(s,[0,1]));assert(!caseCorrect(s,[0,1,2,3]));assert(!caseReady(s,[0,0,1]));assert(!caseReady(s,[99]));
});
test('Importar y exportar conserva notas, pistas y sesión del caso',()=>{
 const s=freshState(),c=CASES[0],r=freshCase();r.note='Mi análisis: distinguir carga y defecto.';r.hints=[0];r.draft=c.steps[0].answer;submitCase(r,c);s.casework[c.id]=r;assert.deepEqual(validateState(JSON.parse(JSON.stringify(s))),s);assert.equal(r.answers[0].hint,true);
});
test('Reintentar conserva mejor nota y borrador; migración admite copias antiguas',()=>{
 const r=freshCase();r.note='Conclusión propia';r.best=100;r.attempts=2;r.answers=[{value:1,ok:true}];const next=resetCase(r);assert.equal(next.note,r.note);assert.equal(next.best,100);assert.equal(next.attempts,2);assert.equal(next.answers.length,0);const old=freshState();delete old.casework;assert.deepEqual(validateState(old).casework,{});
});
test('Las copias corruptas no atribuyen aciertos ni rompen la sección',()=>{
 assert.deepEqual(validateCasework({cp01:{index:999,answers:[]}}),{});const r=freshCase();r.answers=[{value:0,ok:true,hint:false}];const clean=validateCasework({cp01:r});assert.equal(clean.cp01.answers[0].ok,false);r.answers=[{value:99,ok:true}];assert.deepEqual(validateCasework({cp01:r}),{});
});
