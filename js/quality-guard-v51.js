(()=>{
'use strict';
function install(){
 try{
  const f=document.getElementById('beatFrame'),w=f&&f.contentWindow,d=w&&w.document;
  if(!w||!d||!w.__mcArtistIntelligenceV51||w.__mcQualityGuardV51)return;
  const song=d.getElementById('song');if(!song)return;
  const DAN=new Set(['i','a','an','the','and','but','so','to','of','for','from','when','before','after','because','if','while','like','than','as','with','without','into','over','under']);
  const FILL=new Set(['really','very','actually','basically','literally','just','maybe','somehow']);
  const norm=s=>String(s||'').toLowerCase().replace(/[^a-z']/g,'');
  const meta=x=>/^\s*(SMART COMPOSER|Topic:|Concept lanes:|Genre family:|Quality tournament:|Quality checks:|Rewrite mode:|VOCAL PRODUCTION|RECORDING ORDER|NOTE|→|\[)/i.test(x);
  function target(){try{const o=JSON.parse(w.localStorage.getItem('mcSmartLearnV5')||'{}'),a=(o.goodFlows||[]).slice(-10);if(!a.length)return null;const n=a.reduce((s,x)=>s+(Number(x.avgWords)||0),0)/a.length;return n>=3&&n<=16?n:null}catch(e){return null}}
  function line(x,t){
   let a=String(x||'').trim().split(/\s+/).filter(Boolean);if(a.length<2)return x;
   const ded=[];for(const q of a){if(!ded.length||norm(ded[ded.length-1])!==norm(q))ded.push(q)}a=ded;
   if(t&&a.length>t+4){for(let i=a.length-2;i>0&&a.length>t+2;i--)if(FILL.has(norm(a[i])))a.splice(i,1)}
   while(a.length>3&&DAN.has(norm(a[a.length-1])))a.pop();
   return a.length>=3?a.join(' '):x;
  }
  let lock=false;
  function guard(){
   if(lock)return;const raw=song.textContent||'';if(!raw)return;const t=target(),rows=raw.split('\n');let production=false,changed=false;
   for(let i=0;i<rows.length;i++){
    const r=rows[i];if(/^\s*VOCAL PRODUCTION/i.test(r)||/^\s*NOTE\s*$/i.test(r)){production=true;continue}
    if(production||meta(r)||!r.trim())continue;
    const q=line(r,t);if(q!==r){rows[i]=q;changed=true}
   }
   if(changed){lock=true;song.textContent=rows.join('\n');lock=false}
   let card=d.getElementById('mcArtistFitCard');if(card&&t&&!card.querySelector('.mcFlowMemory')){const n=d.createElement('div');n.className='mcSub mcFlowMemory';n.style.marginTop='7px';n.textContent='Good Flow memory: future lines favor roughly '+Math.round(t)+' words when it can be done without cutting the thought.';card.appendChild(n)}
  }
  new MutationObserver(()=>setTimeout(guard,0)).observe(song,{childList:true,characterData:true,subtree:true});
  setTimeout(guard,50);w.__mcQualityGuardV51=true;
 }catch(e){console.error('Music Coach quality guard',e)}
}
const f=document.getElementById('beatFrame');if(f)f.addEventListener('load',()=>{setTimeout(install,1200);setTimeout(install,2600)});setInterval(install,1600);setTimeout(install,1400);
})();