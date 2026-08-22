(()=>{
'use strict';
const VERSION='20260821-1';
const LEX_URL='data/songwriting-context-lexicon-v1.json?v='+VERSION;
const RHYME_URL='data/songwriting-rhyme-families-v1.json?v='+VERSION;
const FALLBACK_LEX={
  version:'starter',
  concepts:[
    {id:'absence',aliases:['missing','miss','gone','left','alone'],nouns:['silence','empty room','old route'],verbs:['reach','turn','check'],details:['the room gets quiet','a familiar sound comes on'],angles:['the habit stayed after the person left'],hook_words:['gone','still','again'],metaphors:['echo']},
    {id:'memory',aliases:['memory','remember','past','replay'],nouns:['old message','photo','song'],verbs:['replay','remember','compare'],details:['one small detail brings everything back'],angles:['memory arrives before logic'],hook_words:['again','back','same'],metaphors:['echo']}
  ],
  metaphor_domains:[{id:'echo',fits:['absence','memory'],templates:['{detail}, and the feeling hangs around like an echo']}],
  topic_templates:{Heartbroken:['{detail}; the reminder hits before I can stop it.'],Vulnerable:['I keep trying to say something honest about {focus}.'],Confident:['I am done explaining {focus}; I want the result to make the point.']}
};
const FALLBACK_RHYME={families:[
  {id:'AYT',perfect:['night','light','right'],slant:['life','time','mine'],holdable:['night','light','right']},
  {id:'OWN',perfect:['alone','phone','known'],slant:['home','gone','on'],holdable:['alone','phone','home']},
  {id:'OO',perfect:['you','blue','through','true'],slant:['move','room','lose'],holdable:['you','true']}
]};
let dataPromise=null;

async function loadData(){
  if(dataPromise)return dataPromise;
  dataPromise=(async()=>{
    const [a,b]=await Promise.allSettled([
      fetch(LEX_URL,{cache:'default'}).then(r=>r.ok?r.json():Promise.reject(new Error('context '+r.status))),
      fetch(RHYME_URL,{cache:'default'}).then(r=>r.ok?r.json():Promise.reject(new Error('rhyme '+r.status)))
    ]);
    return {
      lex:a.status==='fulfilled'?a.value:FALLBACK_LEX,
      rhyme:b.status==='fulfilled'?b.value:FALLBACK_RHYME
    };
  })();
  return dataPromise;
}

function installInFrame(LEX,RHYME){
  'use strict';
  if(window.__mcContextV45)return;
  window.__mcContextV45=true;
  const NEG=new Set(['too_wordy','weird_lyrics','bad_placement','too_generic']);
  const MOOD_DEFAULT={
    Confident:['trust','music'],Heartbroken:['absence','memory','breakup'],
    Vulnerable:['trust','memory'],Dark:['trust','loneliness'],Dreamy:['memory','music'],
    Hopeful:['moving-on','time'],Playful:['trust','voice'],Energetic:['music','voice']
  };
  const STOP=new Set('the a an and or but if then than to of in on at for from with without into over under i me my mine you your yours we our ours they their it its this that these those is are was were be been being do does did have has had can could would should will just really very still now then so cause cuz yeah no not'.split(' '));
  const nrm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
  const toks=s=>nrm(s).split(' ').filter(w=>w.length>2&&!STOP.has(w));
  const cap=s=>s?String(s).charAt(0).toUpperCase()+String(s).slice(1):'';
  const uniq=a=>[...new Set((a||[]).filter(Boolean).map(x=>String(x).replace(/\s+/g,' ').trim()).filter(Boolean))];
  const lastWord=s=>{const a=toks(s);return a[a.length-1]||''};
  const mode=()=>window.__mcFeedbackMode||null;
  const feedback=()=>{try{return JSON.parse(localStorage.mcSongFeedback||'{}')}catch(e){return{}}};
  const conceptById=new Map((LEX.concepts||[]).map(c=>[c.id,c]));

  function topicContext(){
    const raw=$('theme')?.value||'', low=nrm(raw), tt=new Set(toks(raw)), scored=[];
    for(const c of LEX.concepts||[]){
      let s=0;
      for(const a of [c.id,...(c.aliases||[])]){
        const q=nrm(a); if(!q)continue;
        if(low.includes(q))s+=q.includes(' ')?6:4;
        for(const w of toks(q))if(tt.has(w))s+=1.5;
      }
      for(const w of [...(c.nouns||[]),...(c.verbs||[]),...(c.hook_words||[])])if(toks(w).some(x=>tt.has(x)))s+=1;
      if(s>0)scored.push({c,s});
    }
    scored.sort((a,b)=>b.s-a.s);
    let concepts=scored.slice(0,3).map(x=>x.c);
    if(!concepts.length){
      const ids=MOOD_DEFAULT[$('mood')?.value]||['memory'];
      concepts=ids.map(id=>conceptById.get(id)).filter(Boolean);
    }
    const focus=toks(raw)[0]||concepts[0]?.id||'this';
    return {raw,focus,concepts};
  }

  function metaphorFor(ctx,naturalOnly){
    if(naturalOnly)return[];
    const ids=new Set(ctx.concepts.flatMap(c=>c.metaphors||[]));
    return (LEX.metaphor_domains||[]).filter(m=>ids.has(m.id)||m.fits?.some(id=>ctx.concepts.some(c=>c.id===id))).slice(0,3);
  }

  function fillTemplate(t,ctx,detail){
    return String(t||'')
      .replaceAll('{focus}',ctx.focus)
      .replaceAll('{detail}',detail||ctx.concepts[0]?.details?.[0]||'something small brings it back')
      .replace(/\s+/g,' ').trim();
  }

  function generatedLanguage(){
    const ctx=topicContext(), m=mode(), f=feedback();
    const naturalOnly=m==='weird_lyrics'||(f.weird_lyrics||0)>(f.good_lyrics||0)+1;
    const details=uniq(ctx.concepts.flatMap(c=>c.details||[]));
    const nouns=uniq(ctx.concepts.flatMap(c=>c.nouns||[]));
    const verbs=uniq(ctx.concepts.flatMap(c=>c.verbs||[]));
    const titles=[], core=[], verse=[], payoffs=[];
    const rawWords=toks(ctx.raw);
    if(rawWords[0])titles.push(cap(rawWords.slice(0,2).join(' ')),`After ${cap(rawWords[0])}`,`Past ${cap(rawWords[0])}`);
    for(const c of ctx.concepts){
      for(const h of c.hook_words||[])titles.push(cap(h));
      for(const d of (c.details||[]).slice(0,6)){verse.push(d);core.push(d)}
      for(const a of (c.angles||[]).slice(0,5)){payoffs.push(a);core.push(a)}
    }
    const d0=details[0]||'something small changes the mood';
    if(ctx.raw.trim()){
      verse.unshift(`I keep coming back to ${rawWords.slice(0,5).join(' ')}`);
      core.unshift(`I know what ${ctx.focus} changes`);
      payoffs.unshift(`I do not need to ignore ${ctx.focus} to move forward`);
    }
    for(const v of verbs.slice(0,5)){
      const n=nouns[Math.floor(Math.random()*Math.max(1,nouns.length))]||ctx.focus;
      verse.push(`I ${v} when ${d0}`);
      verse.push(`I ${v} around the ${n} before I even think`);
    }
    const moodTemplates=LEX.topic_templates?.[$('mood')?.value]||[];
    for(const t of moodTemplates)core.push(fillTemplate(t,ctx,d0));
    for(const meta of metaphorFor(ctx,naturalOnly))for(const t of (meta.templates||[]).slice(0,2))verse.push(fillTemplate(t,ctx,d0));
    return {ctx,titles:uniq(titles),core:uniq(core),verse:uniq(verse),payoffs:uniq(payoffs)};
  }

  function topicRelevance(line){
    const g=generatedLanguage(), lineT=new Set(toks(line)), rawT=new Set(toks(g.ctx.raw));
    let s=0;
    for(const w of rawT)if(lineT.has(w))s+=2;
    for(const c of g.ctx.concepts){
      const rel=toks([...(c.nouns||[]),...(c.verbs||[]),...(c.hook_words||[])].join(' '));
      for(const w of rel)if(lineT.has(w))s+=.25;
    }
    return Math.min(8,s);
  }

  const rhymeIndex=new Map();
  for(const fam of RHYME.families||[]){
    for(const w of fam.perfect||[])rhymeIndex.set(nrm(w),{fam,type:'perfect'});
    for(const w of fam.slant||[])if(!rhymeIndex.has(nrm(w)))rhymeIndex.set(nrm(w),{fam,type:'slant'});
  }
  function rhymeScore(a,b){
    a=nrm(a);b=nrm(b);if(!a||!b||a===b)return 0;
    const A=rhymeIndex.get(a),B=rhymeIndex.get(b);
    if(A&&B&&A.fam.id===B.fam.id)return A.type==='perfect'&&B.type==='perfect'?1:.68;
    const ae=a.slice(-2),be=b.slice(-2);return ae&&ae===be?.55:0;
  }
  function holdable(word){const x=rhymeIndex.get(nrm(word));return !!x?.fam?.holdable?.some(w=>nrm(w)===nrm(word))}

  const oldBank=bank;
  bank=function(){
    const B=oldBank(), G=generatedLanguage(), m=mode(), f=feedback();
    const topicHeavy=m==='too_generic'||(f.too_generic||0)>(f.good_lyrics||0)+1;
    const natural=m==='weird_lyrics';
    return {
      ...B,
      titles:uniq([...(G.titles||[]),...(B.titles||[])]),
      core:uniq([...(G.core||[]),...(topicHeavy?G.verse:[]),...(B.core||[])]),
      details:uniq([...(G.verse||[]),...(B.details||[])]),
      payoffs:uniq([...(G.payoffs||[]),...(natural?G.core:[]),...(B.payoffs||[])])
    };
  };

  if(typeof hookCandidates==='function'){
    const oldHookCandidates=hookCandidates;
    hookCandidates=function(B,pf,profile,r){
      let out=oldHookCandidates(B,pf,profile,r)||[];
      for(const x of out){
        x.score=(x.score||0)+topicRelevance(x.phrase)*3+(holdable(lastWord(x.phrase))?2:0);
        if(mode()==='too_generic')x.score+=topicRelevance(x.phrase)*4;
      }
      return out.sort((a,b)=>(b.score||0)-(a.score||0));
    };
  }

  if(typeof shapeLine==='function'){
    const oldShape=shapeLine;
    shapeLine=function(s,pf,r,role='verse'){
      let out=oldShape(s,pf,r,role), a=words(out);
      if(mode()==='too_wordy')a=a.slice(0,role==='hook'?5:8);
      if(mode()==='weird_lyrics'){
        a=a.slice(0,role==='hook'?6:10);
        out=a.join(' ').replace(/[~/]+$/g,'').replace(/\s+\/$/,'');
        return out;
      }
      return a.join(' ');
    };
  }

  if(typeof verseLines==='function'){
    const oldVerseLines=verseLines;
    verseLines=function(B,pf,r,bp,second,used){
      let out=oldVerseLines(B,pf,r,bp,second,used)||[];
      if(mode()==='too_wordy'||mode()==='bad_placement')out=out.slice(0,Math.min(4,out.length));
      return out;
    };
  }

  if(typeof hookLines==='function'){
    const oldHookLines=hookLines;
    hookLines=function(win,B,pf,r){
      let lines=oldHookLines(win,B,pf,r)||[];
      if(mode()==='bad_placement'&&lines.length>=3){
        lines=[lines[0],'[NO VOCAL]',lines[1],lines[lines.length-1]];
      }else if(lines.length>=3){
        const anchor=lastWord(win?.phrase||lines[0]);
        const cand=uniq([...(B.payoffs||[]),...(B.core||[]),...(B.details||[])])
          .map(x=>({x,score:rhymeScore(anchor,lastWord(x))*5+topicRelevance(x)}))
          .sort((a,b)=>b.score-a.score)[0];
        if(cand?.score>=3.2)lines[1]=shapeLine(cand.x,pf,r,'hook');
      }
      return lines;
    };
  }

  function randomTopic(){
    const mood=$('mood')?.value||'Heartbroken';
    const ids=MOOD_DEFAULT[mood]||['memory'];
    const options=ids.map(id=>conceptById.get(id)).filter(Boolean);
    const c=options[Math.floor(Math.random()*Math.max(1,options.length))]||LEX.concepts?.[0];
    const d=c?.details?.[Math.floor(Math.random()*Math.max(1,c.details?.length||1))]||'one small detail changes the mood';
    const t=(LEX.topic_templates?.[mood]||[])[Math.floor(Math.random()*Math.max(1,LEX.topic_templates?.[mood]?.length||1))];
    if(t)return fillTemplate(t,{focus:c?.id||'this',concepts:[c].filter(Boolean)},d);
    return `${d}; I want the song to stay focused on ${c?.id||'that feeling'}.`;
  }

  const theme=$('theme');
  if(theme&&!document.getElementById('mcRandomTopicV45')){
    const wrap=document.createElement('div');
    wrap.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:7px';
    const btn=document.createElement('button');
    btn.id='mcRandomTopicV45';btn.type='button';btn.className='btn';btn.textContent='🎲 Random Topic';
    const status=document.createElement('div');
    status.id='mcTopicBrainStatus';status.className='status';status.style.marginTop='0';
    const update=()=>{
      const ctx=topicContext();
      status.textContent='Topic Brain: '+ctx.concepts.map(c=>c.id).join(' • ')+' • '+(RHYME.families?.length||0)+' rhyme families';
    };
    btn.onclick=()=>{theme.value=randomTopic();theme.focus();try{theme.setSelectionRange(theme.value.length,theme.value.length)}catch(e){}update()};
    theme.addEventListener('input',update);
    wrap.append(btn,status);
    theme.insertAdjacentElement('afterend',wrap);
    update();
  }

  for(const b of document.querySelectorAll('[data-f]')){
    const k=b.dataset.f;
    if(!NEG.has(k)||b.dataset.mcRewriteBound)continue;
    b.dataset.mcRewriteBound='1';
    b.addEventListener('click',()=>{
      window.__mcFeedbackMode=k;
      const st=$('genStatus');
      if(st)st.textContent='Feedback saved • rewriting for '+k.replaceAll('_',' ')+'…';
      setTimeout(()=>{
        try{
          if(typeof generateSong==='function')generateSong();
          else if(st)st.textContent='Feedback saved. Generate Again to apply it.';
        }catch(e){
          console.error('feedback rewrite',e);
          if(st)st.textContent='Feedback saved, but rewrite hit an error. Tap Generate Again.';
        }finally{
          setTimeout(()=>{window.__mcFeedbackMode=null},80);
        }
      },120);
    });
  }

  const meta=$('packMeta');
  if(meta&&!document.getElementById('mcContextBadge')){
    const b=document.createElement('span');b.id='mcContextBadge';
    b.textContent='Topic Brain + local rhyme/context';
    meta.appendChild(b);
  }
}

async function tryPatch(){
  try{
    const frame=document.getElementById('beatFrame'), w=frame?.contentWindow, d=w?.document;
    if(!w||!d?.getElementById('generate')||w.__mcContextV45)return;
    if(!w.__mcLanguageV42)return;
    const {lex,rhyme}=await loadData();
    if(w.__mcContextV45)return;
    const s=d.createElement('script');
    s.textContent='('+installInFrame.toString()+')('+JSON.stringify(lex)+','+JSON.stringify(rhyme)+');';
    d.body.appendChild(s);s.remove();
  }catch(e){console.error('Music Coach Topic Brain',e)}
}
const f=document.getElementById('beatFrame');
f?.addEventListener('load',()=>{setTimeout(tryPatch,300);setTimeout(tryPatch,900);setTimeout(tryPatch,1800)});
setInterval(tryPatch,1000);
setTimeout(tryPatch,500);
})();