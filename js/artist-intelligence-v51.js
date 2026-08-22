(()=>{
'use strict';
const VERSION='20260822-1';
const PROFILE_KEY='mcArtistIntelligenceV51';
const TAKE_KEY='mcMelodyTakesV51';
function patch(){
  try{
    const frame=document.getElementById('beatFrame');
    const w=frame&&frame.contentWindow,d=w&&w.document;
    if(!w||!d||!w.__mcSmartV5||w.__mcArtistIntelligenceV51)return;
    install(w,d);
  }catch(e){console.error('Artist Intelligence v5.1 loader',e)}
}
function install(w,d){
  if(w.__mcArtistIntelligenceV51)return;
  const $=id=>d.getElementById(id);
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const norm=s=>clean(s).toLowerCase().replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
  const words=s=>clean(s).split(/\s+/).filter(Boolean);
  const read=(k,f)=>{try{return JSON.parse(w.localStorage.getItem(k)||'')||f}catch(e){return f}};
  const write=(k,v)=>{try{w.localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const baseGenerate=w.generateSong;
  if(typeof baseGenerate!=='function')return;

  const style=d.createElement('style');
  style.id='mcArtistIntelligenceStyle';
  style.textContent=`
  #mcArtistIntelligence{margin-top:10px;border:1px solid #38384a;border-radius:14px;background:#0c0c12;padding:12px}
  #mcArtistIntelligence summary{font-size:13px;font-weight:900;cursor:pointer}
  #mcArtistIntelligence .mcGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
  #mcArtistIntelligence .mcField{margin-top:8px}
  #mcArtistIntelligence label{display:block;font-size:10px;font-weight:900;color:#d8d8e3;margin-bottom:4px}
  #mcArtistIntelligence input,#mcArtistIntelligence select,#mcArtistIntelligence textarea{width:100%;border:1px solid #333342;border-radius:10px;background:#09090e;color:#fff;padding:9px;font:inherit;font-size:12px}
  #mcArtistIntelligence textarea{min-height:62px;resize:vertical}
  #mcArtistIntelligence .mcTiny{font-size:10px;color:#a3a3b3;line-height:1.4;margin-top:6px}
  #mcArtistIntelligence .mcActions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}
  #mcArtistIntelligence .mcBtn{border:1px solid #343445;border-radius:10px;background:#171720;color:#fff;padding:9px;font-weight:800;font-size:11px}
  #mcArtistIntelligence .mcTakeRow{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:7px}
  #mcArtistIntelligence .mcTake{border:1px solid #343445;border-radius:10px;background:#121219;color:#ddd;padding:8px;font-size:10px;font-weight:800}
  #mcArtistIntelligence .mcTake.done{border-color:#2e6a54;background:rgba(52,211,153,.12);color:#a9efd0}
  #mcArtistFitCard{margin-top:10px;border:1px solid #343445;border-radius:12px;background:#0c0c12;padding:11px}
  #mcArtistFitCard .mcScores{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}
  #mcArtistFitCard .mcScore{border:1px solid #2d2d3a;border-radius:10px;padding:8px;background:#101017}
  #mcArtistFitCard b{display:block;font-size:16px}.mcSub{font-size:9px;color:#a3a3b3}
  #mcArtistFitCard .mcCoach{font-size:10px;color:#d8d8e3;line-height:1.45;margin-top:8px;white-space:pre-wrap}
  @media(max-width:640px){#mcArtistIntelligence .mcGrid{grid-template-columns:1fr}#mcArtistFitCard .mcScores{grid-template-columns:repeat(2,1fr)}}`;
  d.head.appendChild(style);

  const host=d.createElement('details');
  host.id='mcArtistIntelligence';
  host.innerHTML=`<summary>🎯 Artist Intelligence + Melody-First Coach v5.1</summary>
  <div class="mcTiny">This makes the song relative to the artist, audience, voice, story and purpose instead of using one universal “hit” formula.</div>
  <div class="mcGrid">
    <div class="mcField"><label>Artist lane</label><select id="mcLane">
      <option value="auto">Let the song decide</option><option value="alt-pop">Alternative / dark pop</option><option value="indie-pop">Indie / bedroom pop</option><option value="acoustic-pop">Acoustic pop</option><option value="pop-rock">Pop-rock / emo-pop</option><option value="alt-rnb">Alternative R&B</option><option value="melodic-rap">Melodic rap</option><option value="hip-hop">Hip-hop</option><option value="country">Country</option>
    </select></div>
    <div class="mcField"><label>Song purpose</label><select id="mcPurpose">
      <option value="story">Tell a real story</option><option value="heartbreak">Make the listener feel the heartbreak</option><option value="confidence">Make the listener feel stronger</option><option value="connection">Feel intimate / understood</option><option value="escape">Create atmosphere / escape</option><option value="movement">Make people move / sing along</option><option value="reflection">Make the listener think</option>
    </select></div>
    <div class="mcField"><label>Target listener / audience</label><input id="mcAudience" placeholder="Example: people my age who overthink breakups"></div>
    <div class="mcField"><label>Listener promise</label><select id="mcPromise"><option value="honesty">Honest / personal</option><option value="catchy">Catchy / replayable</option><option value="atmosphere">Atmosphere / mood</option><option value="storytelling">Storytelling</option><option value="confidence">Confidence / energy</option><option value="escape">Escape / fantasy</option></select></div>
    <div class="mcField"><label>Specificity</label><select id="mcSpecificity"><option value="balanced">Balanced</option><option value="postcard">Personal / postcard specific</option><option value="universal">More universal</option></select></div>
    <div class="mcField"><label>Comfortable vocal zone</label><select id="mcVocalZone"><option value="low-mid">Low / middle, conversational</option><option value="mid">Middle range</option><option value="mid-high">Middle / higher melodic</option><option value="wide">Wide range / willing to stretch</option></select></div>
    <div class="mcField"><label>Delivery energy</label><select id="mcDelivery"><option value="conversational">Conversational / talk-sung</option><option value="restrained">Restrained / intimate</option><option value="open">Open / projected</option><option value="energetic">Energetic / rhythmic</option></select></div>
    <div class="mcField"><label>Where / when is the song?</label><input id="mcWhere" placeholder="Example: parking lot at 2 AM after the party"></div>
  </div>
  <div class="mcField"><label>What actually happened? Use one plain sentence.</label><textarea id="mcWhat" placeholder="Example: I heard somebody laugh like my ex and turned around before I realized it wasn't them."></textarea></div>
  <div class="mcField"><label>What was actually said? (optional)</label><textarea id="mcSaid" placeholder="A real sentence or short phrase from the situation"></textarea></div>
  <div class="mcField"><label>What did you do next?</label><textarea id="mcNext" placeholder="Example: I went back to the conversation and acted like nothing happened."></textarea></div>
  <div class="mcField"><label>What should the listener understand by the end?</label><textarea id="mcMeaning" placeholder="Example: I don't want the relationship back, but familiar sounds can still get to me."></textarea></div>
  <div class="mcField"><label>Melody-first pass</label><div class="mcTiny">Before locking lyrics, freestyle the section 2–3 times with sounds or rough words. Pick what feels easiest to repeat. No theory required.</div><div class="mcTakeRow"><button type="button" class="mcTake" data-take="1">Take 1</button><button type="button" class="mcTake" data-take="2">Take 2</button><button type="button" class="mcTake" data-take="3">Take 3</button></div></div>
  <div class="mcField"><label>What worked in the best melody take?</label><input id="mcMelodyNote" placeholder="Example: short hook, held last word, verse almost spoken"></div>
  <div class="mcActions"><button type="button" class="mcBtn" id="mcSaveArtist">Save Artist DNA</button><button type="button" class="mcBtn" id="mcResetArtist">Reset Artist DNA</button></div>`;

  const theme=$('theme');
  if(theme){
    const parent=theme.closest('.field')||theme.parentElement;
    if(parent)parent.insertAdjacentElement('afterend',host);
  }

  const ids=['mcLane','mcPurpose','mcAudience','mcPromise','mcSpecificity','mcVocalZone','mcDelivery','mcWhere','mcWhat','mcSaid','mcNext','mcMeaning','mcMelodyNote'];
  function getProfile(){const p={};for(const id of ids)p[id]=clean($(id)&&$(id).value);return p}
  function loadProfile(){const p=read(PROFILE_KEY,{});for(const id of ids)if($(id)&&p[id]!=null)$(id).value=p[id]}
  function saveProfile(){write(PROFILE_KEY,getProfile());const s=$('genStatus');if(s)s.textContent='Artist DNA saved on this device.'}
  loadProfile();

  $('mcSaveArtist').onclick=saveProfile;
  $('mcResetArtist').onclick=()=>{w.localStorage.removeItem(PROFILE_KEY);w.localStorage.removeItem(TAKE_KEY);for(const id of ids){const el=$(id);if(!el)continue;if(el.tagName==='SELECT')el.selectedIndex=0;else el.value=''}d.querySelectorAll('.mcTake').forEach(b=>b.classList.remove('done'));const s=$('genStatus');if(s)s.textContent='Artist Intelligence profile reset.'};
  const takeState=read(TAKE_KEY,{});
  d.querySelectorAll('.mcTake').forEach(b=>{const n=b.dataset.take;if(takeState[n])b.classList.add('done');b.onclick=()=>{b.classList.toggle('done');takeState[n]=b.classList.contains('done');write(TAKE_KEY,takeState)}});

  const laneMap={
    'alt-pop':'Alternative pop','indie-pop':'Indie pop','acoustic-pop':'Acoustic pop','pop-rock':'Alternative rock','alt-rnb':'Alternative R&B','melodic-rap':'Melodic rap pop','hip-hop':'Hip-hop','country':'Country'
  };
  const purposeKeywords={
    story:['said','told','called','left','walked','drove','went','came','night','morning','door','phone'],
    heartbreak:['miss','left','over','goodbye','gone','name','call','alone','remember'],
    confidence:['know','move','built','proof','strong','mine','ready','done','forward'],
    connection:['you','we','know','hear','tell','stay','close','understand','with'],
    escape:['night','light','drive','air','music','city','dream','outside','away'],
    movement:['move','dance','again','tonight','everybody','right','one','more','now'],
    reflection:['know','think','learn','realize','understand','changed','time','why']
  };
  const laneTarget={
    'alt-pop':{words:7,hook:6},'indie-pop':{words:8,hook:6},'acoustic-pop':{words:8,hook:7},'pop-rock':{words:9,hook:7},'alt-rnb':{words:7,hook:6},'melodic-rap':{words:9,hook:7},'hip-hop':{words:11,hook:8},'country':{words:10,hook:8},auto:{words:9,hook:7}
  };
  function simpleLine(s,max){let a=words(s);if(a.length>max)a=a.slice(0,max);return a.join(' ')}
  function profileBrief(p){
    const bits=[];
    if(p.mcPurpose)bits.push('song purpose '+p.mcPurpose);
    if(p.mcAudience)bits.push('audience '+p.mcAudience);
    if(p.mcPromise)bits.push('listener promise '+p.mcPromise);
    if(p.mcWhere)bits.push('setting '+p.mcWhere);
    if(p.mcWhat)bits.push('what happened '+p.mcWhat);
    if(p.mcSaid)bits.push('what was said '+p.mcSaid);
    if(p.mcNext)bits.push('what happened next '+p.mcNext);
    if(p.mcMeaning)bits.push('meaning '+p.mcMeaning);
    return bits.join('; ');
  }
  function personalize(text,p){
    if(p.mcSpecificity==='universal')return text;
    const lines=text.split('\n');
    const inserts=[];
    if(p.mcWhat)inserts.push(simpleLine(p.mcWhat,12));
    if(p.mcWhere&&p.mcSpecificity==='postcard')inserts.push(simpleLine(p.mcWhere,10));
    if(p.mcNext)inserts.push(simpleLine(p.mcNext,12));
    if(p.mcSaid&&p.mcSpecificity==='postcard')inserts.push(simpleLine(p.mcSaid,10));
    let ix=0,section='';
    for(let i=0;i<lines.length&&ix<inserts.length;i++){
      if(/^\[Verse 1\b/i.test(lines[i]))section='v1';
      else if(/^\[Verse 2\b/i.test(lines[i]))section='v2';
      else if(/^\[/i.test(lines[i]))section='other';
      if((section==='v1'||section==='v2')&&lines[i]&&!/^\[|^→|^SMART|^Topic:|^Concept|^Genre|^Quality|^Rewrite|^VOCAL|^NOTE/i.test(lines[i])){
        const replacement=inserts[ix++];
        if(replacement&&words(replacement).length>=3)lines[i]=replacement;
      }
    }
    return lines.join('\n');
  }
  function lyricLines(text){return text.split('\n').map(clean).filter(x=>x&&!/^\[|^→|^SMART|^Topic:|^Concept lanes:|^Genre family:|^Quality tournament:|^Quality checks:|^Rewrite mode:|^VOCAL PRODUCTION|^NOTE|^Verse:|^Hook:|^Delay|^Ad-libs/i.test(x)&&x!=='[NO VOCAL]')}
  function sectionLines(text,name){
    const arr=text.split('\n'),out=[];let on=false;
    for(const raw of arr){const x=clean(raw);if(/^\[/.test(x)){on=new RegExp('^\\['+name,'i').test(x);continue}if(on&&x&&!/^→/.test(x))out.push(x)}return out;
  }
  function jaccard(a,b){const A=new Set(norm(a).split(' ').filter(x=>x.length>3)),B=new Set(norm(b).split(' ').filter(x=>x.length>3));if(!A.size||!B.size)return 0;let n=0;A.forEach(x=>{if(B.has(x))n++});return n/(A.size+B.size-n||1)}
  function score(text,p){
    const all=lyricLines(text),hook=sectionLines(text,'Hook'),v1=sectionLines(text,'Verse 1'),v2=sectionLines(text,'Verse 2');
    const target=laneTarget[p.mcLane]||laneTarget.auto;
    const avg=all.length?all.reduce((n,x)=>n+words(x).length,0)/all.length:10;
    const hookAvg=hook.length?hook.reduce((n,x)=>n+words(x).length,0)/hook.length:9;
    let artist=100-Math.abs(avg-target.words)*7-Math.abs(hookAvg-target.hook)*6;
    if(p.mcDelivery==='conversational'&&avg<=9)artist+=5;
    if(p.mcDelivery==='restrained'&&hookAvg<=7)artist+=4;
    if(p.mcDelivery==='energetic'&&avg>=7)artist+=3;
    artist=clamp(artist,0,100);
    let melody=70;
    if(hookAvg>=3&&hookAvg<=7)melody+=14;else melody-=Math.abs(hookAvg-6)*5;
    const vowelEnds=hook.filter(x=>/[aeiouy]$/.test(norm(x))).length;melody+=hook.length?vowelEnds/hook.length*10:0;
    if(p.mcMelodyNote&&/short|hold|space|spoken|simple|repeat/i.test(p.mcMelodyNote))melody+=5;
    melody=clamp(melody,0,100);
    let story=62;
    if(v1.length&&v2.length)story+=(1-jaccard(v1.join(' '),v2.join(' ')))*22;
    if(p.mcWhat&&norm(text).includes(norm(simpleLine(p.mcWhat,12))))story+=10;
    if(p.mcNext&&norm(text).includes(norm(simpleLine(p.mcNext,12))))story+=8;
    story=clamp(story,0,100);
    let specificity=55;
    const details=[p.mcWhere,p.mcWhat,p.mcSaid,p.mcNext].filter(Boolean);let hit=0;
    for(const x of details){const q=norm(simpleLine(x,p.mcWhere===x?10:12));if(q&&norm(text).includes(q))hit++}
    specificity+=details.length?hit/details.length*38:8;
    if(p.mcSpecificity==='universal')specificity=80;
    specificity=clamp(specificity,0,100);
    const keys=purposeKeywords[p.mcPurpose]||[];let km=0;const nt=norm(text);
    for(const k of keys)if(nt.includes(k))km++;
    let purpose=clamp(55+km*6,0,100);
    if(p.mcMeaning&&norm(text).includes(norm(simpleLine(p.mcMeaning,8))))purpose+=8;
    purpose=clamp(purpose,0,100);
    const total=Math.round(artist*.26+melody*.22+story*.20+specificity*.14+purpose*.18);
    return{total,artist:Math.round(artist),melody:Math.round(melody),story:Math.round(story),specificity:Math.round(specificity),purpose:Math.round(purpose)};
  }
  function coachText(sc,p){
    const notes=[];
    if(sc.artist<72)notes.push('Artist fit: simplify the line density or try a neighboring lane.');
    if(sc.melody<72)notes.push('Melody fit: shorten the hook and leave a word you can comfortably hold.');
    if(sc.story<72)notes.push('Story: make Verse 2 reveal a consequence, decision or new information instead of repeating Verse 1.');
    if(sc.specificity<70&&p.mcSpecificity!=='universal')notes.push('Specificity: add one real place, action, object or sentence from the moment.');
    if(sc.purpose<70)notes.push('Purpose: make every major section reinforce what the listener should feel or do.');
    if(!notes.length)notes.push('The draft passes the artist-relative checks. Keep the melody take that feels easiest to repeat, then edit any line you would never say naturally.');
    notes.push('Melody-first reminder: try 2–3 passes for the hook, verse and pre separately. The first good idea can win; you do not need to force all sections from one freestyle.');
    return notes.join('\n');
  }
  function renderScore(sc,p){
    let card=$('mcArtistFitCard');if(!card){card=d.createElement('div');card.id='mcArtistFitCard';const actions=$('songActions');if(actions)actions.insertAdjacentElement('afterend',card);else $('song').insertAdjacentElement('afterend',card)}
    card.innerHTML=`<strong>🎯 Artist-relative song check • ${sc.total}/100</strong><div class="mcScores">
      <div class="mcScore"><b>${sc.artist}</b><span class="mcSub">artist / voice fit</span></div>
      <div class="mcScore"><b>${sc.melody}</b><span class="mcSub">melody friendliness</span></div>
      <div class="mcScore"><b>${sc.story}</b><span class="mcSub">story progression</span></div>
      <div class="mcScore"><b>${sc.specificity}</b><span class="mcSub">specificity</span></div>
      <div class="mcScore"><b>${sc.purpose}</b><span class="mcSub">song purpose</span></div>
      <div class="mcScore"><b>${sc.total}</b><span class="mcSub">combined coach score</span></div></div><div class="mcCoach">${coachText(sc,p)}</div>`;
  }
  function runCoach(mode){
    const p=getProfile();write(PROFILE_KEY,p);
    const themeEl=$('theme'),genreEl=$('genre'),goalEl=$('goal');
    const originalTheme=themeEl?themeEl.value:'',originalGenre=genreEl?genreEl.value:'',originalGoal=goalEl?goalEl.value:'';
    if(themeEl){const brief=profileBrief(p);themeEl.value=[originalTheme,brief].filter(Boolean).join('; ')}
    if(genreEl&&p.mcLane&&p.mcLane!=='auto'&&laneMap[p.mcLane])genreEl.value=laneMap[p.mcLane];
    if(goalEl){if(p.mcPurpose==='story'||p.mcPurpose==='reflection')goalEl.value='Emotional storytelling';else if(p.mcPromise==='catchy'||p.mcPurpose==='movement')goalEl.value='Strongest hook'}
    try{baseGenerate(mode)}finally{if(themeEl)themeEl.value=originalTheme;if(genreEl)genreEl.value=originalGenre;if(goalEl)goalEl.value=originalGoal}
    const song=$('song');if(!song)return;
    const personalized=personalize(song.textContent||'',p);song.textContent=personalized;
    const sc=score(personalized,p);renderScore(sc,p);
    const s=$('genStatus');if(s)s.textContent=(mode?'✅ Rebuilt':'✅ Generated')+' • Smart Composer v5 + Artist Intelligence v5.1 • artist-relative '+sc.total+'/100';
    w.__mcArtistLastV51={profile:p,score:sc,text:personalized};
  }
  w.generateSong=runCoach;
  const again=$('again');if(again)again.onclick=()=>w.generateSong(null);
  for(const b of d.querySelectorAll('[data-f]')){
    const old=b.onclick,key=b.dataset.f;
    if(typeof old==='function')b.onclick=e=>{old.call(b,e);setTimeout(()=>{if(['too_wordy','weird_lyrics','bad_placement','too_generic','too_repetitive','weak_hook'].includes(key)){const p=getProfile(),song=$('song');if(song){song.textContent=personalize(song.textContent||'',p);renderScore(score(song.textContent||'',p),p)}}},100)};
  }
  const meta=$('packMeta');if(meta&&!$('mcArtistBadge')){const b=d.createElement('span');b.id='mcArtistBadge';b.textContent='Artist Intelligence v5.1 • melody-first + audience-aware';meta.appendChild(b)}
  w.__mcArtistIntelligenceV51=true;
}
const frame=document.getElementById('beatFrame');
if(frame)frame.addEventListener('load',()=>{setTimeout(patch,700);setTimeout(patch,1600);setTimeout(patch,2800)});
setInterval(patch,1400);setTimeout(patch,900);
})();