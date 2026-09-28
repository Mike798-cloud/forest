const KEY='rainforest_end_v10';
const BASE={marks:{},searches:[],submitted:false};
let STATE;
try{STATE=Object.assign({},BASE,JSON.parse(localStorage.getItem(KEY)||'{}'));STATE.marks=Object.assign({},BASE.marks,STATE.marks||{});}catch(e){STATE=structuredClone(BASE)}
function save(){localStorage.setItem(KEY,JSON.stringify(STATE))}
function mark(k){STATE.marks[k]=true;save()}
function has(k){return !!STATE.marks[k]}
function requireMark(k,back,msg){if(has(k))return true;document.body.innerHTML=`<main style="max-width:760px;margin:14vh auto;padding:0 28px;font:16px/1.85 system-ui;color:#25303a"><h1 style="font-size:28px">当前内容尚不可用</h1><p>${msg||'这项资料还没有出现在你的访问权限或同步记录里。'}</p><p><a href="${back}">返回上一来源</a></p></main>`;return false}
const scriptURL=document.currentScript?new URL(document.currentScript.src):null;
const assetBase=scriptURL?new URL('./',scriptURL):null;
function ambient(file,volume=.08){let started=false;const go=()=>{if(started||!assetBase)return;started=true;const a=new Audio(new URL('audio/'+file,assetBase));a.loop=true;a.volume=volume;a.play().catch(()=>{});};addEventListener('pointerdown',go,{once:true});}
function rememberSearch(q){if(q&&!STATE.searches.includes(q)){STATE.searches.push(q);save()}}
window.RF={STATE,save,mark,has,requireMark,ambient,rememberSearch};
