(()=>{
'use strict';
const app=document.getElementById('app'), modal=document.getElementById('modal'), address=document.getElementById('address'), toastEl=document.getElementById('toast');
const STORE='rainforest_end_rebuilt_v1';
const base={flags:{},channel:'coord',notes:{},timeline:22,layerFlood:false,layerTrack:true,searchHistory:[],photoSeen:[],flash:{x:1,y:5},sound:false,submitted:false};
let state=load();
function load(){try{return Object.assign(structuredClone(base),JSON.parse(localStorage.getItem(STORE)||'{}'))}catch{return structuredClone(base)}}
function save(){localStorage.setItem(STORE,JSON.stringify(state))}
function flag(k,v=true){state.flags[k]=v;derive();save();updateChrome()}
function has(k){return !!state.flags[k]}
function derive(){
 if(has('map_deviation')&&has('old_missing_verified')&&has('contact_record')) state.flags.first_convergence=true;
 if(has('glyph_eye')&&has('glyph_body')&&has('medical_meaning')&&has('red_archive')) state.flags.ritual_understood=true;
 if(has('flash_gate')&&has('ritual_understood')) state.flags.last_log_ready=true;
 if(has('last_log')&&has('drone_verified')&&has('map_deviation')) state.flags.final_ready=true;
}
function pollution(){return has('final_ready')?4:has('ritual_understood')?3:has('first_convergence')?2:has('contact_record')?1:0}
function updateChrome(){document.body.className=`page-${route()} pollution-${pollution()}`;document.getElementById('syncMark').textContent=pollution()>=3?'':''}
function toast(t){toastEl.textContent=t;toastEl.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toastEl.classList.remove('show'),2200)}
const addr={chat:'fieldtalk.local/workspace/azera',portal:'azera-biodiversity.org/field-season-2026',wild:'wildtrace.app/u/zhou-ye',map:'atlas.azera-research.org/session/UL-09',cloud:'cloudline.app/shared/zhouye-field',search:'seek.example/search',medical:'docs.azera-research.org/sheets/medical-log',drone:'survey.azera-research.org/drone/session-0921',flash:'linxian.neocities.example/game',notes:'local://field-notes',article:'archive.example/document',rescue:'sar-coordination.gov/supplement',ending:'sar-coordination.gov/bulletin'};
function route(){return (location.hash.slice(1)||'chat').split('?')[0]}
function param(k){return new URLSearchParams(location.hash.split('?')[1]||'').get(k)}
function go(r){location.hash='#'+r}
function bind(){
 app.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>go(x.dataset.go));
 app.querySelectorAll('[data-channel]').forEach(x=>x.onclick=()=>{state.channel=x.dataset.channel;save();render()});
}
function render(){derive();let r=route();address.textContent=addr[r]||('local://'+r);updateChrome();modal.innerHTML='';({chat:renderChat,portal:renderPortal,wild:renderWild,map:renderMap,cloud:renderCloud,search:renderSearch,medical:renderMedical,drone:renderDrone,flash:renderFlash,notes:renderNotes,article:renderArticle,rescue:renderRescue,ending:renderEnding}[r]||renderChat)();bind();window.scrollTo(0,0)}
window.addEventListener('hashchange',render);
document.getElementById('backBtn').onclick=()=>history.back();document.getElementById('homeBtn').onclick=()=>go('chat');document.getElementById('notesBtn').onclick=()=>go('notes');

// ---------- Audio, generated in-browser ----------
let audio=null;
function sound(on){
 state.sound=on;save();document.getElementById('soundBtn').textContent='环境声：'+(on?'开':'关');
 if(!on&&audio){audio.ctx.close();audio=null;return}
 if(on&&!audio){
   const ctx=new (window.AudioContext||window.webkitAudioContext)();
   const len=ctx.sampleRate*2, buf=ctx.createBuffer(1,len,ctx.sampleRate), d=buf.getChannelData(0); for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*.34;
   const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=900;const gain=ctx.createGain();gain.gain.value=.022;src.connect(filter).connect(gain).connect(ctx.destination);src.start();
   const osc=ctx.createOscillator(), og=ctx.createGain();osc.frequency.value=42;og.gain.value=.008;osc.connect(og).connect(ctx.destination);osc.start();audio={ctx,src,osc};
 }
}
document.getElementById('soundBtn').onclick=()=>sound(!state.sound);

// ---------- Amoja glyph system ----------
const glyphNames=['eye','body','mouth','road','fire','rain','home','hand','child','river','night','name','outside','elder','dream','salt','return','bone'];
function glyphSvg(name,dir='r'){
 const i=Math.max(0,glyphNames.indexOf(name)), seed=i+2, lines=[];
 for(let n=0;n<4+(i%3);n++){
   let x1=7+((seed*13+n*9)%34), y1=7+((seed*7+n*11)%34), x2=7+((seed*17+n*5)%34), y2=7+((seed*19+n*3)%34);
   lines.push(`<path d="M${x1} ${y1} L${x2} ${y2}"/>`);
 }
 if(i%2===0) lines.push(`<path d="M10 ${24+(i%5)-2} Q24 ${8+(i%7)} 38 ${24+(i%5)-2}"/>`);
 if(i%4===1) lines.push(`<circle cx="24" cy="24" r="${5+(i%4)}"/>`);
 const rot={u:0,r:90,d:180,l:270}[dir]??90;
 return `<span class="glyph-inline" data-glyph="${name}"><svg viewBox="0 0 48 48" aria-label="阿摩文"><g fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round">${lines.join('')}<path d="M22 4 L28 4" stroke="#8b241c" stroke-width="3" transform="rotate(${rot} 24 24)"/></g></svg></span>`;
}
const g=glyphSvg;
const glyphContext={
 eye:'出现：木屋墙面 / 2012论坛抄图 / 高桥批注。',body:'出现：中央空地 / 医疗批注 / 1978笔记。',mouth:'出现：红字旧照片 / 医疗批注 / 隐藏地图。',road:'出现：旧论坛 / Flash隐藏门。',fire:'出现：1978笔记中“火”的禁忌段落。',rain:'出现：旧论坛 / Flash门边。',home:'出现：中央空地 / 1987语言资料 / 隐藏地图。',hand:'出现：1978笔记关于医治与技能的段落。',child:'出现：木屋课堂墙面 / 1978笔记。',river:'出现：1978笔记关于骨头归还河边的段落。',night:'出现：1978笔记关于梦与夜间禁忌的段落。',name:'出现：最后日志 / 1978笔记“把名字带回来”。',outside:'出现：树上旧设备旁的刻记。',elder:'出现：无人机中央空地标记 / 1978笔记。',dream:'出现：最后日志与1978笔记的梦兆段落。',salt:'出现：营地交换记录 / 1978笔记。',return:'出现：Flash隐藏地图 / 最后日志。',bone:'出现：1978笔记“骨头归河”的段落。'
};
function discover(name,source){if(!has('glyph_'+name)){flag('glyph_'+name);state.notes[name]=state.notes[name]||'';save();toast('你在笔记里记下了一种重复符号')} if(source) {state.flags['src_'+name+'_'+source]=true;save()}}

