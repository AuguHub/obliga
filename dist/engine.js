import {validateCasework} from './case-engine.js';
import {LESSONS,QUESTIONS,MODULES,PRIMARY_MODULES,PRIMARY_QUESTIONS} from './content.js';
export const VERSION=1;
export const byId=Object.fromEntries(QUESTIONS.map(q=>[q.id,q]));
export function dayKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function freshState(){return {version:VERSION,xp:0,days:{},lessons:{},cards:{},awarded:{},session:null,lastLesson:null,casework:{}};}
export function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function correctAnswer(q){if(q.type==='match')return q.pairs.map((_,i)=>i);if(q.type==='order')return q.items.map((_,i)=>i);return q.answer;}
export function isCorrect(q,answer){const expected=correctAnswer(q);if(Array.isArray(expected)){if(!Array.isArray(answer)||answer.length!==expected.length)return false;const actual=q.type==='multi'?[...new Set(answer)].sort((a,b)=>a-b):answer;return actual.length===expected.length&&actual.every((x,i)=>x===expected[i]);}return answer===expected;}
export function validDraft(q,a){const n=(q.options||q.items||q.pairs).length,index=x=>Number.isInteger(x)&&x>=0&&x<n;if(q.type==='choice')return a===null||index(a);if(!Array.isArray(a))return false;if(q.type==='multi')return a.every(index)&&new Set(a).size===a.length;if(q.type==='match')return a.length===n&&a.every(x=>x===-1||index(x));return a.length===n&&a.every(index)&&new Set(a).size===n;}
export function hasAnswer(q,a){if(!validDraft(q,a))return false;if(q.type==='multi')return a.length>0;if(q.type==='match')return a.every(x=>x>=0);return a!==null;}
export function dueQuestions(state,now=Date.now()){return PRIMARY_QUESTIONS.filter(q=>state.cards[q.id]&&state.cards[q.id].due<=now).sort((a,b)=>{const ca=state.cards[a.id],cb=state.cards[b.id];return Number(cb.wrong)-Number(ca.wrong)||ca.due-cb.due;});}
export function mistakeQuestions(state){return PRIMARY_QUESTIONS.filter(q=>state.cards[q.id]?.wrong);}
export function examQuestions(random=Math.random){return shuffle(PRIMARY_MODULES.flatMap(m=>shuffle(QUESTIONS.filter(q=>LESSONS.find(l=>l.id===q.lesson).module===m.id),random).slice(0,4)),random);}
export function makeSession(mode,questions,lessonId=null,random=Math.random){return {id:`${Date.now()}-${Math.floor(random()*1e9)}`,mode,lessonId,index:0,answers:[],feedback:false,finished:false,created:Date.now(),questions:questions.map(q=>{let order=shuffle((q.options||q.items||q.pairs).map((_,i)=>i),random);if(q.type==='order'&&order.every((x,i)=>x===i))order=[...order.slice(1),order[0]];return {id:q.id,order,value:q.type==='order'?[...order]:q.type==='match'?q.pairs.map(()=>-1):q.type==='multi'?[]:null};})};}
export function submitAnswer(state,answer,now=Date.now()){
 const s=state.session;if(!s||s.finished||s.feedback||s.answers[s.index])return null;
 const entry=s.questions[s.index],q=byId[entry.id];if(!hasAnswer(q,answer))return null;
 const ok=isCorrect(q,answer),key=dayKey(new Date(now));s.answers.push({id:q.id,value:structuredClone(answer),ok});s.feedback=true;
 const old=state.cards[q.id]||{streak:0};const sameDay=ok&&!old.wrong&&old.last&&dayKey(new Date(old.last))===key;const streak=ok?old.streak+(sameDay?0:1):0;const gap=ok?[1,3,7,14][Math.min(streak-1,3)]:0;
 state.cards[q.id]={streak,wrong:!ok,due:sameDay?old.due:now+gap*86400000,last:now};
 state.days[key]=(state.days[key]||0)+1;
 let earned=0;if(ok&&state.awarded[q.id]!==key){earned=10;state.xp+=earned;state.awarded[q.id]=key;}
 return {ok,earned};
}
export function advance(state){const s=state.session;if(!s||!s.feedback||s.finished)return false;if(s.index<s.questions.length-1){s.index++;s.feedback=false;}else{finish(state);}return true;}
export function finish(state){const s=state.session;if(!s||s.finished||s.answers.length!==s.questions.length)return;const score=s.answers.filter(a=>a.ok).length;const percent=Math.round(100*score/s.questions.length);s.finished=true;if(s.lessonId){const previous=state.lessons[s.lessonId]||{best:0,attempts:0};state.lessons[s.lessonId]={best:Math.max(previous.best,percent),attempts:previous.attempts+1,last:Date.now()};state.lastLesson=s.lessonId;}}
export function streakDays(state,date=new Date()){let n=0,d=new Date(date.getFullYear(),date.getMonth(),date.getDate());if(!state.days[dayKey(d)])d.setDate(d.getDate()-1);while(state.days[dayKey(d)]){n++;d.setDate(d.getDate()-1);}return n;}
export function completion(state){return LESSONS.filter(l=>l.module<=6&&state.lessons[l.id]?.best>=80).length;}
export function validateState(raw){
 if(!raw||raw.version!==VERSION||!Number.isFinite(raw.xp)||raw.xp<0||!raw.days||!raw.lessons||!raw.cards||!raw.awarded)throw new Error('El archivo no contiene un progreso válido de Obliga.');
 const clean=freshState();clean.casework=validateCasework(raw.casework);clean.xp=Math.min(raw.xp,1e7);
 for(const [k,v]of Object.entries(raw.days))if(/^\d{4}-\d{2}-\d{2}$/.test(k)&&Number.isInteger(v)&&v>=0)clean.days[k]=v;
 for(const l of LESSONS){const v=raw.lessons[l.id];if(v&&Number.isFinite(v.best)&&v.best>=0&&v.best<=100&&Number.isInteger(v.attempts)&&v.attempts>=0)clean.lessons[l.id]={best:v.best,attempts:v.attempts,last:Number(v.last)||0};}
 for(const q of QUESTIONS){const v=raw.cards[q.id];if(v&&Number.isFinite(v.due)&&Number.isInteger(v.streak)&&v.streak>=0)clean.cards[q.id]={due:v.due,streak:v.streak,wrong:!!v.wrong,last:Number(v.last)||0};if(/^\d{4}-\d{2}-\d{2}$/.test(raw.awarded[q.id]||''))clean.awarded[q.id]=raw.awarded[q.id];}
 clean.lastLesson=LESSONS.some(l=>l.id===raw.lastLesson)?raw.lastLesson:null;
 const s=raw.session; if(s&&['lesson','review','exam','practice'].includes(s.mode)&&Array.isArray(s.questions)&&s.questions.length>0&&s.questions.length<=QUESTIONS.length&&new Set(s.questions.map(e=>e?.id)).size===s.questions.length&&s.questions.every(e=>{const q=byId[e?.id];if(!q||!validDraft(q,e.value))return false;const n=(q.options||q.items||q.pairs).length;return Array.isArray(e.order)&&e.order.length===n&&new Set(e.order).size===n&&e.order.every(i=>Number.isInteger(i)&&i>=0&&i<n);})&&Number.isInteger(s.index)&&s.index>=0&&s.index<s.questions.length&&Array.isArray(s.answers)&&s.answers.length===s.index+(s.feedback?1:0)&&s.answers.every((a,i)=>a?.id===s.questions[i].id&&hasAnswer(byId[a.id],a.value)&&a.ok===isCorrect(byId[a.id],a.value))&&(!s.finished||s.answers.length===s.questions.length)&&(!s.lessonId||s.mode==='lesson'&&LESSONS.some(l=>l.id===s.lessonId&&l.questions.length===s.questions.length&&l.questions.every((q,i)=>q.id===s.questions[i].id)))) {clean.session=structuredClone(s);clean.session.finished=!!s.finished;}
 return clean;
}
