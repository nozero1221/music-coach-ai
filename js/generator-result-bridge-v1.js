(()=>{
'use strict';
let patched=false,lastSong='';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function frames(){
  try{
    const native=document.getElementById('beatFrame')?.contentWindow;
    const dna=native?.document.getElementById('dna')?.contentWindow;
    const builder=dna?.document.getElementById('b')?.contentWindow;
    return{native,builder};
  }catch(e){return{};}
}
function isSong(text){
  text=String(text||'');
  return text.length>180&&!/^Analyze a beat below/i.test(text)&&(/DNA V3 PLAN|\[Verse|\[Hook|VOCAL PRODUCTION/i.test(text));
}
function copyText(text,status){
  if(!text)return;
  const fallback=()=>{try{const a=document.createElement('textarea');a.value=text;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();status.textContent='Song copied.'}catch(e){status.textContent='Could not copy automatically.'}};
  if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>status.textContent='Song copied.').catch(fallback);else fallback();
}
function patch(){
  const {native,builder}=frames();if(!native||!builder)return;
  const nd=native.document,bd=builder.document;
  const nativeGen=nd.getElementById('gen'),nativeOut=nd.getElementById('out'),nativeStatus=nd.getElementById('st');
  const analyze=bd.getElementById('analyzeBeat'),readyFlag=bd.getElementById('copyBeatPrompt');
  if(!nativeGen||!nativeOut||!nativeStatus||!analyze||!readyFlag)return;
  if(!bd.getElementById('mcGenerateHereSection')){
    const old=readyFlag.closest('.section');
    if(old){
      const h=old.querySelector('h2');if(h)h.textContent='Optional: Copy the detailed beat plan';
      const tag=old.querySelector('.tag');if(tag)tag.textContent='Fallback / extra detail';
    }
    const sec=bd.createElement('section');sec.id='mcGenerateHereSection';sec.className='card section';
    sec.innerHTML=`<div class="head"><h2>2. Generate your full song</h2><span class="tag">Free • right here</span></div>
      <p style="font-size:12px;color:var(--muted);margin:0 0 10px">After the beat scan finishes, tap the button below. Your generated lyrics will appear directly in this section so you do not have to hunt around the page.</p>
      <button class="btn primary" id="mcGenerateHere" disabled>✨ Generate Full Song Now</button>
      <div id="mcGenerateHereStatus" class="empty" style="margin-top:10px">Analyze the beat first.</div>
      <div id="mcGeneratedSong" class="prompt hidden" style="max-height:none;margin-top:10px;white-space:pre-wrap"></div>
      <div id="mcGeneratedActions" class="two hidden" style="margin-top:8px"><button class="btn secondary" id="mcCopyGenerated">Copy Song</button><button class="btn secondary" id="mcAgainGenerated">↻ Generate Again</button></div>`;
    old?.parentNode?.insertBefore(sec,old);
  }
  const btn=bd.getElementById('mcGenerateHere'),status=bd.getElementById('mcGenerateHereStatus'),result=bd.getElementById('mcGeneratedSong'),actions=bd.getElementById('mcGeneratedActions'),copy=bd.getElementById('mcCopyGenerated'),again=bd.getElementById('mcAgainGenerated');
  if(!btn||!status||!result||!actions)return;
  const syncReady=()=>{
    const ready=!readyFlag.disabled;
    btn.disabled=!ready;
    if(!ready&&!isSong(nativeOut.textContent))status.textContent='Analyze the beat first.';
    else if(ready&&!isSong(nativeOut.textContent)&&!/loading|generat|phonetic/i.test(nativeStatus.textContent))status.textContent='Beat analyzed • ready to generate.';
  };
  const showSong=text=>{
    if(!isSong(text))return;
    lastSong=text;result.textContent=text;result.classList.remove('hidden');actions.classList.remove('hidden');
    status.textContent='✅ Full song generated below.';status.style.color='#86efac';
  };
  const waitForResult=async before=>{
    const started=Date.now();
    while(Date.now()-started<60000){
      const s=String(nativeStatus.textContent||'');
      const t=String(nativeOut.textContent||'');
      if(/loading free phonetic/i.test(s))status.textContent='Loading free rhyme + syllable intelligence for this first generation…';
      else if(/phonetic intelligence ready|generating/i.test(s))status.textContent='Writing your song now…';
      else if(/analyze the beat below first/i.test(s)){status.textContent='The generator still needs the beat scan. Tap Analyze beat locally, then try again.';return;}
      else if(/could not|failed|error/i.test(s)){status.textContent=s;status.style.color='#fbbf24';return;}
      if(isSong(t)&&(t!==before||/generated/i.test(s))){showSong(t);setTimeout(()=>result.scrollIntoView({behavior:'smooth',block:'start'}),80);return;}
      await sleep(250);
    }
    status.textContent='Generation did not finish. Tap Generate Again; if it still does this, send me a screenshot of this message.';status.style.color='#fbbf24';
  };
  const run=()=>{
    if(readyFlag.disabled){status.textContent='Analyze the beat first.';return;}
    status.style.color='';status.textContent='Starting the free generator…';
    const before=String(nativeOut.textContent||'');
    try{nativeGen.click();waitForResult(before)}catch(e){status.textContent='The generator hit an error before it could start. Refresh once and retry.';status.style.color='#fbbf24'}
  };
  if(!btn.__mcBound){btn.__mcBound=true;btn.addEventListener('click',run);again?.addEventListener('click',run);copy?.addEventListener('click',()=>copyText(lastSong||result.textContent,status));}
  if(!nd.getElementById('mcGeneratedHeading')){
    const h=nd.createElement('div');h.id='mcGeneratedHeading';h.textContent='⬇️ Generated song appears in the box below';h.style.cssText='font-size:10px;font-weight:800;color:#86efac;margin-top:9px';nativeOut.parentNode.insertBefore(h,nativeOut);
  }
  if(isSong(nativeOut.textContent))showSong(nativeOut.textContent);
  syncReady();
  if(!patched){patched=true;setInterval(()=>{try{syncReady();const t=String(nativeOut.textContent||'');if(isSong(t)&&t!==lastSong)showSong(t)}catch(e){}},700)}
}
const beat=document.getElementById('beatFrame');beat?.addEventListener('load',()=>{setTimeout(patch,200);setTimeout(patch,900)});
setInterval(patch,1000);setTimeout(patch,200);
})();