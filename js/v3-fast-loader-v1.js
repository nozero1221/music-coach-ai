(()=>{
'use strict';
const ALL_MOODS=['Confident','Heartbroken','Vulnerable','Dark','Dreamy','Hopeful','Playful','Energetic'];
const STARTER_CORE={version:'3.0-starter',hook_blueprints:[
{id:'title-anchor',ideal_words:4,space:.45},{id:'mantra',ideal_words:3,space:.55},{id:'question-answer',ideal_words:5,space:.35},{id:'micro-variation',ideal_words:4,space:.42},{id:'dropout-return',ideal_words:4,space:.65},{id:'payoff-line',ideal_words:5,space:.35}
],verse_blueprints:[
{id:'claim-proof',density:'medium'},{id:'scene-reaction-meaning',density:'medium'},{id:'sparse-confession',density:'sparse'},{id:'detail-escalation',density:'dense'}
],cadence_blueprints:[
{id:'pocket-lock',rule:'keep one clear pocket before changing it'},{id:'boundary-switch',rule:'change cadence near a section or phrase boundary'},{id:'dropout-return',rule:'leave a short gap before re-entering'},{id:'back-half-rush',rule:'put the quicker words in the back half, then relax'}
],rhyme_modes:[{id:'conversational-slant'},{id:'vowel-family'},{id:'end-rhyme-sparse'},{id:'internal-cluster'}],candidate_tournament:{hook_count:9},score_weights:{natural_phrasing:.16},genre_profiles:[
{id:'hip-hop',preferred_hooks:['title-anchor','payoff-line','mantra'],preferred_verses:['claim-proof','detail-escalation'],weights:{natural:.9,space:.55,rhyme:.7,cadence:.8,melody:.45}},
{id:'melodic-rap',preferred_hooks:['title-anchor','mantra','micro-variation'],preferred_verses:['scene-reaction-meaning','sparse-confession'],weights:{natural:.9,space:.7,rhyme:.55,cadence:.7,melody:.85}},
{id:'mainstream-pop',preferred_hooks:['title-anchor','mantra','question-answer'],preferred_verses:['scene-reaction-meaning','claim-proof'],weights:{natural:.9,space:.7,rhyme:.45,cadence:.55,melody:.9}}
]};
const STARTER_CRAFT={version:'3.0-starter',profiles:[]};
const STARTER_LANG={version:'3.0-starter',concept_engines:[
{id:'direct-thesis',seed:'One clear idea develops across sections',best_moods:ALL_MOODS},{id:'scene-to-meaning',seed:'A small concrete moment grows into the main emotional point',best_moods:['Heartbroken','Vulnerable','Dreamy']},{id:'proof-not-claim',seed:'Show the idea through behavior and consequences instead of explaining it',best_moods:['Confident','Hopeful','Dark']}
],moods:{
Confident:{titles:['No Explanation','Let It Show','My Own Pace','Already Moving'],core:['I stopped explaining','I know what I built','I move before they notice','I do not need the room to agree'],details:['I answer less and finish more','they hear about it after it works','same name, different standards','I keep the plan off the table'],payoffs:['let the work say enough','you can see it when it lands','I am good with what I know','I do not need to sell the truth']},
Heartbroken:{titles:['Almost Familiar','Not Ours Now','Kept the Habit','Used To Be Easy'],core:['I still reach for what is not there','the habit stayed after you left','I know the ending and still replay it','I miss the version of us that felt easy'],details:['I catch myself saving things to tell you','I changed the route but not the reflex','I deleted the plans, not the memory','I stopped checking, then checked again'],payoffs:['I know it is over, my habits do not','I can leave and still miss it','I am learning how to not go back','it hurts less when I say it plain']},
Vulnerable:{titles:['Say It Plain','No Armor','What I Mean','Still Learning'],core:['I act fine before I feel fine','I do not always know how to say it','I keep the hard part behind a joke','I am learning to say what I mean'],details:['I type it out and erase the whole thing','I make it sound smaller than it is','I go quiet when I need someone most','I know the answer, I just fear the question'],payoffs:['this is me saying it plain','I would rather be honest than impressive','I am tired of hiding the easy truth','I can be strong and still need somebody']},
Dark:{titles:['Keep It Low','No Witness','After Hours','Quiet Damage'],core:['I keep the noise outside','I know which doors stay closed','I do not trust every friendly face','I learned to notice what goes unsaid'],details:['some smiles end when the favor does','I hear the switch before the sentence ends','I leave before the mood turns strange','I know when a promise sounds rented'],payoffs:['I keep it low and keep it moving','silence tells me plenty','I would rather know than pretend','I do not chase what feels wrong']},
Dreamy:{titles:['Half Awake','Soft Focus','Between Seconds','Out of Frame'],core:['I lose track of where the hour went','everything feels softer from here','I am half awake and fully somewhere else','I let the moment stay unfinished'],details:['the ceiling fan keeps perfect time','coffee cools before I take a sip','the light moves across the same old wall','I let the song play after it ends'],payoffs:['leave me here a little longer','I do not need to name this feeling','let the moment stay soft','I am fine between the seconds']},
Hopeful:{titles:['Next Version','Start Small','One Good Day','Keep Going'],core:['I am not there yet, I can see it','small wins finally look like wins','I stopped waiting to feel ready','today does not have to fix everything'],details:['I made the bed and kept the promise','I took one step before making a plan','I left some room for a better answer','I counted progress I used to ignore'],payoffs:['one good day can start a run','I only need the next right move','I can build from something small','I am closer than I was']},
Playful:{titles:['Too Easy','My Bad','Say Less','Good Try'],core:['you make it obvious when you pretend not to care','I saw that look, do not make me explain it','you said you are done and stayed for the chorus','you can act cool, I can wait'],details:['you left me on read then liked the post','you rolled your eyes and moved closer','you said five minutes about an hour ago','you know the joke before I finish it'],payoffs:['good try, I know you better','say less, I already got it','we both know how this ends','you are not as subtle as you think']},
Energetic:{titles:['Right Now','No Warmup','All In Motion','Wide Awake'],core:['I came in ready before the count','I do not need a warmup tonight','the room woke up when the drums did','I came to move, not talk about it'],details:['first step lands and the rest follows','I catch the snare and move with it','everybody turns when the low end hits','I leave the next bar open then jump back in'],payoffs:['right now is enough','let the beat finish the sentence','we are already in it','do not slow it down yet']}
}};
function nativeFrame(){try{return document.getElementById('beatFrame')?.contentWindow||null}catch(e){return null}}
function injectPack(w,core,craft,lang,label){
  try{
    const d=w.document;if(!d?.body)return false;
    const payload=`try{CORE=${JSON.stringify(core)};CRAFT=${JSON.stringify(craft)};LANG=${JSON.stringify(lang)};window.__mcV3FastReady=true;if(typeof meta!=='undefined'&&meta){meta.innerHTML='<span>Knowledge Pack '+(CORE.version||'v3')+'</span><span>'+((CORE.hook_blueprints||[]).length)+' hook blueprints</span><span>'+((CORE.verse_blueprints||[]).length)+' verse blueprints</span><span>'+((CRAFT.profiles||[]).length)+' craft profiles</span><span>instant fallback</span><span>$0 forever</span>'}if(typeof st!=='undefined'&&st){st.textContent=${JSON.stringify(label)};st.className='status good'}if(!window.__mcV3StatusGuard){window.__mcV3StatusGuard=setInterval(()=>{try{if(window.__mcV3FastReady&&typeof st!=='undefined'&&st&&/loading|could not load/i.test(st.textContent)){st.textContent=window.__mcV3FullReady?'Knowledge Pack v3 ready • cached fast load':'Starter v3 ready • full knowledge loading in background';st.className='status good'}}catch(e){}},700)}}catch(e){console.error('v3 fast pack inject',e)}`;
    const s=d.createElement('script');s.textContent=payload;d.body.appendChild(s);s.remove();return true;
  }catch(e){return false}
}
async function fetchJson(url,timeout=4500){
  const ac=new AbortController(),t=setTimeout(()=>ac.abort(),timeout);
  try{const r=await fetch(url,{cache:'default',signal:ac.signal});if(!r.ok)throw new Error(String(r.status));return await r.json()}finally{clearTimeout(t)}
}
async function loadFull(w){
  try{
    const [core,craft,lang]=await Promise.all([
      fetchJson('data/songwriting-dna-v3-core.json?v=3.0.1'),
      fetchJson('data/songwriting-dna-v3-craft-profiles.json?v=3.0.1'),
      fetchJson('data/songwriting-dna-v3-language.json?v=3.0.1')
    ]);
    injectPack(w,core,craft,lang,`Knowledge Pack v3 ready • ${core.hook_blueprints?.length||0} hook blueprints • ${craft.profiles?.length||0} craft profiles`);
    const d=w.document,s=d.createElement('script');s.textContent='window.__mcV3FullReady=true;';d.body.appendChild(s);s.remove();
  }catch(e){
    try{const d=w.document,s=d.createElement('script');s.textContent="if(typeof st!=='undefined'&&st){st.textContent='Starter v3 ready • full pack will retry next refresh';st.className='status good'}";d.body.appendChild(s);s.remove()}catch(_){}
  }
}
function patch(){
  const w=nativeFrame();if(!w||w.__mcV3ParentPatched)return;
  try{if(!w.document?.getElementById('gen'))return}catch(e){return}
  w.__mcV3ParentPatched=true;
  injectPack(w,STARTER_CORE,STARTER_CRAFT,STARTER_LANG,'Starter v3 ready instantly • full knowledge loading in background');
  loadFull(w);
}
const beat=document.getElementById('beatFrame');beat?.addEventListener('load',()=>{setTimeout(patch,80);setTimeout(patch,500)});
setInterval(patch,900);setTimeout(patch,100);
})();