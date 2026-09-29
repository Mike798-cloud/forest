const KEY='rainforest_end_v19';
const BASE={marks:{},searches:[],submitted:false};
let STATE;
try{STATE=Object.assign({},BASE,JSON.parse(localStorage.getItem(KEY)||'{}'));STATE.marks=Object.assign({},BASE.marks,STATE.marks||{});}catch(e){STATE=structuredClone(BASE)}
function save(){localStorage.setItem(KEY,JSON.stringify(STATE));window.dispatchEvent(new CustomEvent('rainforest-statechange',{detail:STATE}))}
function mark(k){STATE.marks[k]=true;save()}
function has(k){return !!STATE.marks[k]}
function requireMark(k,back,msg){if(has(k))return true;const p=location.pathname;let brand='Request unavailable',title='无法载入该内容',sub=msg||'对象当前没有出现在你的共享范围内。';if(p.includes('/fieldtalk/')){brand='FieldTalk';title='此频道或消息不可用';sub=msg||'当前访客权限没有返回该对象。'}else if(p.includes('/cloudline/')){brand='Cloudline';title='共享项目尚未同步';sub=msg||'共享索引还没有返回这一批次。'}else if(p.includes('/geo/')){brand='GeoExplorer';title='数据对象不可用';sub=msg||'该图层尚未进入当前项目。'}else if(p.includes('/medical/')){brand='Field Medical';title='工作簿未同步';sub=msg||'现场附件尚未进入只读镜像。'}else if(p.includes('/archive/')){brand='Digital Collections';title='馆藏对象暂不可用';sub=msg||'当前引用没有对应到可公开馆藏记录。'}else if(p.includes('/satcache/')){brand='ARZ-04';title='CACHE OBJECT NOT INDEXED';sub=msg||'Recovered object is not present in the current index.'}else if(p.includes('/survey/')){brand='Survey Review';title='复核对象未进入队列';sub=msg||'当前代理帧索引为空。'}else if(p.includes('/sar/')){brand='SAR Coordination';title='补充材料尚未建立';sub=msg||'当前案件没有可提交的复核对象。'}document.body.innerHTML=`<main style="max-width:760px;margin:12vh auto;padding:0 28px;font:15px/1.85 system-ui;color:#25303a"><div style="font:12px ui-monospace,monospace;letter-spacing:.08em;color:#77828a;margin-bottom:20px">${brand}</div><h1 style="font-size:27px;font-weight:600">${title}</h1><p>${sub}</p><p style="margin-top:26px"><a href="${back}">返回上一来源</a></p></main>`;return false}
const scriptURL=document.currentScript?new URL(document.currentScript.src):null;
const assetBase=scriptURL?new URL('./',scriptURL):null;
function ambient(file,volume=.025){let started=false;const go=()=>{if(started||!assetBase)return;started=true;const a=new Audio(new URL('audio/'+file,assetBase));a.loop=true;a.preload='auto';a.volume=0;const target=Math.min(.04,Math.max(.006,volume));a.play().then(()=>{let v=0;const fade=setInterval(()=>{v=Math.min(target,v+.002);a.volume=v;if(v>=target)clearInterval(fade)},180)}).catch(()=>{});};addEventListener('pointerdown',go,{once:true});}

let lastUiSound=0;
function sfx(name='click',volume=.16){
  if(!assetBase)return;
  const now=performance.now();
  if(name==='click'&&now-lastUiSound<85)return;
  lastUiSound=now;
  const a=new Audio(new URL('audio/ui_'+name+'.ogg',assetBase));
  a.preload='auto';a.volume=Math.min(.24,Math.max(.035,volume));a.play().catch(()=>{});
}
function installUIAudio(){
  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest&&e.target.closest('button,[role="button"],input[type="checkbox"],input[type="range"]');
    if(b)sfx('click',.075);
  },{passive:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installUIAudio,{once:true});else installUIAudio();

function rememberSearch(q){if(q&&!STATE.searches.includes(q)){STATE.searches.push(q);save()}}

addEventListener('storage',e=>{if(e.key!==KEY||!e.newValue)return;try{const next=JSON.parse(e.newValue);STATE=Object.assign({},BASE,next);STATE.marks=Object.assign({},BASE.marks,next.marks||{});window.RF.STATE=STATE;window.dispatchEvent(new CustomEvent('rainforest-statechange',{detail:STATE}));}catch(_){}});

window.RF={STATE,save,mark,has,requireMark,ambient,sfx,rememberSearch};
