(()=>{
'use strict';
const CMU_URL='https://cdn.jsdelivr.net/gh/cmusphinx/cmudict@master/cmudict.dict';
const PRIORS_URL='data/open-structure-priors-v1.json';
let priors=null,cmu=null,cmuLoading=null;
const VOWEL=/^(AA|AE|AH|AO|AW|AY|EH|ER|EY|IH|IY|OW|OY|UH|UW)[012]?$/;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const db=x=>x>0?20*Math.log10(x):-100;
const fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
const cleanWord=w=>String(w||'').toLowerCase().replace(/[^a-z']/g,'').replace(/^'+|'+$/g,'');

async function loadPriors(){
  if(priors)return priors;
  try{const r=await fetch(PRIORS_URL,{cache:'no-store'});if(r.ok)priors=await r.json();}catch(e){}
  priors=priors||{target_sections:{short:6,medium:7,long:9},minimum_section_seconds:8,boundary_weights:{rms_delta:.32,spectral_flux:.33,centroid_delta:.22,zcr_delta:.13},templates:{short:['Intro','Verse 1','Hook','Verse 2','Final Hook','Outro'],medium:['Intro','Verse 1','Hook','Verse 2','Bridge / Break','Final Hook','Outro'],long:['Intro','Verse 1','Pre-Hook','Hook','Instrumental / Break','Verse 2','Pre-Hook','Final Hook','Outro']}};
  return priors;
}

async function loadCmu(statusEl){
  if(cmu)return cmu;
  if(cmuLoading)return cmuLoading;
  cmuLoading=(async()=>{
    if(statusEl)statusEl.textContent='Loading free phonetic rhyme + syllable intelligence…';
    try{
      const r=await fetch(CMU_URL,{cache:'force-cache'});if(!r.ok)throw new Error('CMUdict download failed');
      const text=await r.text(),map=new Map();
      for(const line of text.split(/\r?\n/)){
        if(!line||line.startsWith(';;;'))continue;
        const m=line.match(/^([^\s]+)\s+(.+)$/);if(!m)continue;
        const word=m[1].toLowerCase().replace(/\(\d+\)$/,'');
        if(!map.has(word))map.set(word,m[2].trim().split(/\s+/));
      }
      cmu=map;return map;
    }catch(e){cmu=new Map();return cmu;}
  })();
  return cmuLoading;
}

function fallbackSyllables(word){
  word=cleanWord(word);if(!word)return 0;if(word.length<=3)return 1;
  word=word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');
  const m=word.match(/[aeiouy]{1,2}/g);return Math.max(1,m?m.length:1);
}
function phones(word){return cmu?.get(cleanWord(word))||null;}
function wordSyllables(word){const p=phones(word);return p?p.filter(x=>/\d$/.test(x)).length:fallbackSyllables(word);}
function phraseSyllables(text){return String(text||'').split(/\s+/).reduce((n,w)=>n+wordSyllables(w),0);}
function rhymeTail(word){
  const p=phones(word);if(!p||!p.length)return null;
  let idx=-1;for(let i=p.length-1;i>=0;i--){if(VOWEL.test(p[i])&&/[12]$/.test(p[i])){idx=i;break}}
  if(idx<0)for(let i=p.length-1;i>=0;i--){if(VOWEL.test(p[i])){idx=i;break}}
  return idx>=0?p.slice(idx).map(x=>x.replace(/\d/g,'')):null;
}
function lastWord(s){const a=String(s||'').match(/[A-Za-z']+/g);return a?.length?a[a.length-1]:'';}
function rhymeScore(a,b){
  a=lastWord(a);b=lastWord(b);if(!a||!b||cleanWord(a)===cleanWord(b))return 0;
  const A=rhymeTail(a),B=rhymeTail(b);
  if(A&&B){
    if(A.join(' ')===B.join(' '))return 1;
    const va=A[0],vb=B[0],v=va===vb?.72:0;
    let suffix=0,i=1;while(i<=Math.min(A.length,B.length)&&A[A.length-i]===B[B.length-i]){suffix++;i++}
    return clamp(v+suffix*.1,0,1);
  }
  const x=cleanWord(a),y=cleanWord(b);let n=0;for(let i=1;i<=Math.min(4,x.length,y.length);i++){if(x.slice(-i)===y.slice(-i))n=i;else break}return n>=3?.55:n===2?.35:0;
}
function trimToSyllables(line,target){
  const marks=(line.match(/[\/~]+\s*$/)||[''])[0],raw=line.replace(/[\/~]+\s*$/,'').trim();
  let a=raw.split(/\s+/);while(a.length>2&&phraseSyllables(a.join(' '))>target)a.pop();
  return a.join(' ')+(marks?' '+marks.trim():'');
}

function findFrames(){
  try{
    const native=document.getElementById('beatFrame')?.contentWindow;
    const dna=native?.document.getElementById('dna')?.contentWindow;
    const builder=dna?.document.getElementById('b')?.contentWindow;
    return{native,dna,builder};
  }catch(e){return{};}
}

function patchGenerator(native){
  if(!native||native.__mcPhoneticPatched)return;
  const d=native.document,gen=d.getElementById('gen'),again=d.getElementById('again'),st=d.getElementById('st');
  if(!gen||typeof native.generate!=='function'||typeof native.scoreHook!=='function')return;
  native.__mcPhoneticPatched=true;
  const oldScore=native.scoreHook.bind(native),oldLine=native.lineShape?.bind(native),oldHook=native.hookLines?.bind(native);
  native.scoreHook=function(h,b,pf,profile){
    let s=oldScore(h,b,pf,profile),sy=phraseSyllables(h?.phrase||'');
    if(sy>=3&&sy<=8)s+=8;else if(sy>11)s-=8;
    const cov=String(h?.phrase||'').split(/\s+/).filter(w=>phones(w)).length/Math.max(1,String(h?.phrase||'').split(/\s+/).length);
    s+=cov*4;return s;
  };
  if(oldLine)native.lineShape=function(text,pf,r,role='verse'){
    const line=oldLine(text,pf,r,role),target=role==='hook'?9:role==='pre'?11:role==='bridge'?12:14;
    return cmu?trimToSyllables(line,target):line;
  };
  if(oldHook)native.hookLines=function(win,B,pf,r){
    if(!cmu)return oldHook(win,B,pf,r);
    const rank=a=>[...(a||[])].sort((x,y)=>rhymeScore(y,win?.phrase)-rhymeScore(x,win?.phrase));
    const B2={...B,payoffs:rank(B?.payoffs).slice(0,3),core:rank(B?.core).slice(0,3)};
    return oldHook(win,B2,pf,r);
  };
  const intercept=async ev=>{
    if(cmu)return;
    ev.preventDefault();ev.stopImmediatePropagation();
    await loadCmu(st);patchGenerator(native);
    if(st)st.textContent=cmu?.size?`Phonetic intelligence ready • ${cmu.size.toLocaleString()} pronunciations • generating…`:'Phonetic fallback ready • generating…';
    native.generate();
  };
  gen.addEventListener('click',intercept,true);again?.addEventListener('click',intercept,true);
  const badge=d.getElementById('meta');if(badge&&!d.getElementById('mcPhoneticBadge')){const s=d.createElement('span');s.id='mcPhoneticBadge';s.textContent='phonetic rhyme + syllables';badge.appendChild(s)}
}

function sampleSegment(data,start,end,N=96){
  const out=new Float32Array(N),len=Math.max(1,end-start);for(let i=0;i<N;i++){const idx=Math.min(data.length-1,start+Math.floor((i+.5)/N*len));out[i]=data[idx]||0}return out;
}
function featuresForSegment(x){
  let sq=0,z=0;for(let i=0;i<x.length;i++){sq+=x[i]*x[i];if(i&&((x[i]>=0)!=(x[i-1]>=0)))z++}
  const rms=db(Math.sqrt(sq/x.length)),zcr=z/Math.max(1,x.length-1),N=x.length,bins=Math.floor(N/2),mag=new Float32Array(bins);let sum=0,weighted=0;
  for(let k=0;k<bins;k++){let re=0,im=0;for(let n=0;n<N;n++){const w=.5-.5*Math.cos(2*Math.PI*n/(N-1)),ang=2*Math.PI*k*n/N,v=x[n]*w;re+=v*Math.cos(ang);im-=v*Math.sin(ang)}const m=Math.sqrt(re*re+im*im);mag[k]=m;sum+=m;weighted+=k*m}
  const centroid=sum?weighted/(sum*(bins-1)):0;return{rms,zcr,centroid,mag};
}
function normalizeMag(m){let s=0;for(const v of m)s+=v;const o=new Float32Array(m.length);if(!s)return o;for(let i=0;i<m.length;i++)o[i]=m[i]/s;return o;}
function enhancedAnalyze(buffer){
  const segN=96,data=buffer.getChannelData(0),F=[];for(let i=0;i<segN;i++){const a=Math.floor(i*data.length/segN),b=Math.floor((i+1)*data.length/segN);F.push(featuresForSegment(sampleSegment(data,a,b)))}
  for(let i=0;i<F.length;i++){const p=i?normalizeMag(F[i-1].mag):new Float32Array(F[i].mag.length),c=normalizeMag(F[i].mag);let flux=0;for(let k=0;k<c.length;k++)flux+=Math.max(0,c[k]-p[k]);F[i].flux=flux}
  const vals=k=>F.map(x=>x[k]),zscore=a=>{const m=a.reduce((s,x)=>s+x,0)/a.length,sd=Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/a.length)||1;return a.map(x=>(x-m)/sd)},w=priors?.boundary_weights||{rms_delta:.32,spectral_flux:.33,centroid_delta:.22,zcr_delta:.13};
  const dr=zscore(F.map((x,i)=>i?Math.abs(x.rms-F[i-1].rms):0)),fl=zscore(vals('flux')),dc=zscore(F.map((x,i)=>i?Math.abs(x.centroid-F[i-1].centroid):0)),dz=zscore(F.map((x,i)=>i?Math.abs(x.zcr-F[i-1].zcr):0));
  const novelty=F.map((x,i)=>w.rms_delta*dr[i]+w.spectral_flux*fl[i]+w.centroid_delta*dc[i]+w.zcr_delta*dz[i]);
  const energy=[];for(let k=0;k<12;k++){const a=Math.floor(k*segN/12),b=Math.floor((k+1)*segN/12),sl=F.slice(a,b).map(x=>x.rms);energy.push(sl.reduce((s,x)=>s+x,0)/sl.length)}
  const max=Math.max(...energy),min=Math.min(...energy),peak=energy.indexOf(max);return{duration:buffer.duration,F,novelty,energy,min,max,spread:max-min,peak};
}
function chooseTemplate(d){const key=d<130?'short':d<190?'medium':'long';return{key,roles:priors?.templates?.[key]||['Intro','Verse 1','Hook','Verse 2','Final Hook','Outro'],target:priors?.target_sections?.[key]||7};}
function structureFromNovelty(r){
  const t=chooseTemplate(r.duration),count=t.roles.length,minGap=Math.max(priors?.minimum_section_seconds||8,r.duration/(count*2.2)),cand=[];
  for(let i=3;i<r.novelty.length-3;i++){const sec=i/r.novelty.length*r.duration;if(sec<5||sec>r.duration-5)continue;cand.push({i,sec,score:r.novelty[i]})}
  cand.sort((a,b)=>b.score-a.score);const chosen=[];for(const c of cand){if(chosen.every(x=>Math.abs(x.sec-c.sec)>=minGap)){chosen.push(c);if(chosen.length>=count-1)break}}
  chosen.sort((a,b)=>a.sec-b.sec);let bounds=[0,...chosen.map(x=>x.sec),r.duration];
  while(bounds.length<count+1){let best=0,bi=0;for(let i=0;i<bounds.length-1;i++){const gap=bounds[i+1]-bounds[i];if(gap>best){best=gap;bi=i}}bounds.splice(bi+1,0,(bounds[bi]+bounds[bi+1])/2)}
  if(bounds.length>count+1)bounds=bounds.slice(0,count).concat(r.duration);
  return t.roles.map((role,i)=>({start:bounds[i],end:bounds[i+1],role,boundaryScore:i?chosen.find(x=>Math.abs(x.sec-bounds[i])<1)?.score||0:0}));
}
function flowText(role){if(/Verse/.test(role))return'Tighter conversational pocket; use phonetic syllable balance and one purposeful cadence change.';if(/Pre/.test(role))return'Fewer words and longer vowels; simplify before the hook.';if(/Hook/.test(role))return'Short repeatable phrase; prioritize sound-based rhyme and easy syllable count over perfect spelling rhyme.';if(/Break|Instrumental/.test(role))return'Leave room here. Let the musical change carry the section before vocals return.';if(/Intro/.test(role))return'Keep it sparse; tease the core phrase without spending the full hook.';return'Reduce words and end on one memorable phrase or ad-lib.';}
function buildEnhancedPrompt(d,r,structure){
  const v=id=>d.getElementById(id)?.value?.trim?.()||'',energy=r.energy.map((x,i)=>`Section ${i+1}: ${x.toFixed(1)} dB`).join('\n'),st=structure.map(s=>`${fmt(s.start)}–${fmt(s.end)} ${s.role}`).join('\n');
  return `Use this locally measured beat analysis as a starting point. The browser used RMS energy plus spectral flux, spectral-centroid change, and zero-crossing change to find likely musical boundaries, then applied open structural priors.\n\nGenre/style: ${v('beatGenre')||'not specified'}\nMood: ${v('beatMood')}\nTheme: ${v('beatTheme')||'choose a strong original concept'}\nBPM entered: ${v('beatBpm')||'unknown'}\nGoal: ${v('beatGoal')}\nDuration: ${fmt(r.duration)}\n\nLIKELY STRUCTURE\n${st}\n\n12-PART ENERGY\n${energy}\n\nWriting guidance: use sound-based/slant rhyme where natural, balance syllables for singability, leave real negative space, and treat these browser boundaries as suggestions rather than ground truth.`;
}
function patchBuilder(builder){
  if(!builder||builder.__mcAudioPatched)return;const d=builder.document,btn=d.getElementById('analyzeBeat');if(!btn)return;builder.__mcAudioPatched=true;
  const handler=async ev=>{
    ev.preventDefault();ev.stopImmediatePropagation();const file=d.getElementById('beatFile')?.files?.[0];if(!file)return;
    btn.disabled=true;btn.textContent='Smart scanning beat on this device…';
    try{await loadPriors();const arr=await file.arrayBuffer(),Ctx=builder.AudioContext||builder.webkitAudioContext,ctx=new Ctx(),buffer=await ctx.decodeAudioData(arr.slice(0)),r=enhancedAnalyze(buffer);await ctx.close();const structure=structureFromNovelty(r);r.structure=structure;builder.__mcAudioReport=r;
      d.getElementById('beatDuration').textContent=fmt(r.duration);d.getElementById('beatRange').textContent=r.spread.toFixed(1)+' dB';d.getElementById('beatPeakArea').textContent=`${fmt(r.peak*r.duration/12)}–${fmt((r.peak+1)*r.duration/12)}`;
      d.getElementById('beatEnergyEmpty')?.classList.add('hidden');const en=d.getElementById('beatEnergy');en?.classList.remove('hidden');if(en)en.innerHTML=r.energy.map((v,i)=>`<div class="ec"><div class="eb" title="${v.toFixed(1)} dB" style="height:${20+80*(v-r.min)/Math.max(.1,r.max-r.min)}%"></div><div class="el">${i+1}</div></div>`).join('');
      const box=d.getElementById('beatStructure');box.className='timeline';box.innerHTML=structure.map(s=>`<div class="row"><div class="time">${fmt(s.start)}–${fmt(s.end)}</div><div class="role">${s.role}</div><p>${s.start?`Boundary confidence ${clamp(50+s.boundaryScore*12,40,98).toFixed(0)}%. `:''}Detected from combined energy/timbre/percussion change.</p></div>`).join('');
      const flow=d.getElementById('beatFlow');flow.className='cards';flow.innerHTML=structure.map(s=>`<div class="coach"><strong>${s.role} • ${fmt(s.start)}–${fmt(s.end)}</strong><p>${flowText(s.role)}</p></div>`).join('');
      const prompt=buildEnhancedPrompt(d,r,structure),pb=d.getElementById('beatPrompt');pb.textContent=prompt;d.getElementById('copyBeatPrompt').disabled=false;d.getElementById('downloadBeatPlan').disabled=false;
    }catch(e){console.error(e);d.getElementById('beatPrompt').textContent='Smart scan could not decode this file. Try MP3 or WAV.'}finally{btn.disabled=false;btn.textContent='Analyze beat locally'}};
  btn.addEventListener('click',handler,true);
  const copy=d.getElementById('copyBeatPrompt'),down=d.getElementById('downloadBeatPlan');
  copy?.addEventListener('click',ev=>{if(!builder.__mcAudioReport)return;ev.preventDefault();ev.stopImmediatePropagation();const p=d.getElementById('beatPrompt').textContent;navigator.clipboard?.writeText(p).catch(()=>{});},true);
  down?.addEventListener('click',ev=>{if(!builder.__mcAudioReport)return;ev.preventDefault();ev.stopImmediatePropagation();const p=d.getElementById('beatPrompt').textContent,blob=new Blob([p],{type:'text/plain'}),u=URL.createObjectURL(blob),a=d.createElement('a');a.href=u;a.download='smart-beat-plan.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);},true);
  const hero=d.querySelector('.badges');if(hero&&!d.getElementById('mcSmartAudioBadge')){const s=d.createElement('span');s.id='mcSmartAudioBadge';s.textContent='Smart audio boundaries';hero.appendChild(s)}
}

async function boot(){await loadPriors();for(;;){const {native,builder}=findFrames();patchGenerator(native);patchBuilder(builder);await sleep(900)}}
boot();
})();