// ---------- data ----------
const chatData={
 coord:{title:'罗岚 · 后方协调',meta:'项目协调 / 后方通信',messages:[
 ['09/24 08:12','罗岚','周野所在的六人科考队已经超过规定通信窗口，六人全部失联。当地搜救和项目方都已经启动联络。你不要自行进山。现在最缺的是第三天傍晚到第四天凌晨之间的可信位置。'],
 ['09/24 08:14','罗岚','你原本在项目邀请名单里，公共资料权限还没撤。把你和周野共享过的路线、照片时间和他出发前提过的异常整理出来。不要给猜测，要给能相互印证的来源。','portal'],
 ['09/24 08:18','罗岚','轨迹里有一段突然向西南偏。如果你能判断它是主动改道而不是GPS漂移，就把理由写清楚。','map'],
 ['09/24 08:20','罗岚','补充材料表单先给你。暂时别提交，至少等你有两种独立来源。','rescue'],
 ...(has('first_convergence')?[['今天 16:04','罗岚','你整理的三项东西能互相对上：轨迹确实改道，旧相机属于十年前失踪者，队里也确认和聚落有直接接触。陈栩那批无人机低清预览我给你开了临时权限。','drone']]:[]),
 ...(has('final_ready')?[['今天 17:26','罗岚','最后日志和无人机位置能对应。现在需要你把“为什么搜这里”写成一段能让搜救人员复核的说明。','rescue']]:[])
 ]},
 zhou:{title:'周野',meta:'最后在线：5天前 · 卫星同步可能延迟',messages:[
 ['09/18 19:14','周野','你真赶不上？车明早六点从中转站走。'],['09/18 19:16','你','航司说最少延五小时。我落地再看能不能追。'],['09/18 19:18','周野','别硬追。雨季那段公路晚上开更不值。高桥说下补给周期还能进去。'],['09/18 19:20','周野','项目页你账号已经开了。路线别拿我昨天那版，我今天又改了一个河滩绕行。','portal'],['09/18 23:07','周野','云盘还是原来的共享目录。原图太大，卫星箱每天先推低清和文字。','cloud'],['09/19 00:11','周野','我这几天一直在看一个十几年前的破网页游戏。别笑，里面河弯和乌伦上游太像了。回来给你讲。'],['09/19 05:56','周野','上车了。你先睡。回来请你喝酒。'],['09/21 18:42','周野','今天鞋全湿了。陈栩说无人机飞完看见西边有炊烟，王老师觉得可能是季节性猎棚。明天如果雨小会去确认。'],['09/22 00:37','周野','共享那边刚推了一批图。别吐槽压缩，箱子今天只有两百多K。','cloud']
 ]},
 field:{title:'# 现场公开频道',meta:'阿泽拉项目 · 访客只读',messages:[
 ['09/19 07:08','许放','过检查站了。后面手机信号基本没了，统一走卫星箱。文字优先，照片等营地。'],['09/19 18:22','林澈','今天所有人脚踝检查一下。蚂蟥咬口别用火烫，已经说第三遍。'],['09/20 10:13','王敬山','东岸叫声不是长臂猿，频率不对。下午再布两个录音点。'],['09/20 16:50','高桥','下游船夫说第三支流“里面有人”，但他不肯解释。可能只是季节性采集点。'],['09/21 08:03','许放','昨晚河涨得快。原路线北段如果继续涨，明天要考虑改。','map'],['09/21 13:28','陈栩','西边飞完了，有规则屋顶，不像临时棚。低清预览上传了。','drone'],['09/21 19:51','周野','他们来营地了。四个人。没有武器，看起来像来换盐和电池。'],['09/21 20:14','高桥','他们把河上游叫“amokha”或接近这个音。不是地名也可能是人群自称，暂时别写死。'],['09/21 20:26','王敬山','对方知道我们要找的夜行动物，而且愿意带路。明天只走半天，许放定撤回时间。'],['09/22 10:02','周野','路边树上有一组重复刻记。高桥猜是猎区标志。我拍了，晚点同步。','cloud'],['09/22 17:40','林澈','几个人胃不舒服。我把症状和进食时间记在表里。','medical'],['09/22 18:03','许放','明天上午撤。理由不在群里展开。王老师同意。'],['09/22 23:46','陈栩','我的W220不是我的。先别问。周野知道我说什么。'],['09/23 00:08','林澈','有人把今天中午那段翻译再核一次吗？我越来越觉得高桥理解的“分给”不是比喻。'],['09/23 00:31','高桥','我也在重听。我之前把一个组合当成“守卫”，现在不确定。'],['09/23 01:04','周野','别在公开频道继续。明早一起走。']
 ]}
};

function renderChat(){
 let c=chatData[state.channel]||chatData.coord;if(state.channel==='field')flag('contact_record');if(state.channel==='coord'){c={...c,messages:[...chatData.coord.messages.filter(m=>!String(m[0]).startsWith('今天 ')),...(has('first_convergence')?[["今天 16:04","罗岚","你整理的三项东西能互相对上：轨迹确实改道，旧相机属于十年前失踪者，队里也确认和聚落有直接接触。陈栩那批无人机低清预览我给你开了临时权限。","drone"]]:[]),...(has('final_ready')?[["今天 17:26","罗岚","最后日志和无人机位置能对应。现在需要你把‘为什么搜这里’写成一段能让搜救人员复核的说明。","rescue"]]:[])]};}
 const attachName={portal:'项目门户',map:'乌伦河上游GIS',cloud:'周野 / 户外共享',medical:'现场医疗表',drone:'无人机预览',rescue:'搜救补充材料'};
 app.innerHTML=`<section class="chat-shell"><aside class="chat-rail"><strong>FT</strong><div class="chat-workspace">AZ</div><div class="chat-workspace">+</div></aside><aside class="chat-sidebar"><h2>阿泽拉联合项目</h2><div class="chat-label">私信</div>${['coord','zhou'].map(k=>`<button class="chat-channel ${state.channel===k?'active':''}" data-channel="${k}">${k==='coord'?'罗岚 · 后方协调':'周野'}</button>`).join('')}<div class="chat-label">频道</div><button class="chat-channel ${state.channel==='field'?'active':''}" data-channel="field"># 现场公开频道</button></aside><main class="chat-main"><header class="chat-head"><div><h1>${c.title}</h1><small>${c.meta}</small></div><select class="mobile-chat-select" id="mobileChannel"><option value="coord">后方协调</option><option value="zhou">周野</option><option value="field">现场公开频道</option></select></header><div class="chat-log">${c.messages.map((m,i)=>`<article class="chat-msg"><div class="chat-avatar">${m[1].slice(0,1)}</div><div><div class="chat-msg-head">${m[1]}<time>${m[0]}</time></div><p>${m[2]}</p>${m[3]?`<div class="chat-attachment"><span>${attachName[m[3]]||m[3]}</span><button data-go="${m[3]}">打开</button></div>`:''}</div></article>`).join('')}</div></main><aside class="chat-detail"><h3>会话信息</h3><dl><dt>同步</dt><dd>卫星文字优先；附件可能晚于消息数小时出现。</dd><dt>权限</dt><dd>${state.channel==='field'?'出发前项目访客 / 只读':'既有联系人'}</dd><dt>当前搜救</dt><dd>项目方与当地队伍正在搜索最后可信区域。</dd></dl><div class="chat-warning">不要自行进入雨林。把可以复核的来源交给后方。</div><p><button class="link" data-go="wild">查看周野的 WildTrace</button></p></aside></section>`;
 const ms=document.getElementById('mobileChannel');if(ms){ms.value=state.channel;ms.onchange=e=>{state.channel=e.target.value;save();render()}}
}

