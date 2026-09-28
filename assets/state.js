
const KEY='rainforest_end_v8';
const base={stage:0,marks:{},searches:[],opened:[],gate:false,surveyFrames:0,submitted:false};
function loadState(){try{return Object.assign({},base,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return {...base}}}
let STATE=loadState();
function save(){localStorage.setItem(KEY,JSON.stringify(STATE))}
function mark(k,stage){STATE.marks[k]=true;if(stage!=null)STATE.stage=Math.max(STATE.stage,stage);save();}
function has(k){return !!STATE.marks[k]}
function openNew(path){window.open(path,'_blank','noopener')}
function bindCross(){document.querySelectorAll('[data-new]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openNew(a.getAttribute('href'))}))}
function ambient(file){let started=false;const start=()=>{if(started)return;started=true;const a=new Audio('/assets/audio/'+file);a.loop=true;a.volume=.11;a.play().catch(()=>{});};addEventListener('pointerdown',start,{once:true});}
function recordOpen(id){if(!STATE.opened.includes(id))STATE.opened.push(id);save()}
window.RF={STATE,mark,has,openNew,bindCross,ambient,recordOpen,save};
