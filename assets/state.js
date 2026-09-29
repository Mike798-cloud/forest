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

/* Voluntary support layer — adapted from the payment flow used by 《许愿柳》. */
const RainSupport={
  STORAGE_KEY:'_rainforest_support',SESSION_KEY:'_rainforest_support_session',COOKIE_KEY:'_rainforest_support_flag',AUTO_SEEN_KEY:'_rainforest_support_auto_seen',
  qrCode:'https://mike798-cloud.github.io/songtao-grainstation/paycode.png',lastFocus:null,
  _getCookie(name){try{const key=name+'=';for(const part of document.cookie.split(';')){const value=part.trim();if(value.indexOf(key)===0)return value.slice(key.length)}}catch(e){}return ''},
  _setCookie(name,value,days){try{const d=new Date();d.setTime(d.getTime()+days*86400000);document.cookie=name+'='+value+';expires='+d.toUTCString()+';path=/;SameSite=Lax'}catch(e){}},
  hasPaid(){try{return !!(localStorage.getItem(this.STORAGE_KEY)||sessionStorage.getItem(this.SESSION_KEY)||this._getCookie(this.COOKIE_KEY))}catch(e){return !!this._getCookie(this.COOKIE_KEY)}},
  hasAutoSeen(){try{return localStorage.getItem(this.AUTO_SEEN_KEY)==='1'}catch(e){return false}},
  markAutoSeen(){try{localStorage.setItem(this.AUTO_SEEN_KEY,'1')}catch(e){}},
  markPaid(){const raw=Date.now()+'_'+Math.random().toString(36).slice(2,10)+'_abc_studio';let token=raw;try{token=btoa(unescape(encodeURIComponent(raw)))}catch(e){}try{localStorage.setItem(this.STORAGE_KEY,token);sessionStorage.setItem(this.SESSION_KEY,token)}catch(e){}this._setCookie(this.COOKIE_KEY,token,365);document.body.classList.add('support-complete')},
  ensureButton(){const path=location.pathname.replace(/\\/g,'/');const styled=!!document.querySelector('link[href*=\"assets/common.css\"]');if(!styled||/\/fieldtalk\/index\.html$/.test(path)||/\/sar\/done\.html$/.test(path)||/\/thanks\.html$/.test(path)||document.getElementById('rainSupportButton'))return;const btn=document.createElement('button');btn.type='button';btn.id='rainSupportButton';btn.className='rain-support-chip';btn.setAttribute('aria-label','自愿支持作者 1元');btn.innerHTML='<span>￥</span><b>支持作者</b>';btn.addEventListener('click',()=>this.show({manual:true}));document.body.appendChild(btn);if(this.hasPaid())document.body.classList.add('support-complete')},
  show(options={}){if(this.hasPaid()){if(options.manual)this.toast('已经收到你的支持了。谢谢，继续查就好。');return}let overlay=document.getElementById('rainSupportOverlay');if(!overlay){overlay=document.createElement('div');overlay.className='rain-paywall-overlay';overlay.id='rainSupportOverlay';overlay.hidden=true;overlay.innerHTML=`<section class="rain-paywall-card" role="dialog" aria-modal="true" aria-labelledby="rainPayTitle" aria-describedby="rainPayDesc"><button type="button" class="rain-paywall-close" aria-label="关闭">×</button><div class="rain-paywall-inner"><header class="rain-paywall-head"><div class="rain-paywall-eyebrow">VOLUNTARY SUPPORT / 1 CNY</div><h2 id="rainPayTitle">如果你愿意，支持这次调查 1 元</h2><p id="rainPayDesc">自愿支持，不会影响后面的页面、线索或结局。</p></header><div class="rain-paywall-body"><figure class="rain-paywall-qr"><img src="${this.qrCode}" alt="1元支持收款码"><figcaption>扫码支持 1 元</figcaption></figure><div class="rain-paywall-copy"><p>谢谢你从周野那段私信一路翻到这里。</p><p>这个项目里有很多东西本来不该被放在同一张桌子上：路线点、雨量表、旧相机、馆藏编号，还有一些只剩文件名的记录。做它的时候，我花得最多的时间，也正是在这些不起眼的地方来回核对。</p><p>如果你觉得这几分钟已经值得，愿意留下一块钱，我会很高兴。不方便也完全没关系，关掉这页继续查，后面的内容一项都不会少。</p><p class="rain-paywall-line">这里不是门票。只是你愿意说一句“我看到了”。</p></div></div><footer class="rain-paywall-foot"><button type="button" class="rain-paywall-done">我支持了一下</button><button type="button" class="rain-paywall-later">先继续调查</button></footer></div></section>`;document.body.appendChild(overlay);const qr=overlay.querySelector('.rain-paywall-qr img');qr.addEventListener('error',()=>{qr.closest('figure').classList.add('is-offline');qr.alt='收款码暂时无法载入'});overlay.querySelector('.rain-paywall-close').addEventListener('click',()=>this.hide());overlay.querySelector('.rain-paywall-later').addEventListener('click',()=>this.hide());overlay.querySelector('.rain-paywall-done').addEventListener('click',()=>{this.markPaid();this.hide();this.toast('收到啦，谢谢你。后面的记录还没查完。')});overlay.addEventListener('click',event=>{if(event.target===overlay)this.hide()})}this.lastFocus=document.activeElement;overlay.hidden=false;document.body.classList.add('support-modal-open');requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add('is-open')));overlay.querySelector('.rain-paywall-close')?.focus({preventScroll:true})},
  hide(){const overlay=document.getElementById('rainSupportOverlay');if(!overlay||overlay.hidden)return;overlay.classList.remove('is-open');document.body.classList.remove('support-modal-open');setTimeout(()=>{overlay.hidden=true;try{this.lastFocus?.focus({preventScroll:true})}catch(e){}},320)},
  toast(text){document.querySelector('.rain-support-toast')?.remove();const el=document.createElement('div');el.className='rain-support-toast';el.textContent=text;document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),320)},3000)},
  maybeAuto(){const path=location.pathname.replace(/\\/g,'/');if(!/\/acrp\/index\.html$/.test(path)||this.hasPaid()||this.hasAutoSeen())return;setTimeout(()=>{if(this.hasPaid()||this.hasAutoSeen()||document.hidden)return;this.markAutoSeen();this.show({auto:true})},5200)},
  init(){this.ensureButton();this.maybeAuto()}
};
window.RainSupport=RainSupport;addEventListener('keydown',event=>{if(event.key==='Escape')RainSupport.hide()});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>RainSupport.init(),{once:true});else RainSupport.init();