function renderPortal(){flag('portal_seen');
 app.innerHTML=`<section class="portal"><header class="portal-nav"><div class="portal-mark">AZERA BIODIVERSITY FIELD PROGRAM</div><nav><a>FIELD SEASON 2026</a><a>RESEARCH</a><a>TEAM</a><a>DATA</a></nav></header><section class="portal-hero"><div class="portal-hero-copy"><div><div class="portal-kicker">乌伦河上游 / 2026.09.19—09.26</div><h1>沿着雨季之后的河流，记录仍未被记录的生命。</h1></div><p>阿泽拉雨林联合调查计划由植物、动物行为、地理信息与野外医疗团队组成。本季任务集中在乌伦河第三支流及西侧山脊，目标包括夜行灵长类声学记录、河岸植物样线与季节性聚落地理观察。</p></div><figure><img src="assets/photos/exp_05.webp"><figcaption>U-LUN RIVER / aerial survey / 09.20</figcaption></figure></section><section class="portal-section"><div class="index">01 / FIELD QUESTION</div><div><h2>地图上的空白，不代表那里什么也没有。</h2><p>当地已有路线资料在第三支流之后明显变少。项目组计划先沿已知河滩推进，再由无人机和声学设备决定是否向西侧山脊增加短距离样线。雨季河道会改变，因此每日路线以现场领队判断为准。</p><button class="portal-route-link" data-go="map">打开公开GIS轨迹 →</button></div></section><div class="portal-team">${[['许放','队长 / GIS'],['周野','野外记录'],['林澈','医疗'],['陈栩','影像 / 无人机'],['高桥','语言协作'],['王敬山','动物行为']].map(x=>`<div class="portal-person"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('')}</div><section class="portal-section"><div class="index">02 / TRANSMISSION</div><div><h2>低带宽不是失联。</h2><p>队伍携带的通信箱每天定时推送文本、压缩图与定位点。原始影像会在带宽允许时延迟同步。09月23日之后，主箱未再完成一次完整上传；目前公开页面保留的是此前自动缓存。</p></div></section><div class="portal-status"><div>FIELD STATUS</div><div><span class="lost">COMMUNICATION WINDOW MISSED · 6 MEMBERS</span><br>最后完整上传 09/22 23:58 · 项目方已启动搜救协调</div></div></section>`;
}

function renderWild(){flag('wild_seen');
 const years=[
 ['2026',[['09.17','阿泽拉之前最后一条','“如果这次真拍到那东西，回来请你喝酒。你航班别再延误。”','assets/photos/exp_03.webp'],['06.03','北岭雨季训练','三个人淋到最后谁也不想说话。第二天看照片又觉得值。','assets/photos/normal_03.webp']]],
 ['2024',[['10.12','又走了一遍白石线','第一次来这里是2021。那次我们吵了一路，这次只在岔路口吵了十分钟。','assets/photos/normal_05.webp'],['04.04','旧相机计划','开始带一台二手CCD进山。颜色很烂，但我喜欢它拍夜里灯的时候那种脏。','assets/photos/normal_07.webp']]],
 ['2022',[['08.21','雨中迷路九小时','路线软件挂了以后才发现我们两个都只记得前半段。那次以后我开始把离线地图备两份。','assets/photos/normal_02.webp']]],
 ['2020',[['05.16','脚踝骨裂之后第一次上坡','走得很慢。有人一路在后面骂我为什么还要背相机。','assets/photos/normal_06.webp']]],
 ['2019',[['11.02','第一次像样的徒步','二十七码鞋进水，帐篷搭反，回来以后还是觉得下一次应该再远一点。','assets/photos/normal_01.webp']]]
 ];
 app.innerHTML=`<section class="wild"><header class="wild-top"><div class="wild-logo">WildTrace</div><input class="wild-search" placeholder="搜索路线、活动、装备"><button class="link" data-go="search">网页搜索</button></header><section class="wild-user"><img src="assets/photos/profile_zhou.webp"><div><h1>周野</h1><div class="wild-bio">野外记录 / 路线收集 / 偶尔拍点不好看的照片。和你互相关注 7 年。最后公开活动：阿泽拉雨林联合调查。</div>${pollution()>=3?`<div class="wild-newfollow">新关注者：amk_1978 · 头像 ${g('eye','r')}</div>`:''}</div><div class="wild-stats"><div><strong>186</strong><span>活动</span></div><div><strong>4,912</strong><span>公里</span></div><div><strong>73</strong><span>路线</span></div></div></section><section class="wild-stream">${years.map(y=>`<div class="wild-year"><div class="wild-year-label">${y[0]}</div><div class="wild-entries">${y[1].map(e=>`<article class="wild-entry"><time>${e[0]}</time><div><h3>${e[1]}</h3><p>${e[2]}</p><div class="wild-route"></div></div><img src="${e[3]}"></article>`).join('')}</div></div>`).join('')}</section></section>`;
}

function renderMap(){
 if(state.timeline>=65&&state.layerFlood)flag('map_deviation');
 const t=state.timeline; const trackEnd=20+Math.round(t*.58); const fork=t>62?`<path d="M${trackEnd} 59 C58 56 61 49 69 45 C74 43 77 40 82 36" fill="none" stroke="#e7aa62" stroke-width="1.4" stroke-dasharray="3 2"/>`:'';
 app.innerHTML=`<section class="gis"><aside class="gis-side"><div class="gis-brand">AZERA / FIELD ATLAS</div><h3>图层</h3><label class="layer-row"><input type="checkbox" id="trackLayer" ${state.layerTrack?'checked':''}> 队伍轨迹 / 09.19—09.23</label><label class="layer-row"><input type="checkbox" id="floodLayer" ${state.layerFlood?'checked':''}> 雨量与涨水范围</label><label class="layer-row"><input type="checkbox" checked> 等高线 20m</label><label class="layer-row"><input type="checkbox" checked> 第三支流水系</label><h3>轨迹摘要</h3><div class="mono" style="font-size:10px;line-height:1.8;color:#9faaa5">09.19 进入<br>09.21 北段涨水<br>09.22 09:40 西南偏转<br>09.22 18:31 低速移动<br>09.23 00:42 最后完整点</div><h3>工具</h3><button class="ghost" id="inspectDeviation">检查偏转段</button></aside><main class="gis-main"><div class="map-stage"><svg viewBox="0 0 100 70" preserveAspectRatio="none"><defs><filter id="rough"><feTurbulence baseFrequency=".04" numOctaves="3" seed="7"/><feColorMatrix values=".2 0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 0 0 0 .18 0"/></filter></defs><rect width="100" height="70" fill="#17231f"/><rect width="100" height="70" filter="url(#rough)" opacity=".9"/>${[8,14,21,28,35,42,49,56,63].map((y,i)=>`<path d="M0 ${y} C18 ${y-6+i%3} 35 ${y+4} 50 ${y-2} S82 ${y+5} 100 ${y-1}" fill="none" stroke="#7e91863a" stroke-width=".25"/>`).join('')}<path d="M7 4 C18 13 22 20 30 27 C40 36 46 37 53 45 C60 53 69 57 94 64" fill="none" stroke="#365f68" stroke-width="4"/><path d="M37 30 C49 27 56 24 67 15" fill="none" stroke="#315760" stroke-width="2"/><path d="M51 42 C58 36 63 35 74 28" fill="none" stroke="#315760" stroke-width="1.8"/>${state.layerFlood?`<path d="M15 12 C28 20 27 30 40 37 C54 44 61 58 83 61" fill="none" stroke="#6aa0aa" stroke-width="11" opacity=".17"/>`:''}${state.layerTrack?`<path d="M15 62 C20 57 28 55 34 51 C41 47 47 42 52 38 C56 35 59 31 62 28" fill="none" stroke="#d3e1d7" stroke-width="1.3"/><circle cx="62" cy="28" r="1.1" fill="#fff"/>${fork}`:''}</svg><div class="map-grid"></div><span class="map-label a">UL-RIVER-03</span><span class="map-label b">K24 RIDGE</span><span class="map-label c">UNSURVEYED</span></div><div class="gis-toolbar"><button>+</button><button>−</button><button>⌖</button><button>↗</button></div><button class="gis-action" data-go="portal">项目说明</button><aside class="gis-pop"><h2>TRACK / TEAM-06</h2><table><tr><td>当前回放</td><td>${String(Math.floor(19+t/24)).padStart(2,'0')}:${String((t*7)%60).padStart(2,'0')}</td></tr><tr><td>水平精度</td><td>${t>62?'± 4.8m':'± 6.2m'}</td></tr><tr><td>移动速度</td><td>${t>62?'2.7 km/h':'1.9 km/h'}</td></tr><tr><td>海拔变化</td><td>${t>62?'+34m / 42min':'+8m / 42min'}</td></tr></table><p>${t>62?'偏转后的点连续、速度稳定，且沿支流上升。若同时打开涨水范围，可以看到北段原线被洪水切断，但西南段不是随机漂移。':'拖动底部时间轴，查看09.22上午之后的轨迹。'}</p>${has('map_deviation')?'<b>已记录：更像主动改道，而不是定位漂移。</b>':''}</aside><div class="gis-timeline"><input id="timeSlider" type="range" min="0" max="100" value="${state.timeline}"><div class="gis-time-labels"><span>09.19</span><span>09.20</span><span>09.21</span><span>09.22</span><span>09.23</span></div><div class="gis-statusline"><span>GPS ${t>62?'4.8':'6.2'}m</span><span>${state.layerFlood?'RAIN MODEL ON':'RAIN MODEL OFF'}</span><span>${has('map_deviation')?'DEVIATION VERIFIED':''}</span></div></div></main></section>`;
 const s=document.getElementById('timeSlider');s.oninput=e=>{state.timeline=+e.target.value;save();renderMap()};document.getElementById('floodLayer').onchange=e=>{state.layerFlood=e.target.checked;save();renderMap()};document.getElementById('trackLayer').onchange=e=>{state.layerTrack=e.target.checked;save();renderMap()};document.getElementById('inspectDeviation').onclick=()=>{if(state.timeline>=65&&state.layerFlood){flag('map_deviation');toast('你把这段判断记进了自己的笔记')}else toast('先把时间拖到偏转发生后，并打开涨水范围')};
}

const photos=[
 ['exp_01.webp','09/19 18:48','营地 / UL-01','Phone 1x','normal'],['exp_02.webp','09/20 06:31','营地 / UL-02','Phone 1x','normal'],['exp_03.webp','09/20 10:04','样线桌','Phone 2x','normal'],['exp_04.webp','09/20 15:52','第三支流','Phone wide','normal'],['exp_05.webp','09/21 09:14','空中预览','Drone cache','normal'],['exp_06.webp','09/21 13:23','河滩','Drone cache','normal'],['exp_07.webp','09/21 16:09','西侧山脊','Phone 1x','normal'],['exp_08.webp','09/21 23:44','营地','Phone night','normal'],
 ['rit_01.webp','09/21 19:35','营地 / 交换之后','Phone 1x','normal'],['rit_03.webp','09/22 10:06','树上物品','Phone 2x','camera'],['rit_05.webp','09/22 11:44','木屋内部','Phone 1x','glyph'],['rit_02.webp','09/22 12:18','低清飞行预览','Drone cache','village'],['rit_06.webp','09/22 14:02','中央空地','Phone 1x','ritual'],['rit_04.webp','09/22 23:19','帐篷外','Phone night','horror'],['rit_07.webp','09/23 00:22','旧相片','CCD W220','red'],['rit_08.webp','AUTO_TIME','AUTO_META','Unknown','modern']
];
function renderCloud(){
 const count=photos.length+(pollution()>=2?1:0);
 const displayPhotos=photos.map(p=>p[4]==='modern'?[p[0],pollution()>=2?'今天 02:17':'09/23 00:51',pollution()>=2?'设备自动索引':'缓存',p[3],p[4]]:p);
 app.innerHTML=`<section class="cloud"><header class="cloud-head"><strong>Cloudline</strong><span>周野 / 户外共享 / 阿泽拉</span><span class="cloud-count">${count} 项 · ${pollution()>=2?'<span class="sync-anomaly">刚刚同步</span>':'最后同步 09/23 00:54'}</span></header><div class="photo-river">${displayPhotos.map((p,i)=>`<figure class="photo-cell"><img src="assets/photos/${p[0]}" loading="eager"><button data-photo="${i}" aria-label="打开照片"></button><figcaption class="photo-meta">${p[1]} · ${p[2]}</figcaption></figure>`).join('')}</div></section>`;
 app.querySelectorAll('[data-photo]').forEach(b=>b.onclick=()=>openPhoto(+b.dataset.photo));
}
function openPhoto(i){let p=photos[i];if(p[4]==='modern')p=[p[0],pollution()>=2?'今天 02:17':'09/23 00:51',pollution()>=2?'设备自动索引':'缓存',p[3],p[4]];state.photoSeen.push(i);state.photoSeen=[...new Set(state.photoSeen)];save();if(p[4]==='camera'){flag('camera_found');discover('outside','treegear')}if(p[4]==='glyph'){discover('eye','classroom');discover('child','classroom')}if(p[4]==='ritual'){discover('body','square');discover('home','square')}if(p[4]==='red'){flag('red_archive');discover('mouth','redphoto')}if(p[4]==='village')flag('drone_settlement');
 modal.innerHTML=`<div class="viewer"><button class="viewer-close" id="closeViewer">×</button><div class="viewer-media"><img src="assets/photos/${p[0]}"></div><aside class="viewer-info"><h2>${p[1]}</h2><div>${p[2]}</div><div class="exif"><div><span>来源</span><span>${p[3]}</span></div><div><span>上传</span><span>${i>7?'低带宽缓存':'自动同步'}</span></div><div><span>原图</span><span>${i>7?'未上传':'可用'}</span></div></div>${photoObservation(p[4])}</aside></div>`;document.getElementById('closeViewer').onclick=()=>modal.innerHTML='';}
function photoObservation(kind){
 if(kind==='camera')return `<p>树上挂着至少三代不同年份的户外设备，其中那台银色Sony W220很旧。你记得现场频道里陈栩提过这个型号。</p><button class="ghost" data-go="search" onclick="location.hash='#search?q=W220%20乌伦河%20失踪'">查这台相机</button>`;
 if(kind==='glyph')return `<p>墙面不是随手涂鸦。相同形体重复出现，并且“眼”状组合总挨着人物和方向。${g('eye','r')} ${g('child','u')}</p><p>桌角还有儿童反复临摹同一组短划的痕迹。</p>`;
 if(kind==='ritual')return `<p>中央木台旁边的符号与木屋里的组合一致，但“身体”形体和“家”形体被并置：${g('body','d')} ${g('home','r')}</p>`;
 if(kind==='red')return `<p>这不是队伍当天拍的数码照片。纸张已经发黄，照片上的红色线条后来才画上去。左侧反复出现的组合与“声音/口”和“归属”相邻。</p><button class="ghost" data-go="search" onclick="location.hash='#search?q=乌伦河%20旧探险队%20Sony%20W220'">查旧失踪记录</button>`;
 if(kind==='horror')return `<p>闪光灯只照亮帐篷边缘。林澈第二天在医疗批注里提到：她整晚都听见有人在帐篷外用非常慢的节奏重复队员的名字。</p>`;
 if(kind==='modern')return pollution()>=2?`<p class="sync-anomaly">这张照片的元数据说它今天02:17被加入共享目录。画面却是城市地铁。你不记得周野拍过它。</p>${g('eye','r')}`:`<p>一张普通的城市缓存图。拍摄日期缺失。</p>`;
 return `<p>普通的现场记录。没有特别说明。</p>`;
}

function renderSearch(){
 const q=param('q')||'';if(pollution()>=3&&!state.searchHistory.includes('amokha 口 肉 保存'))state.searchHistory.push('amokha 口 肉 保存');save();
 const results=searchResults(q);app.innerHTML=`<section class="seek"><header class="seek-top"><div class="seek-logo">Seek</div><form class="seek-box" id="searchForm"><input id="q" value="${escapeHtml(q)}" placeholder="搜索网页"><button>搜索</button></form></header><main class="seek-main">${q?`<div class="seek-note">约 ${results.length*137+3} 条结果</div>${results.map(r=>`<article class="result"><div class="url">${r.url}</div><button data-article="${r.id}"><h2>${r.title}</h2></button><p>${r.snip}</p></article>`).join('')}`:`<div style="margin-top:80px"><h1 style="font-weight:400">网页搜索</h1><p class="muted">你可以搜索相机型号、失踪者姓名、乌伦河旧称，或者周野提过的那个旧游戏。</p>${state.searchHistory.length?`<h3 style="font-size:11px;margin-top:40px">最近搜索</h3>${state.searchHistory.map(x=>`<div style="padding:8px 0;border-bottom:1px solid #eee;font-size:12px">${x}</div>`).join('')}`:''}</div>`}</main></section>`;
 document.getElementById('searchForm').onsubmit=e=>{e.preventDefault();let v=document.getElementById('q').value.trim();if(v){state.searchHistory.unshift(v);state.searchHistory=[...new Set(state.searchHistory)].slice(0,8);save();go('search?q='+encodeURIComponent(v))}};app.querySelectorAll('[data-article]').forEach(b=>b.onclick=()=>go('article?id='+b.dataset.article));
}
function searchResults(q){q=q.toLowerCase();let all=[
 {id:'missing2016',url:'mountainwatch.cn/archive/2016/0718',title:'乌伦河上游两名摄影爱好者失联，搜救第九日结束',snip:'2016年7月，摄影爱好者韩川与廖祺进入乌伦河上游后失联。家属公布的装备清单中包括 Sony DSC-W220 银色相机……'},
 {id:'oldthread',url:'outdoorbbs.example/thread/14281',title:'[存档] 第三支流以后到底有没有路？',snip:'2012年的旧论坛讨论。有人称当地船夫把一段河叫作“ama kha”，并警告雨后不要沿西岸进去。'},
 {id:'flashdev',url:'linxian.neocities.example/devlog',title:'《林线之外》更新记录（2011-2013）',snip:'独立网页小游戏作者“hanchuan.photo”的开发日志。最后一次更新提到“地图不是我画的，是照着别人给的一张纸描的”。'},
 {id:'toponym',url:'archive.azera-languages.org/toponyms/u-lun',title:'乌伦河上游旧地名与季节性聚落称谓',snip:'语言资料显示 amokha 并非固定地名，词义可能与“内部/归属”有关。资料采集年份：1987。'},
 {id:'ritualnotes',url:'fieldnotes.example/cache/1978-azera',title:'1978年私人田野笔记扫描：阿泽拉上游',snip:'未正式出版的私人笔记。记录了某个隔绝群体关于死亡、记忆、名字与分食的观念，但原作者后来撤回论文。'}
 ];
 if(!q)return all.slice(0,3); if(q.includes('w220')||q.includes('失踪')||q.includes('乌伦'))return all; if(q.includes('游戏')||q.includes('林线'))return [all[2],all[1]]; if(q.includes('amokha')||q.includes('ama'))return [all[3],all[4],all[1]];return [all[1],all[3],all[0]];
}

function renderArticle(){let id=param('id')||'missing2016';const docs={
 missing2016:{cls:'',source:'华南户外新闻存档 / 2016.07.18',title:'乌伦河上游两名摄影爱好者失联，搜救第九日结束',deck:'家属公布的装备清单中，一台银色 Sony DSC-W220 相机从未找到。',img:'assets/photos/normal_04.webp',body:`<p>两名失联者韩川、廖祺于7月7日进入乌伦河上游，原计划五日后返回补给点。当地搜救队在第三支流附近找到一只损坏的防水袋和部分食物包装，但未发现两人。</p><p>韩川长期使用一台银色 Sony DSC-W220 作为备用相机。家属在搜救结束后确认，相机、两张存储卡以及一台黄色手持GPS均未被找到。</p><blockquote>“他什么都可能丢，唯独那台旧相机一直挂在肩带上。”</blockquote><p>警方当时未发现第三方活动的明确证据。此后十年，仍没有两人的可靠消息。</p>`},
 oldthread:{cls:'archive-old',source:'山行者论坛网页存档 / 2012',title:'第三支流以后到底有没有路？',deck:'缓存页面来自2012年，原站点已关闭。',img:'assets/photos/normal_08.webp',body:`<p><b>楼主 hanchuan.photo：</b> 船夫不肯过第三支流，说雨后西岸的路“不是给回去的人走的”。我没听懂他原话。</p><p><b>oldmap：</b> 我2009年去过更下游，树上确实有一套刻痕。像路标但不像方向。</p><p><b>hanchuan.photo：</b> 我画了几个。${g('road','r')} ${g('rain','d')} ${g('eye','r')}。如果有人认识这种记号私信。</p><p><b>回复 17：</b> 别把它当字典。当地人说同一个形状换缺口方向意思会变。</p>`},
 flashdev:{cls:'archive-old',source:'个人网页缓存 / 2013',title:'《林线之外》开发日志',deck:'作者 hanchuan.photo。页面最后抓取时间早于其失踪三年。',img:'assets/photos/normal_07.webp',body:`<p>2011-08-04：终于把河流滚动做出来。地图不是我画的，是照着一张手绘路线描的。</p><p>2012-02-19：有人留言说我隐藏地图太像乌伦上游。其实本来就是。</p><p>2013-11-02：新增“门”。提示不写中文了，改成那套符号。懂的人自己懂。</p><p>旧入口仍然可以运行：<button class="link" data-go="flash">打开《林线之外》</button></p>`},
 toponym:{cls:'',source:'阿泽拉语言资料档案 / 1987',title:'乌伦河上游旧地名与季节性聚落称谓',deck:'“Amokha”可能不是地名，而是一种“成为内部之物”的表达。',img:'assets/photos/exp_07.webp',body:`<p>调查者记录到的 /amo-kha/ 没有稳定对应地点。受访者在谈到住处、家庭成员、已故亲属和“被留下的客人”时都会使用近似词。</p><p>笔记中特别强调一个语法现象：符号主体本身不足以表达完整意思，开口方向区分“向内归属”“从外进入”“已经离开”等状态。</p><p>因此早期把这些记号解释成猎区界标，可能过度简化。</p>`},
 ritualnotes:{cls:'archive-cult',source:'私人田野笔记扫描 / 1978',title:'关于身体保存与家庭记忆的十二项说明',deck:'这份笔记没有发表。抄写者称以下内容由聚落中的一名老人“用非常耐心的方式解释”。',img:'assets/photos/rit_05.webp',body:`<p>他们不把埋葬称为死亡，而称为“把能记得的东西交给泥”。老人认为这比切分身体更残忍，因为泥不会把一个人的名字说给孩子听。</p><p>孩子第一次参加留身礼时不被强迫吃固体。他们可以从汤开始。哭泣会被允许，但不能嘲笑哭泣的人，因为恐惧说明孩子仍然把身体和人混在一起。</p><p>眼睛通常不给孩子。老人说，孩子不应该太早保存别人最后看到的东西。舌头也不是每个人都能分到，只有需要继续说某种语言的人才可以。</p><p>火被视为彻底的浪费。记录者在这里抄了 ${g('fire','u')}。骨头却不能吃，因为骨头“不记得路，也不记得声音”，它们被放回河边；页边同时画着 ${g('bone','d')} 与 ${g('river','r')}。</p><p>一个死在聚落之外的人，如果名字还能被带回来，也可以通过名字进入家庭。页边把 ${g('name','r')} 和 ${g('home','r')} 连在一起。于是有人会持续重复死者最后说过的话。</p><p>盐只用于交换与保存普通食物，不能接触留身礼的肉；记录者在这条规则旁抄下 ${g('salt','l')}。主持仪式的老人身上常画 ${g('elder','u')}，而负责切分与医治伤口的人使用另一种近似手掌的记号 ${g('hand','r')}。</p><p>夜里做梦被认为是死者“练习说话”的时候。儿童在第一次参加留身礼后的三个夜晚不独睡。笔记旁是 ${g('night','d')} 与 ${g('dream','u')}。</p><p>我问：如果一个外来者不愿意呢？老人回答：我们不会因为他不懂就生气。小孩也常常不懂。等他懂了，他就不再是外面的人。</p>`}
};let d=docs[id]||docs.missing2016;if(id==='missing2016')flag('old_missing_verified');if(id==='oldthread'){discover('road','oldthread');discover('rain','oldthread');discover('eye','oldthread')}if(id==='toponym')discover('home','toponym');if(id==='ritualnotes'){['body','mouth','bone','fire','river','name','salt','elder','hand','night','dream','child'].forEach(n=>discover(n,'ritualnotes'))}
 app.innerHTML=`<section class="archive ${d.cls}"><header class="archive-top"><span>缓存 / 文档</span><span>${d.source}</span></header><article class="archive-paper"><div class="source">${d.source}</div><h1>${d.title}</h1><div class="deck">${d.deck}</div><div class="meta">来源已保存 · 页面可能与当前网站版本不同</div><img src="${d.img}"><div class="archive-body">${d.body}</div></article></section>`;
}

function renderMedical(){flag('medical_read');
 app.innerHTML=`<section class="sheet"><header class="sheet-top"><div class="sheet-icon">S</div><div class="sheet-title"><strong>FIELD_MEDICAL_0922</strong><small>阿泽拉联合项目 · 林澈</small></div></header><div class="sheet-toolbar">文件　编辑　查看　插入　数据　工具　　100%　　Arial 10　　共享：只读</div><div class="sheet-body"><div class="sheet-grid"><table class="med-table"><thead><tr><th>时间</th><th>成员</th><th>主诉</th><th>进食</th><th>处理</th><th>备注</th></tr></thead><tbody><tr><td>09/22 16:20</td><td>周野</td><td>恶心、轻微腹痛</td><td>12:30 聚落午餐</td><td>补液</td><td>无发热</td></tr><tr><td>09/22 16:40</td><td>陈栩</td><td>呕吐一次</td><td>同上</td><td>观察</td><td>心理因素可能</td></tr><tr class="warn"><td>09/22 17:05</td><td>王敬山</td><td>无症状</td><td>同上</td><td>—</td><td>反复询问“昨天的汤是不是同一种肉”</td></tr><tr class="bad"><td>09/22 23:10</td><td>林澈</td><td>失眠</td><td>—</td><td>—</td><td>帐篷外有人重复叫名字。声音与下午见过的女人相同。</td></tr><tr class="bad"><td>09/23 00:02</td><td>全队</td><td>—</td><td>—</td><td>准备撤离</td><td>高桥重译“分给”：不是给予食物，可能是“把某种能力留在另一个身体里”。</td></tr></tbody></table></div><aside class="sheet-comments"><h3>批注</h3><div class="comment"><strong>高桥</strong><time>09/22 23:58</time><p>我之前把 ${g('eye','r')} + ${g('home','r')} 当“守卫”。现在更像“让看见的人归到里面”。</p></div><div class="comment"><strong>林澈</strong><time>09/23 00:06</time><p>如果“口”不是吃而是声音，那中午一直重复的 ${g('mouth','r')} ${g('body','d')} 可能是“身体里留下的声音”。</p></div><div class="sheet-hint">你不需要在这里回答。把你对重复符号的理解记在自己的笔记里。</div></aside></div></section>`;
 discover('mouth','medical');discover('body','medical');flag('medical_meaning');
}

function renderDrone(){if(!has('first_convergence')){app.innerHTML=`<section class="drone"><div style="grid-column:1/-1;display:grid;place-items:center"><div><h2>访问受限</h2><p>后方协调尚未开放这批预览。</p><button class="ghost" data-go="chat">返回FieldTalk</button></div></div></section>`;return}
 app.innerHTML=`<section class="drone"><aside class="drone-files"><strong>DRONE CACHE</strong>${['F0921_1318','F0921_1323','F0921_1327','F0921_1334','F0921_1342'].map((x,i)=>`<div class="drone-file ${i===3?'active':''}">${x}.LOW</div>`).join('')}</aside><main class="drone-view"><img src="assets/photos/rit_02.webp"><div class="drone-hud"></div></main><aside class="drone-meta"><h2>F0921_1334.LOW</h2><dl><dt>坐标</dt><dd>UL-03 / W ridge</dd><dt>高度</dt><dd>142.3 m AGL</dd><dt>缓存</dt><dd>960 × 540 proxy</dd><dt>识别</dt><dd>规则屋顶 11–14<br>中央空地 1<br>烟源 3</dd></dl><button class="drone-mark" id="droneMark">将聚落范围标到GIS</button><p style="margin-top:25px">中央空地上能看到与相册一致的符号排列：${g('home','r')} ${g('body','d')} ${g('elder','u')}</p></aside></section>`;discover('elder','drone');document.getElementById('droneMark').onclick=()=>{flag('drone_verified');toast('位置已与轨迹偏转段对齐')};
}

const flashMap=[
 '############','#..p......w#','#..###..ww.#','#....#.....#','#.w..#..g..#','#P...#.....#','############'
];
function renderFlash(){flag('flash_seen');let {x,y}=state.flash;let cells='';for(let yy=0;yy<7;yy++)for(let xx=0;xx<12;xx++){let ch=flashMap[yy][xx],cls=ch==='#'?'flash-path':ch==='w'?'flash-water':ch==='g'?'flash-gate':'';if(xx===x&&yy===y)cls+=' flash-player';cells+=`<div class="flash-tile ${cls}"></div>`}
 app.innerHTML=`<div class="oldweb-wrap"><section class="oldweb"><header class="old-banner"><h1>林线之外</h1><small>一个关于方向、河流和走丢的人的小游戏 / hanchuan.photo</small></header><nav class="old-nav"><a>主页</a><a>游戏</a><a>留言板</a><a>开发日志</a><span class="old-counter">001783</span></nav><div class="old-layout"><aside class="old-side"><b>更新</b><p>2013.11.02<br>隐藏区“门”重新做了。</p><p>2012.02.19<br>有人问地图是不是乌伦上游。自己猜。</p><p><button class="link" data-go="article?id=flashdev">查看缓存开发日志</button></p></aside><main class="old-main"><h2>LINELIMIT.swf</h2><div class="flash-frame"><div class="flash-game">${cells}</div></div><div class="flash-help"><p>方向键移动。水不能走。作者没有留下完整说明。</p><p>隐藏门边刻着三组符号：${g('rain','d')} ${g('road','r')} ${g('eye','r')}。旧论坛里也出现过它们。</p><div><button id="up">↑</button> <button id="left">←</button> <button id="down">↓</button> <button id="right">→</button></div></div></main><aside class="old-side old-right"><b>推荐链接</b><p>户外论坛<br><s>第三支流摄影记</s><br><s>乌伦河旧地图</s></p>${has('flash_gate')?`<div class="old-popup"><b>隐藏区域已保存</b><p>门后不是终点，是一张手绘路线。右上角写着：${g('home','r')} ${g('return','r')} ${g('mouth','r')}</p></div>`:''}</aside></div></section></div>`;
 discover('rain','flash');discover('road','flash');discover('eye','flash');const move=(dx,dy)=>{let nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>11||ny>6)return;let ch=flashMap[ny][nx];if(ch==='#'||ch==='w')return;state.flash={x:nx,y:ny};if(ch==='g'){flag('flash_gate');discover('return','flash');discover('home','flash');discover('mouth','flash');toast('旧游戏在浏览器本地保存了一个隐藏区域')}save();renderFlash()};[['up',0,-1],['down',0,1],['left',-1,0],['right',1,0]].forEach(a=>document.getElementById(a[0]).onclick=()=>move(a[1],a[2]));
}

function renderNotes(){
 const known=glyphNames.filter(n=>has('glyph_'+n));const sources=[['路线偏转',has('map_deviation'),'map'],['旧相机 / 2016失踪案',has('old_missing_verified'),'search?q=Sony%20W220%20乌伦河'],['科考队与聚落直接接触',has('contact_record'),'chat'],['医疗记录里的重译',has('medical_meaning'),'medical'],['旧Flash隐藏门',has('flash_gate'),'flash'],['无人机聚落范围',has('drone_verified'),'drone'],['最后日志',has('last_log'),'article?id=lastlog']];
 app.innerHTML=`<section class="notes"><div class="notebook"><div class="note-page"><h1>调查页</h1><div class="scribble">${sources.map(s=>`<div class="note-source"><span>${s[1]?'●':'○'} ${s[0]}</span>${s[1]?` <button data-go="${s[2]}">来源</button>`:''}</div>`).join('')}<p class="note-reminder">${has('first_convergence')?'轨迹、旧相机和接触记录已经可以互相解释：他们是主动进入聚落方向。':''}</p><p>${has('ritual_understood')?'阿摩迦所谓“留下”不是纪念品。他们把身体、语言和技能当作可在家庭内部保存的东西。':''}</p></div></div><div class="note-page"><h1>重复符号</h1><p style="font:12px var(--serif);color:#6d6455">你只记录自己见过的。输入框不会判断你写得对不对；真正的含义要靠后面的资料自己校正。</p>${known.length?known.map(n=>`<div class="hypo-row">${g(n,'r')}<div><input data-hypo="${n}" value="${escapeHtml(state.notes[n]||'')}" placeholder="我的猜测……"><small>${glyphContext[n]}</small></div></div>`).join(''):'<p class="scribble">还没有值得反复记录的符号。</p>'}</div></div></section>`;app.querySelectorAll('[data-hypo]').forEach(i=>i.onchange=e=>{state.notes[e.target.dataset.hypo]=e.target.value;save()});
}

function renderRescue(){let ready=has('final_ready');app.innerHTML=`<section class="sar"><header class="sar-head"><strong>区域搜救协调系统</strong><span>事件 AZ-2026-091 / 补充材料</span></header><div class="sar-body"><aside class="sar-side"><div class="sar-step">01 事件信息</div><div class="sar-step">02 初始搜索区</div><div class="sar-step current">03 外部材料补充</div><div class="sar-step">04 提交与归档</div></aside><main class="sar-form"><h1>外部材料补充</h1><p>用于补充现场搜救区域判断。不要提交无法说明来源的坐标。</p><div class="sar-notice">本系统不会判断民俗、宗教或犯罪性质。只需要填写与搜索区域和现场风险直接有关的事实。</div><fieldset><legend>搜索区域依据</legend><label>最后可信区域<select id="area"><option value="">请选择</option><option value="west">第三支流西南侧山脊 / 聚落范围</option><option value="north">原计划北线</option></select></label><label>定位依据<textarea id="basis" placeholder="说明为什么不是GPS漂移，以及有哪些独立来源能互相印证"></textarea></label></fieldset><fieldset><legend>现场风险</legend><label>风险类别<select id="danger"><option value="">请选择</option><option value="human">可能存在人员控制 / 暴力风险</option><option value="weather">仅气象风险</option></select></label><label>补充说明<textarea id="note" placeholder="不要推断，只写你能引用的事实"></textarea></label></fieldset><button id="submitSar" class="sar-submit" ${ready?'':'disabled'}>提交补充材料</button><div class="sar-check">${ready?'系统检测到：轨迹、无人机预览与最后日志均已获得。':'还缺少能够互相验证的最后位置资料。'}</div></main></div></section>`;document.getElementById('submitSar').onclick=()=>{if(!ready)return;if(document.getElementById('area').value!=='west'||document.getElementById('danger').value!=='human'){toast('这个选择与现有材料冲突。再核对轨迹和最后日志。');return}state.submitted=true;save();go('ending')};
}

function renderEnding(){app.innerHTML=`<section class="ending"><article class="bulletin"><div class="seal">区域搜救协调中心 / 事件通报 AZ-2026-091</div><h1>关于阿泽拉雨林失联科考队的阶段性通报</h1><time>2026年10月19日</time><p>根据项目方、失联人员家属及外部协作人员提供的补充资料，搜救队于第三支流西南侧山脊发现部分科考装备、无人机残片和一处近期有人使用过的临时建筑群。</p><p>现场未发现六名失联人员。建筑群在搜救队抵达前已被清空，部分木构件存在焚烧痕迹。经连续搜索，未发现能够证明该区域存在长期固定人口聚居的材料。</p><p>考虑到持续强降雨、地质风险及可搜索范围，当前大规模地面搜救阶段暂停。事件仍保持开放状态。</p><div class="bulletin-sign">区域搜救协调中心<br>2026.10.19</div></article><div class="ending-notice"><div class="glyph-avatar">${g('eye','r')}</div><div><b>WildTrace · 新关注</b><p>amk_1978 关注了你。最近位置：城市公共交通。</p></div><button data-go="wild">查看</button></div></section>`;}

function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

// inject hidden last log as an archive once conditions allow
const oldRenderArticle=renderArticle;renderArticle=function(){if(param('id')!=='lastlog')return oldRenderArticle();if(!has('last_log_ready')){app.innerHTML='<section class="archive"><article class="archive-paper"><h1>文件不可用</h1><p>你还没有找到这份缓存的来源。</p></article></section>';return}flag('last_log');discover('name','lastlog');discover('dream','lastlog');discover('return','lastlog');app.innerHTML=`<section class="archive archive-cult"><header class="archive-top"><span>周野 / 设备缓存</span><span>恢复于卫星箱未发送队列</span></header><article class="archive-paper"><div class="source">RECOVERED NOTE · 09/23 ??:??</div><h1>没有发出去的文字</h1><div class="archive-body"><p>我已经不知道现在几点了。他们把表拿走以后，我只能靠外面的光算，但这里每天都在下雨，下午和早上看起来一样。</p><p>林澈昨晚还活着。我确定。她在隔壁一直问为什么要给她洗头。今天早上我又听见她说话，声音就在门外，我差一点真的以为她出来了。</p><p>进来的女人不会普通话。可她说了一句林澈昨晚说过的话，一模一样，连中间停一下的地方都一样。</p><p>高桥终于把墙上那组字讲明白。不是“守卫”。也不是“留下遗物”。${g('eye','r')} ${g('home','r')} 是让看见过这里的人变成里面的人；${g('mouth','r')} ${g('body','d')} 是把声音留在身体里。</p><p>他们不觉得这是惩罚。他们甚至很耐心。一个老人给我看孩子怎么学这些字，说孩子第一次害怕的时候可以只喝汤。</p><p>最可怕的是我现在不觉得他们疯。他们每个人都非常清楚自己在做什么。</p><p>无人机最后那片屋顶就在轨迹向西南偏以后第三个河弯的上方。我们不是迷路，是跟着他们走的。明早如果还有机会，我们会沿旧河槽往东下切，不回原路。</p><p>如果你最后还是没赶上飞机，就别进来。把这个交给罗岚。别自己来找。</p></div></article></section>`;}

// allow path to last log from notes once conditions met
const oldNotes=renderNotes;renderNotes=function(){oldNotes();if(has('last_log_ready')&&!has('last_log')){const el=app.querySelector('.note-page:first-child .scribble');if(el)el.insertAdjacentHTML('beforeend','<div class="note-source"><span>● 卫星箱未发送缓存</span> <button data-go="article?id=lastlog">打开恢复文字</button></div>');bind()}}

render();sound(state.sound);
})();
