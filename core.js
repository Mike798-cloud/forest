'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const app=$('#app'), modal=$('#modal'), toastEl=$('#toast'), addressInput=$('#address'), menuEl=$('#browserMenu');
const STORE='rainforest_end_v7';
const START='fieldtalk.local/workspace/azera?channel=coord';
const baseState={
  sound:false,bookmarks:[START,'azera-rainforest.org/season-2026','wildtrace.app/u/zhou-ye','fieldnotes.local'],history:[],notes:'',glyphNotes:{},
  chatChannel:'coord',portalPage:'home',wildTab:'activity',cloudAlbum:'field',openedPhotos:[],searchHistory:[],openedDocs:[],
  gis:{zoom:1,tx:0,ty:0,rain:false,planned:true,actual:true,drone:false,time:100,selected:[],measureMode:false,measure:[],compared:false},
  flash:{x:2,y:8,gate:false,oldPage:'home'},e:{},submitted:false
};
let st=load(); let audio=null;
function clone(x){return JSON.parse(JSON.stringify(x))}
function load(){try{const raw=JSON.parse(localStorage.getItem(STORE)||'{}');return mergeDeep(clone(baseState),raw)}catch{return clone(baseState)}}
function mergeDeep(a,b){for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&a[k])mergeDeep(a[k],b[k]);else a[k]=b[k]}return a}
function save(){localStorage.setItem(STORE,JSON.stringify(st))}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(t){toastEl.textContent=t;toastEl.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toastEl.classList.remove('show'),1800)}
function flag(k,v=true){st.e[k]=v;save();derive()}
function has(k){return !!st.e[k]}
function currentUrl(){return decodeURIComponent((location.hash||'#'+START).slice(1))}
function parseUrl(raw=currentUrl()){
  const [pathQ,hashPart='']=raw.split('#'); const qAt=pathQ.indexOf('?'); const base=qAt>=0?pathQ.slice(0,qAt):pathQ; const qs=qAt>=0?pathQ.slice(qAt+1):'';
  const slash=base.indexOf('/'); const host=slash>=0?base.slice(0,slash):base; const path=slash>=0?base.slice(slash):'/';
  return {raw,host,path,query:new URLSearchParams(qs),fragment:hashPart};
}
function nav(url,replace=false){if(!url)return; if(/^https?:\/\//.test(url))url=url.replace(/^https?:\/\//,''); if(replace)location.replace('#'+encodeURI(url));else location.hash='#'+encodeURI(url)}
function remember(url){if(st.history[st.history.length-1]!==url){st.history.push(url);st.history=st.history.slice(-80);save()}}
function titleFor(u){const p=parseUrl(u); const hostTitles={
 'fieldtalk.local':'FieldTalk','azera-rainforest.org':'ACRP · 2026野外季','wildtrace.app':'WildTrace','atlas.azera-research.org':'GeoExplorer Pro','cloudline.app':'Cloudline','echosearch.net':'EchoSearch','fieldnotes.local':'野外笔记','docs.azera-research.org':'现场医疗记录','survey.azera-research.org':'Survey Review','sar.azera.gov':'搜救协调系统','linebeyond.net':'林线之外','satcache.azera-research.org':'ARZ-04 Cache'
 }; return hostTitles[p.host]||WEB_DOCS.find(d=>d.url===u||u.startsWith(d.url))?.source||p.host||'新标签页'}
function updateBrowser(){const u=currentUrl(); addressInput.value=u; $('#tabTitle').textContent=titleFor(u); document.title=titleFor(u)+' — 雨林尽头没有路'; $('#bookmark').textContent=st.bookmarks.includes(u)?'★':'☆'; const level=pollution(); document.body.dataset.pollution=level; $('#syncMark').textContent=level>=2?'索引状态已更新':'';}
function pollution(){if(st.submitted)return 4;if(has('last_log')||has('ghost_index'))return 3;if(has('ritual_context'))return 2;if(has('contact_evidence'))return 1;return 0}
function derive(){
  // Evidence is earned through actual actions; each conclusion has alternative paths.
  const routeA=has('gis_offset_seen')&&has('gis_rain_seen');
  const routeB=has('gis_offset_seen')&&has('field_route_read');
  const routeC=has('oldriver_seen')&&has('field_route_read');
  st.e.route_evidence=routeA||routeB||routeC;
  const contactA=has('field_contact_read')&&has('village_photo_seen');
  const contactB=has('drone_village_seen')&&has('field_contact_read');
  const contactC=has('old_camera_seen')&&has('camera_history_read');
  st.e.contact_evidence=contactA||contactB||contactC;
  const ritualSignals=[has('medical_comment_read'),has('fieldnote_read'),has('glyph_context_seen'),has('oldgame_gate')].filter(Boolean).length;
  st.e.ritual_context=ritualSignals>=2;
  st.e.rescue_ready=st.e.route_evidence&&st.e.contact_evidence&&(has('last_log')||has('oldriver_seen'));
  // Satellite cache arrives only after substantial browsing, as an asynchronous world event rather than a knowledge unlock.
  const meaningful=new Set(st.openedDocs).size+new Set(st.openedPhotos).size+(st.gis.compared?2:0)+(has('medical_comment_read')?1:0)+(has('oldgame_gate')?2:0);
  if(meaningful>=8&&st.e.route_evidence&&st.e.contact_evidence)st.e.cache_recovered=true;
  save(); updateBrowser();
}
function knownUrl(v){
  const s=v.trim().replace(/^https?:\/\//,'').replace(/\/$/,'');
  if(!s)return null;
  if(s.includes('.')&&!s.includes(' '))return s;
  return 'echosearch.net/search?q='+encodeURIComponent(s);
}
function openMenu(){
  if(!menuEl.hidden){menuEl.hidden=true;return}
  menuEl.hidden=false; menuEl.innerHTML=`<div class="browser-menu">
    <button data-menu="bookmarklist">书签</button><button data-nav="fieldnotes.local">本地笔记</button><button data-menu="history">历史记录</button>
    <hr><button data-menu="sound">页面声音：${st.sound?'开':'关'}</button><button data-menu="reset">清除本地浏览数据…</button>
  </div>`;
  bindGlobal(menuEl);
  $('[data-menu="sound"]',menuEl)?.addEventListener('click',()=>{st.sound=!st.sound;save();menuEl.hidden=true;audioScene();toast(st.sound?'页面声音已开启':'页面声音已关闭')});
  $('[data-menu="bookmarklist"]',menuEl)?.addEventListener('click',()=>showBrowserList('书签',st.bookmarks));
  $('[data-menu="history"]',menuEl)?.addEventListener('click',()=>showBrowserList('历史记录',[...st.history].reverse()));
  $('[data-menu="reset"]',menuEl)?.addEventListener('click',()=>{if(confirm('清除本地浏览记录、笔记和调查进度？')){localStorage.removeItem(STORE);location.hash='#'+encodeURI(START);location.reload()}});
}
function showBrowserList(title,items){menuEl.innerHTML=`<div class="browser-menu wide"><header>${title}<button data-close>×</button></header>${items.length?items.map(u=>`<button class="browser-list" data-nav="${esc(u)}"><b>${esc(titleFor(u))}</b><span>${esc(u)}</span></button>`).join(''):'<p class="empty">暂无记录</p>'}</div>`;bindGlobal(menuEl);$('[data-close]',menuEl)?.addEventListener('click',()=>menuEl.hidden=true)}
function audioScene(){if(!st.sound){if(audio){audio.pause();audio=null}return} const h=parseUrl().host; const file=h==='atlas.azera-research.org'?'river.wav':h==='survey.azera-research.org'?'drone.wav':h==='linebeyond.net'?'crt.wav':['azera-rainforest.org','wildtrace.app','cloudline.app'].includes(h)?'jungle.wav':'room.wav'; if(!audio||!audio.src.endsWith(file)){if(audio)audio.pause();audio=new Audio('assets/audio/'+file);audio.loop=true;audio.volume=.22;audio.play().catch(()=>{})}}
function glyph(name,dir='in'){const paths=GLYPHS[name]||[];const notch={in:'M20 4h8',out:'M20 44h8',left:'M4 20v8',right:'M44 20v8'}[dir]||'M20 4h8';return `<span class="glyph" data-glyph="${name}"><svg viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${paths.map(p=>`<path d="${p}"/>`).join('')}<path d="${notch}" stroke="#8d3028" stroke-width="3"/></g></svg></span>`}
function bindGlobal(root=document){
  root.querySelectorAll('[data-nav]').forEach(el=>{if(el.dataset.bound)return;el.dataset.bound='1';el.addEventListener('click',ev=>{ev.preventDefault();menuEl.hidden=true;nav(el.dataset.nav)})});
}
function render(){if(!location.hash){nav(START,true);return} const u=currentUrl(); remember(u); updateBrowser(); menuEl.hidden=true; modal.innerHTML=''; renderSite(parseUrl(u)); bindGlobal(); audioScene(); derive();}
$('#back').onclick=()=>history.back(); $('#forward').onclick=()=>history.forward(); $('#reload').onclick=()=>render();
$('#newTab').onclick=()=>nav('newtab.local'); $('#menuBtn').onclick=openMenu;
$('#bookmark').onclick=()=>{const u=currentUrl();const i=st.bookmarks.indexOf(u);if(i>=0)st.bookmarks.splice(i,1);else st.bookmarks.push(u);save();updateBrowser();toast(i>=0?'已从书签移除':'已添加书签')};
addressInput.addEventListener('keydown',ev=>{if(ev.key==='Enter'){const u=knownUrl(ev.target.value);if(u)nav(u)}});
window.addEventListener('hashchange',render); document.addEventListener('click',ev=>{if(!menuEl.hidden&&!ev.target.closest('#browserMenu')&&!ev.target.closest('#menuBtn'))menuEl.hidden=true});
