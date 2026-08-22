(()=>{
'use strict';
const VERSION='20260822-1';
const LEX_URL='data/songwriting-context-lexicon-v1.json?v='+VERSION;
const RHYME_URL='data/songwriting-rhyme-families-v1.json?v='+VERSION;
const FALLBACK_RHYME={families:[
 {id:'OO',perfect:['you','true','blue','through','new'],slant:['move','room','lose','too'],holdable:['you','true','blue','new']},
 {id:'AY',perfect:['day','say','way','stay','away'],slant:['name','late','face'],holdable:['day','say','way','stay']},
 {id:'IGHT',perfect:['night','light','right','fight'],slant:['life','time','mine'],holdable:['night','light','right']},
 {id:'OWN',perfect:['alone','phone','known','stone'],slant:['home','gone','on'],holdable:['alone','phone','home']},
 {id:'AIR',perfect:['there','care','where','air'],slant:['near','here','fear'],holdable:['there','care','where']}
]};
const EXTRA={
 absence:{titles:['Almost There','Turned Too Fast','Missing Part','Not There'],reaction:['I turn around before I can stop myself','I look up too fast and already know why','I keep listening after I know it is not you'],consequence:['The rest of the night feels farther away','I stop looking after I already looked once','I let the reminder pass instead of following it'],turn:['Familiar does not mean I should go back','I can miss it without making it a sign'],hook:['Something sounds like you and I turn too fast','For a second I forget you are not there','I know it is not you before I look']},
 memory:{titles:['For A Second','Old Version','Before I Remember','Same Detail'],reaction:['My mind finishes the comparison before I do','I catch the thought halfway through','I know where the memory is going before it gets there'],consequence:['I let the moment end without replaying the rest','I stay where I am instead of chasing the old scene'],turn:['Remembering is not the same as returning','I can keep the good part without rewriting the ending'],hook:['One small detail puts me back there','The past shows up before I ask for it','I remember faster than I want to']},
 breakup:{titles:['After Us','Not Ours Now','Different Now','Still Over'],reaction:['I almost send it before I remember we do not talk','I stop myself one second later than I want to','I act normal until one detail pulls me out of it'],consequence:['I make new plans in places that used to feel shared','I change the route instead of testing myself again','I build days that do not need your name in them'],turn:['I can miss what was good without wanting the ending back','I let the ending stay true even when I miss you'],hook:['I miss you and I still would not go back','We are over but some moments do not know it yet','I want the old feeling, not the old ending']},
 voice:{titles:['Wrong Voice','Same Sound','Almost You','Turned Around'],reaction:['I turn around before I can stop myself','My body reacts before my head catches up','I freeze long enough to feel stupid about it'],consequence:['I turn the music down before the next song','I keep talking but I am not fully in the conversation'],turn:['I let the sound pass instead of making it a sign','I know familiar does not mean meant for me'],hook:['Something sounds like you and I turn too fast','For a second every voice becomes yours','One sound changes the whole room']},
 phone:{titles:['Almost Sent','Old Thread','Screen Goes Dark','No Reply'],reaction:['I check the name too fast and hate that I did','I read the draft twice and still do not send it','I lock the screen like that changes what I wanted'],consequence:['I delete the draft before I change my mind','I put the phone across the room and leave it there'],turn:['I do not need a reply to know what this is','I can leave the number saved and stop using it'],hook:['I almost text you and let the screen go dark','I know the number and I know not to call','Your name is close but I leave it alone']},
 home:{titles:['Same House','Different Room','Still In Place','Keys Down'],reaction:['I notice the empty space before anything else','I leave the TV on longer than I need to','I move something just to make the room look different'],consequence:['I make new routines in the same old space','I let the house become mine again'],turn:['Familiar does not have to mean stuck','I want this place to hold new days too'],hook:['Same house, different feeling when I walk in','Everything is where it was except us','The room did not change; I did']},
 regret:{titles:['Late Answer','Wrong Moment','What I Should Have Said','After The Pause'],reaction:['I rewrite the conversation when nobody is there','I wish I had slowed down before I tried to win','I hear my old answer and hate how certain it sounded'],consequence:['I say what I mean earlier now','I keep the lesson even if I cannot repair the moment'],turn:['I can regret my part without asking you to erase yours','I do not need another chance to admit I was wrong'],hook:['I know what I should have said now','Too late does not make sorry fake','I won the argument and lost the night']},
 trust:{titles:['Pattern Changed','One More Detail','Proof First','Same Question'],reaction:['I listen for what changes instead of what sounds good','I stop asking the same question a third time','I catch myself checking things I never used to check'],consequence:['I choose a boundary before another investigation','I stop arguing with the pattern I already see'],turn:['I can care about you and still believe what keeps repeating','Trust is not supposed to feel like detective work'],hook:['I believe the pattern more than the promise now','One more detail and the whole story changes','Your words are clean but the pattern is not']},
 'moving-on':{titles:['No Big Moment','Different Route','Not Going Back','Kept Driving'],reaction:['I notice the change after it already happened','I feel the pull and keep doing what I was doing','I let the reminder be ordinary'],consequence:['I stop measuring progress by whether I feel nothing','I make room for new people without comparing every detail'],turn:['I do not need to forget you to stop returning','I want forward more than I want familiar'],hook:['I did not forget; I just did not go back','Nothing dramatic happened, I just kept moving','Forward finally feels more normal than familiar']},
 loneliness:{titles:['Too Much Quiet','Nobody Awake','Long Night','TV Still On'],reaction:['I reach for noise before I reach for anybody','I almost call the wrong person just to hear a voice','I keep myself busy until the silence wins'],consequence:['I call somebody safe instead of somebody familiar','I go outside before the room gets smaller'],turn:['I can be lonely without going backward','I want company that does not cost me tomorrow'],hook:['Too much quiet makes the wrong name sound right','I do not miss you every time I hate being alone','Everybody leaves and I start thinking too loud']},
 time:{titles:['Wrong Hour','Before Morning','Too Late','Calendar Changed'],reaction:['I check the time before I check the feeling','I notice the hour only after the thought gets loud'],consequence:['I stop counting days like they owe me an answer','I let the date pass without building the whole day around it'],turn:['Time passing and healing are not the same thing','I can be farther away without pretending I forgot'],hook:['The hour changes faster than the feeling','Too late still feels early when I miss you']},
 music:{titles:['First Note','Skip The Song','Same Playlist','Turn It Down'],reaction:['I reach for the volume before I know why','I stop talking because the song already took me somewhere else','I skip the track and still hear the next part'],consequence:['I build a new playlist instead of deleting the old one','I let the song belong to more than one memory'],turn:['I can keep the song without keeping the relationship','I want new memories on top of the old ones'],hook:['First note and I know where my head is going','I skip the song but the memory keeps playing','Same melody, different life now']}
};
const ADD_CONCEPTS=[
 {id:'ambition',aliases:['ambition','goal','goals','dream career','make it','success','winning','prove myself'],details:['I keep working after the exciting part wears off','the plan looks smaller when I put it on today instead of someday','I finish one thing before announcing the next one','the quiet hours count more than the speech'],angles:['progress feels different when nobody is clapping yet','wanting more can be useful without hating where I am','the result matters more than looking busy'],hook_words:['prove it','next step','keep going','show me'],titles:['No Announcement','Next Step','Quiet Work'],reaction:['I stop explaining and go back to the work','I catch myself checking the result instead of the reaction'],consequence:['I let the finished work make the introduction','I keep the next move smaller and more real'],turn:['I do not need everybody to understand the plan','I want the result more than the image'],hook:['I would rather show it than explain it','Quiet work gets loud when it lands','I stopped asking if they see it yet']},
 {id:'self-doubt',aliases:['doubt myself','self doubt','insecure','not good enough','overthinking myself','confidence issue'],details:['I redo something that was already good enough','I compare my first draft to somebody else finished work','one small mistake starts sounding bigger than it is','I hesitate after I already made the right choice'],angles:['doubt often sounds certain while evidence sounds quiet','being unsure does not erase ability','comparison can turn progress into a problem'],hook_words:['good enough','still here','my own head'],titles:['Good Enough','My Own Head','Second Guess'],reaction:['I hear the doubt and keep moving anyway','I stop checking for permission I already gave myself'],consequence:['I finish before I decide how I feel about it','I let one completed thing count as evidence'],turn:['I do not need confidence before the first step','I can be unsure and still be moving right'],hook:['My own head makes the smallest thing loud','I can doubt it and still finish it','Good enough is better than never done']},
 {id:'pressure',aliases:['pressure','stress','expectations','too much','everyone expects','burnout','overwhelmed'],details:['everybody asks what comes next before I finish this','my phone keeps turning small things into emergencies','I carry tomorrow into the middle of today','one unfinished thing starts representing everything'],angles:['pressure grows when every task becomes a verdict','rest and quitting are not the same decision','urgency can make the wrong thing feel important'],hook_words:['too much','right now','slow down'],titles:['Too Much At Once','Right Now','Not Everything'],reaction:['I answer too fast because silence feels expensive','I keep moving even when I am not choosing well'],consequence:['I put one thing first and let the rest wait','I stop treating every request like a fire'],turn:['Not everything deserves me at the same time','I can slow down without falling behind'],hook:['Not everything has to happen right now','Too much at once makes nothing feel finished','I need one clear thing, not ten loud ones']},
 {id:'friendship',aliases:['friend','friends','best friend','friendship','homie','crew'],details:['we can sit in the car without filling every second','one joke carries a whole year inside it','they notice the mood before I explain it','we pick up the conversation like the gap was nothing'],angles:['reliable friendship is often ordinary and repeatable','being known can feel quieter than being impressed','good friends reduce the amount of explaining needed'],hook_words:['same team','you know me','still here'],titles:['Same Team','No Explanation','Still Here'],reaction:['I laugh before the story even reaches the good part','I know who I call when the day gets strange'],consequence:['I show up before I know the perfect thing to say','I keep the people who make honesty easy'],turn:['I do not need a crowd when I know who stays','Some people feel like less explaining'],hook:['Same team even when nobody is watching','You know the part I leave out','Still here after the story gets boring']},
 {id:'family',aliases:['family','mom','dad','mother','father','brother','sister','parents','home people'],details:['the kitchen conversation lasts longer than the food','some advice sounds different years later','we argue in shortcuts because everybody knows the history','one old story changes depending on who tells it'],angles:['family can hold love and tension at the same time','shared history makes small words carry more weight','growing up can change how old advice sounds'],hook_words:['same blood','home','family'],titles:['Same House Different Years','Old Advice','At The Table'],reaction:['I hear myself using a phrase I used to hate','I understand one old argument a little differently now'],consequence:['I keep the good parts without copying every pattern','I say the thing earlier instead of letting it become history'],turn:['Growing up does not mean outgrowing everybody','Love can be real without every relationship being simple'],hook:['Same family, different version of me','Old advice sounds new when life catches up','Home is complicated and I still know the way']},
 {id:'attraction',aliases:['crush','attracted','chemistry','flirting','flirt','like them','like her','like him'],details:['I notice where they are before I mean to','one look changes how normal the conversation feels','I replay the easy part of what they said','the room gets smaller when they stand closer'],angles:['attraction is often attention before explanation','small reactions can reveal interest before a confession','tension works better in lyrics when shown through behavior'],hook_words:['look at me','too close','obvious'],titles:['Too Obvious','One Look','Close Enough'],reaction:['I look away a second later than I should','I answer normally and hear the difference in my voice'],consequence:['I stop pretending the conversation is completely casual','I let the moment stay small instead of naming everything'],turn:['Maybe the obvious part is enough for tonight','I do not need a big confession to know the energy changed'],hook:['One look and the whole conversation changes','You make casual feel way too obvious','I know you noticed me noticing you']},
 {id:'jealousy',aliases:['jealous','jealousy','envy','someone else','another person'],details:['I notice who gets your attention before I notice what I am doing','one harmless comment becomes a whole story in my head','I act relaxed while counting details I should not be counting','I compare myself to somebody I barely know'],angles:['jealousy often fills missing information with the worst version','attention can feel like proof when insecurity is already active','comparison turns strangers into competition'],hook_words:['someone else','why them','look away'],titles:['Someone Else','Made It A Story','Not Proof'],reaction:['I get quiet instead of asking the actual question','I pretend I did not notice and notice everything'],consequence:['I ask for clarity instead of building a case alone','I stop treating somebody else as an answer about me'],turn:['A feeling is not automatically evidence','I want the truth more than the story my head made'],hook:['I made someone else mean more than they did','Jealousy turns one look into a whole night','I need an answer, not another guess']},
 {id:'change',aliases:['change','changing','different now','new chapter','grew up','growth'],details:['the old routine stops fitting before I know what replaces it','I notice I answer the same question differently now','one place feels smaller than I remember it','I keep something I used to throw away'],angles:['change is easier to show through behavior than announcements','growth can make familiar things feel slightly wrong','becoming different does not require hating the old version'],hook_words:['different now','new version','not the same'],titles:['Different Now','Old Version','New Answer'],reaction:['I catch the change in something ordinary','I surprise myself before anybody else notices'],consequence:['I make a choice the old version of me would avoid','I stop forcing old routines to prove they still fit'],turn:['I can respect who I was without staying there','Different does not have to mean unrecognizable'],hook:['I know I changed because the old answer feels wrong','Same name, different reaction now','I did not notice growth until normal changed']},
 {id:'hometown',aliases:['hometown','where i grew up','old neighborhood','my town','home town'],details:['the same corner store looks smaller than I remember','I know the roads without looking at the signs','one parking lot holds more stories than it should','somebody recognizes my last name before my face'],angles:['returning to a hometown measures change against a stable map','places can preserve an old version of identity','familiar streets make time visible'],hook_words:['same street','old town','back home'],titles:['Same Street','Old Town New Me','Back Home'],reaction:['I slow down at places I used to pass every day','I remember who I was before I remember what happened there'],consequence:['I leave with a clearer idea of what changed','I keep the place without needing to become that version again'],turn:['I can belong somewhere without staying the same','The map stayed still while I did not'],hook:['Same street, different person in the car','Back home makes the years show up at once','The town remembers a version of me I outgrew']},
 {id:'travel',aliases:['drive','driving','road trip','travel','flight','airport','road','highway'],details:['the highway lines make the thinking feel organized','a new exit gives me somewhere else to look','the gas station light makes the night feel temporary','I watch the old city disappear in the mirror'],angles:['movement can give a song physical progression without pretending it fixes emotion','a road works best when tied to a real choice or destination','travel creates changing scenery that can mirror changing thoughts'],hook_words:['keep driving','next exit','miles away'],titles:['Next Exit','Keep Driving','Miles Away'],reaction:['I turn the volume up when the thought gets too clear','I miss one exit because my head is somewhere else'],consequence:['I keep going until the place stops carrying the whole story','I let the distance become information, not proof'],turn:['Miles do not solve it but they change what I can see','I am not running if I know where I am going'],hook:['Keep driving until the old thought gets smaller','Next exit, different view, same night','Miles away does not mean over it']},
 {id:'celebration',aliases:['party','celebrate','celebration','we won','good night','having fun','turn up'],details:['somebody starts the chorus before the speakers do','the room reacts before the beat fully drops','I lose my voice on the easiest line','everybody knows when the night finally starts'],angles:['celebration lyrics work when movement and group reaction carry the energy','simple language leaves room for rhythm and participation','a strong party hook usually gives people something easy to repeat'],hook_words:['right now','one more','all night'],titles:['One More','Right Now','Already Started'],reaction:['I stop thinking once everybody catches the same rhythm','I hear the room answer before the line ends'],consequence:['I leave space so everybody can shout the last word','I keep the next line simple enough to come back louder'],turn:['The best part is everybody knowing what happens next','I do not need a complicated line when the room already gets it'],hook:['One more time and everybody knows it','Right now is the only plan we need','The night starts when the whole room answers']},
 {id:'future',aliases:['future','someday','next year','what comes next','dream life','plan for the future'],details:['I write the date down before I feel ready for it','the plan becomes real when it needs a first step','I picture a normal day inside the life I say I want','one small decision changes what next month can look like'],angles:['future-focused lyrics get stronger when they include an ordinary future detail','hope feels believable when paired with a concrete action','a plan is more emotional when it costs something now'],hook_words:['next year','someday','from here'],titles:['From Here','Next Year','Someday Gets A Date'],reaction:['I get nervous when the dream turns into a schedule','I stop waiting for the perfect version of the plan'],consequence:['I put one real step underneath the big idea','I choose what I can do today instead of describing forever'],turn:['Someday gets useful when it finally gets a date','I want a future I can recognize in small decisions'],hook:['Someday sounds different when I start today','From here, I only need the next real move','Next year starts with something small tonight']},
 {id:'identity',aliases:['who i am','identity','myself','be myself','different person','finding myself'],details:['I hear myself agreeing with things I do not actually want','one old label follows me into a place it does not fit','I notice which version of me shows up around different people','I feel lighter when I stop performing the explanation'],angles:['identity lyrics work when they show a choice between performance and preference','self-knowledge often appears through repeated behavior','labels can be useful until they become instructions'],hook_words:['my name','myself','who i am'],titles:['My Own Name','No Performance','Who Shows Up'],reaction:['I catch myself changing the answer for the room','I feel the difference when I stop trying to sound impressive'],consequence:['I keep the choice that still feels right when nobody sees it','I let old labels become history instead of rules'],turn:['I do not need one sentence to explain who I am','The real version is the one I can keep living'],hook:['I sound more like myself when I stop explaining','My own name should feel like mine','Who I am gets clearer when the room gets quiet']},
 {id:'social-media',aliases:['instagram','tiktok','social media','post','story','online','followers','likes'],details:['I open the app without knowing what I came to check','one post changes my mood faster than it deserves to','I compare a normal day to somebody else highlight','the screen makes everybody look certain'],angles:['social media can turn attention into a score even when the goals are unrelated','online presentation removes most of the boring context','comparison gets stronger when the evidence is edited'],hook_words:['offline','post it','screen'],titles:['Off The Screen','Highlight Reel','Close The App'],reaction:['I refresh before I decide whether I actually care','I catch myself measuring a real day with an edited one'],consequence:['I close the app before the comparison becomes a plan','I make something before checking how somebody else did it'],turn:['A highlight is not a full life','I want the real result more than the post about it'],hook:['Close the app before the screen picks my mood','Everybody looks certain from the outside','I need my life more than another highlight']},
 {id:'money',aliases:['money','broke','paid','paycheck','cash','rent','bills','saving'],details:['the number in the account decides what waits this week','I move money around before I let myself want anything','one small bill makes the whole month feel tighter','I know the price before I know if I like it'],angles:['money lyrics become more believable when they show a tradeoff','financial pressure is often a sequence of small choices, not one dramatic moment','security and status are different emotional goals'],hook_words:['payday','enough','price'],titles:['What It Costs','Payday','Enough This Month'],reaction:['I do the math twice because I want a different answer','I put something back and keep thinking about it'],consequence:['I choose what matters most before the money disappears','I save a small amount even when it does not feel impressive'],turn:['Enough can mean peace before it means luxury','I want control more than I want to look rich'],hook:['I know what it costs before I let myself want it','Payday comes with a list already waiting','I want enough to breathe, not enough to perform']},
 {id:'night',aliases:['night','late night','midnight','2am','3am','after dark'],details:['the refrigerator hum sounds louder after midnight','streetlights divide the room through the blinds','every notification feels more important after two','the house makes small noises I ignore during the day'],angles:['night can magnify thoughts because fewer competing details are present','late hours are useful for songs when paired with one physical setting','the same idea can feel more convincing at night than in the morning'],hook_words:['midnight','2am','before morning'],titles:['After Midnight','Before Morning','2AM Logic'],reaction:['I almost believe the thought because nothing else is happening','I check the time and keep thinking anyway'],consequence:['I leave the decision for morning instead of making the night permanent','I turn the screen off and let the thought stay unfinished'],turn:['Not every midnight thought deserves daylight action','Morning can disagree with me and still be right'],hook:['After midnight every thought sounds certain','2AM makes the wrong idea sound reasonable','I leave the answer for before morning']}
];

let DATA_PROMISE=null;
async function loadData(){
 if(DATA_PROMISE)return DATA_PROMISE;
 DATA_PROMISE=(async()=>{
  const [a,b]=await Promise.allSettled([
   fetch(LEX_URL,{cache:'default'}).then(r=>r.ok?r.json():Promise.reject(new Error('lex '+r.status))),
   fetch(RHYME_URL,{cache:'default'}).then(r=>r.ok?r.json():Promise.reject(new Error('rhyme '+r.status)))
  ]);
  return {lex:a.status==='fulfilled'?a.value:{concepts:[]},rhyme:b.status==='fulfilled'?b.value:FALLBACK_RHYME};
 })();
 return DATA_PROMISE;
}

function install(LEXICON,RHYME){
 if(window.__mcSmartV5)return;
 const $=id=>document.getElementById(id);
 const VERSION_NAME='Smart Composer v5';
 const HIST='mcSmartHistV5',BAD='mcBadLinesV5',LEARN='mcSmartLearnV5',FB='mcSongFeedback';
 const NEG=new Set(['too_wordy','weird_lyrics','bad_placement','too_generic','too_repetitive','weak_hook']);
 const STOP=new Set('the a an and or but if then than to of in on at for from with without into over under i me my mine you your yours we our ours they their it its this that these those is are was were be been being do does did have has had can could would should will just really very still now then so cause cuz yeah no not keep keeps kept want wants wanted know knows knew think thinks thought make makes made feel feels felt song songs lyric lyrics music'.split(' '));
 const DAN=new Set(['without','with','and','but','so','to','of','for','from','when','because','if','while','like','than','as']);
 const OVER=new Set(['habit','memory','again','gone','still','back','quiet','room','alone','heart','forever','always','dark','pain','broken','tears']);
 const CLICHE=['broken heart','tears like rain','lost in the dark','heart of stone','love is a drug','drowning in pain','cold as ice','time heals everything','set me free','fade away','pieces of me','fire inside','demons in my head','empty inside','world without you'];
 const DEFAULT={Heartbroken:['voice','breakup','absence'],Vulnerable:['regret','self-doubt','loneliness'],Confident:['ambition','identity','moving-on'],Dark:['trust','pressure','night'],Dreamy:['music','memory','night'],Hopeful:['future','moving-on','ambition'],Playful:['attraction','friendship','voice'],Energetic:['celebration','ambition','music']};
 const ARC={
  Heartbroken:{v1:['scene','reaction','scene','meaning'],v2:['consequence','reaction','meaning','turn'],pre:['meaning','turn'],bridge:['turn','consequence']},
  Vulnerable:{v1:['scene','reaction','meaning','scene'],v2:['consequence','meaning','turn','reaction'],pre:['meaning','turn'],bridge:['turn','consequence']},
  Confident:{v1:['scene','meaning','consequence'],v2:['consequence','scene','turn'],pre:['meaning','turn'],bridge:['turn','consequence']},
  Dark:{v1:['scene','reaction','meaning'],v2:['consequence','scene','turn'],pre:['meaning','reaction'],bridge:['turn','consequence']},
  Dreamy:{v1:['scene','scene','meaning'],v2:['scene','meaning','turn'],pre:['meaning','scene'],bridge:['turn','scene']},
  Hopeful:{v1:['scene','reaction','meaning'],v2:['consequence','scene','turn'],pre:['meaning','turn'],bridge:['turn','consequence']},
  Playful:{v1:['scene','reaction','meaning'],v2:['scene','consequence','turn'],pre:['reaction','hook'],bridge:['turn','reaction']},
  Energetic:{v1:['scene','reaction','consequence'],v2:['scene','turn','consequence'],pre:['hook','reaction'],bridge:['turn','hook']}
 };
 const GENRES={
  'melodic-rap':{verseWords:[5,11],hookWords:[3,8],verseSyl:[7,15],hookSyl:[4,11],rhyme:.35,space:.68},
  'mainstream-pop':{verseWords:[4,10],hookWords:[2,7],verseSyl:[6,14],hookSyl:[3,10],rhyme:.45,space:.6},
  'hip-hop':{verseWords:[6,14],hookWords:[3,9],verseSyl:[8,18],hookSyl:[4,12],rhyme:.5,space:.45},
  'rnb':{verseWords:[4,10],hookWords:[2,8],verseSyl:[6,14],hookSyl:[3,11],rhyme:.32,space:.72},
  'alternative-rock':{verseWords:[4,12],hookWords:[3,9],verseSyl:[6,16],hookSyl:[4,12],rhyme:.25,space:.55},
  'country':{verseWords:[5,13],hookWords:[3,9],verseSyl:[7,17],hookSyl:[4,12],rhyme:.38,space:.52}
 };
 const oldConcepts=LEXICON.concepts||[];
 const byId=new Map();
 for(const c of [...oldConcepts,...ADD_CONCEPTS])byId.set(c.id,{...byId.get(c.id),...c});
 const concepts=[...byId.values()];

 const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
 const norm=s=>clean(s).toLowerCase().replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
 const words=s=>clean(s).split(/\s+/).filter(Boolean);
 const toks=s=>norm(s).split(' ').filter(w=>w.length>2&&!STOP.has(w));
 const stem=w=>{w=norm(w);if(w.endsWith('ies')&&w.length>5)w=w.slice(0,-3)+'y';else if(w.endsWith('ing')&&w.length>6)w=w.slice(0,-3);else if(w.endsWith('ed')&&w.length>5)w=w.slice(0,-2);else if(w.endsWith('es')&&w.length>5)w=w.slice(0,-2);else if(w.endsWith('s')&&w.length>4)w=w.slice(0,-1);return w};
 const stset=s=>new Set(toks(s).map(stem));
 const sim=(a,b)=>{const A=stset(a),B=stset(b);if(!A.size||!B.size)return 0;let n=0;for(const x of A)if(B.has(x))n++;return n/Math.max(A.size,B.size)};
 const uniq=a=>[...new Set((a||[]).filter(Boolean).map(clean).filter(Boolean))];
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'')||f}catch(e){return f}};
 const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
 const hist=()=>read(HIST,[]).slice(0,10),bad=()=>read(BAD,[]).slice(0,120),learn=()=>read(LEARN,{goodHooks:[],goodFlows:[],goodConcepts:{}}),feedback=()=>read(FB,{});
 const rng=seed=>{let x=seed>>>0||1;return()=>{x=(1664525*x+1013904223)>>>0;return x/4294967296}};
 const pick=(a,r)=>a?.length?a[Math.floor(r()*a.length)]:'';
 const shuffle=(a,r)=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const first=s=>words(s)[0]?.toLowerCase()||'';
 const last=s=>{const a=toks(s);return a[a.length-1]||''};

 const rhymeIndex=new Map();
 for(const fam of RHYME.families||[]){for(const w of fam.perfect||[])rhymeIndex.set(norm(w),{fam,q:1});for(const w of fam.slant||[])if(!rhymeIndex.has(norm(w)))rhymeIndex.set(norm(w),{fam,q:.68})}
 const rhymeScore=(a,b)=>{a=norm(a);b=norm(b);if(!a||!b||a===b)return 0;const A=rhymeIndex.get(a),B=rhymeIndex.get(b);if(A&&B&&A.fam.id===B.fam.id)return Math.min(A.q,B.q);if(a.slice(-3)===b.slice(-3))return .45;if(a.slice(-2)===b.slice(-2))return .25;return 0};
 const holdable=w=>{const x=rhymeIndex.get(norm(w));if(x?.fam?.holdable?.some(v=>norm(v)===norm(w)))return true;return /[aeiouy][a-z]*$/.test(norm(w))&&!/[ktpdg]$/.test(norm(w))};

 function syllableWord(w){
  w=norm(w).replace(/[^a-z]/g,'');if(!w)return 0;if(w.length<=3)return 1;
  let x=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');
  let m=x.match(/[aeiouy]{1,2}/g);let n=m?m.length:1;
  if(/le$/.test(w)&&!/[^aeiouy]le$/.test(w))n++;
  return Math.max(1,n);
 }
 const syllables=line=>words(line).reduce((n,w)=>n+syllableWord(w),0);

 function genreId(){
  if(typeof window.genreId==='function'){try{return window.genreId()}catch(e){}}
  const g=norm($('genre')?.value||'');
  if(/r&b|rnb/.test(g))return'rnb';if(/country/.test(g))return'country';if(/rock|alternative/.test(g))return'alternative-rock';if(/pop/.test(g)&&!/rap/.test(g))return'mainstream-pop';if(/melodic.*rap|rap.*pop/.test(g))return'melodic-rap';return'hip-hop';
 }
 const profile=()=>GENRES[genreId()]||GENRES['melodic-rap'];

 function topicContext(){
  const raw=$('theme')?.value||'',low=norm(raw),rawStems=new Set(toks(raw).map(stem)),scored=[];
  for(const c of concepts){let score=0;for(const a of [c.id,...(c.aliases||[])]){const q=norm(a);if(!q)continue;if(low.includes(q))score+=q.includes(' ')?10:6;for(const w of toks(q))if(rawStems.has(stem(w)))score+=2}for(const w of [...(c.hook_words||[]),...(c.nouns||[])])if(toks(w).some(x=>rawStems.has(stem(x))))score+=1;if(score>0)scored.push({c,score})}
  scored.sort((a,b)=>b.score-a.score);
  let C=scored.slice(0,4).map(x=>x.c);
  if(!C.length)C=(DEFAULT[$('mood')?.value]||['memory']).map(id=>byId.get(id)).filter(Boolean);
  const key=toks(raw).filter(w=>!['song','about','something'].includes(w)).slice(0,10);
  return{raw,rawStems,C,key};
 }
 function extra(c,k){return c?.[k]||EXTRA[c?.id]?.[k]||[]}
 function pool(C,k){
  let o=[];
  for(const c of C){
   if(k==='scene')o.push(...(c.details||[]));
   else if(k==='meaning')o.push(...(c.angles||[]));
   else if(k==='reaction')o.push(...extra(c,'reaction'));
   else if(k==='consequence')o.push(...extra(c,'consequence'));
   else if(k==='turn')o.push(...extra(c,'turn'));
   else if(k==='hook')o.push(...extra(c,'hook'));
   else if(k==='title')o.push(...(c.titles||[]),...extra(c,'titles'));
  }
  return uniq(o);
 }

 function recentStemCounts(){const m=new Map();for(const h of hist())for(const w of h.stems||[])m.set(w,(m.get(w)||0)+1);return m}
 function topicRel(line,C){const L=stset(line);let s=0;for(const w of C.rawStems)if(L.has(w))s+=2.5;for(const c of C.C){for(const q of [c.id,...(c.aliases||[]),...(c.nouns||[]),...(c.hook_words||[])])for(const w of toks(q).map(stem))if(L.has(w))s+=.18}return Math.min(12,s)}
 function naturalPenalty(line,role,C,mode,localStarts){
  const n=norm(line),W=words(line),T=toks(line),S=T.map(stem),p=profile();let q=0;
  if(W.length<2)return 999;
  if(DAN.has(stem(W.at(-1))))q+=180;
  if(/\b(and and|but but|to to|of of|i i|you you)\b/i.test(n))q+=140;
  if(/\b(i|you|we)\s+(is|was are|am are)\b/i.test(n))q+=120;
  if(/[;,:]\s*(and|but|so)\s*$/.test(n))q+=100;
  for(const c of CLICHE)if(n.includes(c))q+=110;
  const lim=role==='hook'?p.hookWords:p.verseWords;
  if(W.length<lim[0])q+=(lim[0]-W.length)*5;
  if(W.length>lim[1])q+=(W.length-lim[1])*12;
  const syl=syllables(line),slim=role==='hook'?p.hookSyl:p.verseSyl;
  if(syl<slim[0])q+=(slim[0]-syl)*2.5;
  if(syl>slim[1])q+=(syl-slim[1])*5;
  const recent=recentStemCounts();
  for(const w of S){q+=(recent.get(w)||0)*(mode==='too_repetitive'?5.2:2.4);if(OVER.has(w)&&!C.rawStems.has(w))q+=15}
  if(mode==='weird_lyrics'&&W.length>9)q+=(W.length-9)*10;
  for(const b of bad()){const z=sim(line,b);if(z>.78)q+=220;else if(z>.58)q+=90}
  const start=words(line).slice(0,2).join(' ').toLowerCase();q+=(localStarts.get(start)||0)*11;
  if(mode==='too_wordy'&&W.length>(role==='hook'?5:8))q+=60;
  q-=topicRel(line,C)*(mode==='too_generic'?9:2.7);
  return q;
 }
 function trimLine(s,role,mode){
  let a=words(s),p=profile(),max=mode==='too_wordy'?(role==='hook'?5:8):(role==='hook'?p.hookWords[1]:p.verseWords[1]);
  if(a.length>max+2)a=a.slice(0,max);
  while(a.length>2&&DAN.has(stem(a.at(-1))))a.pop();
  return a.join(' ');
 }

 function chooseLine(P,C,role,mode,r,localStarts,used,prevEnd){
  const scored=uniq(P).filter(x=>!used.some(y=>sim(x,y)>.66)).map(x=>{
   const line=trimLine(x,role,mode),rh=rhymeScore(prevEnd,last(line)),h=holdable(last(line))?1:0;
   return{x:line,s:naturalPenalty(line,role,C,mode,localStarts)-rh*(role==='hook'?5:2)-h*(role==='hook'?2:0)+(r()-.5)*10};
  }).sort((a,b)=>a.s-b.s);
  return scored[0]?.x||'';
 }
 function bpm(){const n=parseFloat($('bpm')?.value||'');if(Number.isFinite(n)&&n>=45&&n<=220)return n;const g=genreId();return g==='mainstream-pop'?112:g==='hip-hop'?92:g==='rnb'?82:g==='country'?96:104}
 function lineBudget(s,mode){
  const bars=Math.max(1,s.end-s.start)*bpm()/240,r=s.role,p=profile();let n;
  if(/Intro/.test(r))n=bars>=4?1:0;
  else if(/Verse/.test(r))n=Math.max(3,Math.min(7,Math.round(bars/(p.space>.65?2.1:1.7))));
  else if(/Pre/.test(r))n=Math.max(2,Math.min(3,Math.round(bars/2)));
  else if(/Hook/.test(r))n=Math.max(3,Math.min(4,Math.round(bars/1.9)));
  else if(/Bridge|Break/.test(r))n=Math.max(1,Math.min(3,Math.round(bars/2.4)));
  else n=1;
  if(mode==='bad_placement')n=Math.max(/Hook/.test(r)?3:1,Math.ceil(n*.6));
  if(mode==='too_wordy')n=Math.max(/Hook/.test(r)?3:2,Math.ceil(n*.75));
  return n;
 }
 function lanes(role){
  const p=ARC[$('mood')?.value]||ARC.Heartbroken;
  if(/Verse 2/.test(role))return p.v2;if(/Verse/.test(role))return p.v1;if(/Pre/.test(role))return p.pre;if(/Bridge|Break/.test(role))return p.bridge;return['hook','meaning','hook'];
 }
 function title(C,r){
  const L=learn(),old=new Set(hist().map(h=>norm(h.title))),P=pool(C.C,'title');
  return P.map(x=>({x,s:(old.has(norm(x))?100:0)-topicRel(x,C)*2+(r()-.5)*8})).sort((a,b)=>a.s-b.s)[0]?.x||pick(C.key,r)||'Untitled';
 }
 function hookAnchor(C,mode,r,used,localStarts){
  const P=pool(C.C,'hook');
  const learned=learn().goodHooks||[];
  return uniq(P).map(x=>{
   const line=trimLine(x,'hook',mode),wc=words(line).length,sc=naturalPenalty(line,'hook',C,mode,localStarts)-topicRel(line,C)*2-(holdable(last(line))?4:0);
   if(wc>=3&&wc<=7)sc-=mode==='weak_hook'?14:8;
   if(mode==='weak_hook'&&holdable(last(line)))sc-=6;
   for(const h of learned.slice(-12)){if(Math.abs((h.words||4)-wc)<=1)sc-=1.5}
   if(mode==='weak_hook')sc-=topicRel(line,C)*5;
   return{x:line,s:sc+(r()-.5)*8};
  }).sort((a,b)=>a.s-b.s)[0]?.x||trimLine(title(C,r),'hook',mode);
 }
 function sectionDraft(s,C,mode,r,globalUsed,localStarts){
  const n=lineBudget(s,mode),role=s.role,out=[];let prev='';
  if(/Intro/.test(role)&&!n)return['[NO VOCAL]'];
  if(/Outro/.test(role))return['[NO VOCAL]',hookAnchor(C,mode,r,globalUsed,localStarts)];
  if(/Hook/.test(role)){
   const A=hookAnchor(C,mode,r,globalUsed,localStarts),support=uniq([...pool(C.C,'meaning'),...pool(C.C,'reaction'),...pool(C.C,'consequence'),...pool(C.C,'turn')]);out.push(A);
   while(out.length<Math.max(2,n-1)){const x=chooseLine(support,C,'hook',mode,r,localStarts,[...globalUsed,...out],last(A));if(!x)break;out.push(x)}
   if(mode==='bad_placement'&&out[1])return[A,'[NO VOCAL]',out[1],A];
   if(n>=4)out.push(A);
   return out.slice(0,n);
  }
  const L=lanes(role);
  for(let i=0;i<n;i++){
   let P=pool(C.C,L[i%L.length]);if(!P.length)P=uniq([...pool(C.C,'scene'),...pool(C.C,'meaning'),...pool(C.C,'reaction'),...pool(C.C,'consequence'),...pool(C.C,'turn')]);
   let x=chooseLine(P,C,'verse',mode,r,localStarts,[...globalUsed,...out],prev);if(!x)continue;
   out.push(x);prev=last(x);const st=words(x).slice(0,2).join(' ').toLowerCase();localStarts.set(st,(localStarts.get(st)||0)+1);
  }
  return out.length?out:['[NO VOCAL]'];
 }

 function songMetrics(sections,C,titleText){
  const lyric=sections.flatMap(s=>s.lines.filter(x=>x!=='[NO VOCAL]')),verse=sections.filter(s=>/Verse/.test(s.role)).flatMap(s=>s.lines.filter(x=>x!=='[NO VOCAL]')),hooks=sections.filter(s=>/Hook/.test(s.role));
  const allStems=lyric.flatMap(x=>toks(x).map(stem)),unique=new Set(allStems);
  let duplicate=0,cliche=0,dangle=0,topic=0,syllVar=0,rhy=0,rhyN=0;
  for(let i=0;i<lyric.length;i++){const x=lyric[i],W=words(x);if(DAN.has(stem(W.at(-1))))dangle++;if(CLICHE.some(c=>norm(x).includes(c)))cliche++;topic+=topicRel(x,C);for(let j=0;j<i;j++)if(sim(x,lyric[j])>.72)duplicate++}
  const vs=verse.map(syllables);if(vs.length>1){const m=vs.reduce((a,b)=>a+b,0)/vs.length;syllVar=Math.sqrt(vs.reduce((a,b)=>a+(b-m)**2,0)/vs.length)}
  for(const h of hooks){const l=h.lines.filter(x=>x!=='[NO VOCAL]');for(let i=1;i<l.length;i++){rhy+=rhymeScore(last(l[0]),last(l[i]));rhyN++}}
  const diversity=allStems.length?unique.size/allStems.length:0,topicAvg=lyric.length?topic/lyric.length:0;
  const anchor=hooks[0]?.lines?.[0]||'',anchorRepeats=hooks.reduce((n,h)=>n+h.lines.filter(x=>norm(x)===norm(anchor)).length,0);
  let hook=55+Math.min(18,topicRel(anchor,C)*2)+(holdable(last(anchor))?6:0)+(words(anchor).length>=3&&words(anchor).length<=7?8:0)+(anchorRepeats>=2?8:0)+(rhyN?rhy/rhyN*6:0);
  let flow=82-Math.min(35,syllVar*4)-dangle*20;
  let freshness=70+Math.min(20,(diversity-.45)*70)-duplicate*10-cliche*20;
  let topicScore=Math.min(100,55+topicAvg*8);
  let naturalScore=Math.max(0,96-dangle*35-cliche*28-duplicate*7);
  if(lyric.filter(x=>first(x)==='i').length>lyric.length*.72)naturalScore-=8;
  const learned=learn();
  if(learned.goodConcepts)for(const c of C.C)topicScore+=Math.min(4,(learned.goodConcepts[c.id]||0)*.5);
  const total=Math.max(0,Math.min(100,topicScore*.24+naturalScore*.28+hook*.22+flow*.14+freshness*.12));
  return{total,topic:topicScore,natural:naturalScore,hook,flow,freshness,diversity,anchor,title:titleText};
 }
 function makeDraft(C,mode,seed){
  const r=rng(seed),globalUsed=[],starts=new Map(),sections=[],T=title(C,r);
  for(const s of report.structure){const lines=sectionDraft(s,C,mode,r,globalUsed,starts);for(const x of lines)if(x!=='[NO VOCAL]')globalUsed.push(x);sections.push({...s,lines})}
  const metrics=songMetrics(sections,C,T);return{title:T,sections,lines:globalUsed,metrics};
 }
 function tournament(C,mode){
  const base=(Date.now()^(hist().length*2654435761))>>>0,count=mode==='weird_lyrics'||mode==='weak_hook'?16:12,drafts=[];
  for(let i=0;i<count;i++)drafts.push(makeDraft(C,mode,(base+i*104729)>>>0));
  drafts.sort((a,b)=>b.metrics.total-a.metrics.total);
  return{winner:drafts[0],count,runner:drafts[1]?.metrics?.total||0};
 }
 function note(role,i,x){
  if(x==='[NO VOCAL]')return'leave this open; let the beat carry it';
  if(/Hook/.test(role))return i?'keep the support simple; make the anchor easier to remember':'sing the anchor clean; stress the clearest image and leave air after it';
  if(/Verse/.test(role))return i?'one complete thought per pocket; small breath after it':'start conversational and restrained';
  if(/Pre/.test(role))return'fewer words; lift the melody and tension slightly';
  if(/Bridge|Break/.test(role))return'change perspective or delivery; do not just restate the hook';
  return'keep it sparse';
 }
 function currentLines(){return($('song')?.textContent||'').split(/\n/).map(clean).filter(x=>x&&!/^(SMART COMPOSER V5|Topic:|Concept lanes:|Genre family:|Quality tournament:|Quality checks:|Rewrite mode:|VOCAL PRODUCTION|RECORDING ORDER|NOTE|→|\[|\d+\.)/i.test(x)&&x!=='[NO VOCAL]')}
 function saveBad(){const x=currentLines();if(x.length)write(BAD,uniq([...x,...bad()]).slice(0,120))}
 function remember(d,C){const stems=uniq(d.lines.flatMap(x=>toks(x).map(stem))).slice(0,220),h=hist();h.unshift({title:d.title,lines:d.lines.slice(0,60),stems,concepts:C.C.map(c=>c.id),metrics:d.metrics});write(HIST,h.slice(0,10))}
 function render(d,C,mode,count){
  let text=`${d.title.toUpperCase()}\n\nSMART COMPOSER V5\nTopic: ${C.raw.trim()||'open concept'}\nConcept lanes: ${C.C.map(c=>c.id).join(' → ')}\nGenre family: ${genreId()}\nQuality tournament: ${count} internal drafts compared\nQuality checks: topic ${Math.round(d.metrics.topic)} • natural ${Math.round(d.metrics.natural)} • hook ${Math.round(d.metrics.hook)} • flow ${Math.round(d.metrics.flow)} • freshness ${Math.round(d.metrics.freshness)}${mode?`\nRewrite mode: ${mode.replaceAll('_',' ')}`:''}\n`;
  for(const s of d.sections){text+=`\n[${s.role} • ${fmt(s.start)}–${fmt(s.end)}]\n`;for(let i=0;i<s.lines.length;i++)text+=`${s.lines[i]}\n→ ${note(s.role,i,s.lines[i])}\n`}
  text+=`\nVOCAL PRODUCTION\nVerse: close centered lead; keep setup lines mostly dry. Add a quiet double only to the most important ending.\nHook: repeat one anchor clearly; use one support response and widen the final repeat with a double or light harmony.\nDelay/reverb: keep verses drier; throw delay on selected hook endings instead of washing every line.\nAd-libs: answer empty spaces or the final hook repeat, not every sentence.\n\nNOTE\nV5 uses topic-first semantic planning, section arcs, syllable/placement checks, phonetic rhyme as a secondary score, repetition/cliche rejection, feedback memory, and an internal multi-draft tournament. It cannot guarantee a hit; the scores are generator quality checks, not chart predictions.`;
  $('song').textContent=text;$('song').classList.remove('hidden');$('songActions').classList.remove('hidden');$('feedbackWrap').classList.remove('hidden');
  $('genStatus').textContent=mode?`✅ Rebuilt + compared ${count} drafts for ${mode.replaceAll('_',' ')} • ${VERSION_NAME}`:`✅ Best of ${count} internal drafts • ${VERSION_NAME}`;
  $('genStatus').className='status good';setTimeout(()=>$('song').scrollIntoView({behavior:'smooth',block:'start'}),70);
 }
 function generate(mode=null){
  if(!report){$('genStatus').textContent='Analyze the beat first.';return}
  try{const C=topicContext(),{winner,count}=tournament(C,mode);render(winner,C,mode,count);remember(winner,C);window.__mcLastV5={draft:winner,ctx:C}}
  catch(e){console.error('Smart Composer v5 generation',e);$('genStatus').textContent='V5 hit an error. Your beat analysis is still safe; refresh and try again.';$('genStatus').className='status warn'}
 }

 function recordPositive(k){
  const x=window.__mcLastV5;if(!x)return;const L=learn(),d=x.draft;
  if(k==='good_hook'){const a=d.metrics.anchor||'';L.goodHooks=[...(L.goodHooks||[]),{words:words(a).length,syllables:syllables(a),holdable:holdable(last(a))}].slice(-20)}
  if(k==='good_flow'){const v=d.sections.filter(s=>/Verse/.test(s.role)).flatMap(s=>s.lines.filter(x=>x!=='[NO VOCAL]'));L.goodFlows=[...(L.goodFlows||[]),{avgWords:v.length?v.reduce((n,x)=>n+words(x).length,0)/v.length:8,avgSyl:v.length?v.reduce((n,x)=>n+syllables(x),0)/v.length:10}].slice(-20)}
  if(k==='good_lyrics'){L.goodConcepts=L.goodConcepts||{};for(const c of x.ctx.C)L.goodConcepts[c.id]=(L.goodConcepts[c.id]||0)+1}
  write(LEARN,L);
 }
 function addFeedbackButton(key,label){
  const wrap=$('feedbackWrap')?.querySelector('.feedback');if(!wrap||wrap.querySelector(`[data-f="${key}"]`))return;
  const b=document.createElement('button');b.dataset.f=key;b.textContent=label;wrap.appendChild(b);
 }
 addFeedbackButton('too_repetitive','🔁 Too repetitive → rewrite');
 addFeedbackButton('weak_hook','🪝 Weak hook → rewrite');

 for(const b of document.querySelectorAll('[data-f]')){
  const k=b.dataset.f;b.onclick=e=>{
   e?.preventDefault?.();const f=feedback();f[k]=(f[k]||0)+1;write(FB,f);
   if(!NEG.has(k)){recordPositive(k);$('genStatus').textContent='Saved: '+k.replaceAll('_',' ')+' • V5 will lightly reinforce what worked.';return}
   if(k==='weird_lyrics')saveBad();
   if(k==='too_repetitive')saveBad();
   $('genStatus').textContent='Feedback saved • generating fresh candidates for '+k.replaceAll('_',' ')+'…';
   setTimeout(()=>generate(k),50);
  };
 }

 const theme=$('theme');
 if(theme&&!document.getElementById('mcSmartV5Controls')){
  const row=document.createElement('div');row.id='mcSmartV5Controls';row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:7px';
  const random=document.createElement('button');random.type='button';random.className='btn';random.textContent='🎲 Random Topic';
  const status=document.createElement('div');status.className='status';status.style.marginTop='0';
  const update=()=>{const C=topicContext();status.textContent='V5 Topic: '+C.C.map(c=>c.id).join(' • ')+' • High quality mode'};
  random.onclick=()=>{const ids=DEFAULT[$('mood')?.value]||['memory'],c=byId.get(pick(ids,Math.random))||concepts[0],r=Math.random,a=pick(c?.details||[],r),m=pick(c?.angles||[],r),t=pick(extra(c,'turn'),r);theme.value=[a,m,t].filter(Boolean).join('; ');theme.focus();update()};
  theme.addEventListener('input',update);$('mood')?.addEventListener('change',update);row.append(random,status);theme.insertAdjacentElement('afterend',row);update();
  const reset=document.createElement('button');reset.type='button';reset.className='btn';reset.textContent='Reset V5 learned feedback';reset.onclick=()=>{localStorage.removeItem(HIST);localStorage.removeItem(BAD);localStorage.removeItem(LEARN);localStorage.removeItem(FB);$('genStatus').textContent='V5 feedback, rejected lines, and recent-song memory reset.'};row.insertAdjacentElement('afterend',reset);
 }

 const cp=$('copySong');if(cp)cp.onclick=()=>{const t=$('song')?.textContent||'';if(!t)return;const done=()=>{$('genStatus').textContent='Song copied.'},fall=()=>{try{const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();done()}catch(e){$('genStatus').textContent='Could not copy automatically.'}};const p=navigator.clipboard?.writeText?.(t);if(p&&typeof p.then==='function')p.then(done).catch(fall);else fall()};

 const tests=[
  naturalPenalty('I can miss it without','verse',topicContext(),null,new Map())>100,
  syllables('something sounds like you')>=4,
  lineBudget({role:'Hook',start:0,end:16},null)>=3
 ];
 if(!tests.every(Boolean)){console.error('Smart Composer v5 self-test failed',tests);return}
 generateSong=generate;
 window.__mcSmartV5=true;
 const meta=$('packMeta');if(meta&&!document.getElementById('mcSmartV5Badge')){const b=document.createElement('span');b.id='mcSmartV5Badge';b.textContent='Smart Composer v5 • 12-draft quality tournament';meta.appendChild(b)}
}

async function patch(){
 try{
  const frame=document.getElementById('beatFrame'),w=frame?.contentWindow,d=w?.document;
  if(!w||!d?.getElementById('generate')||w.__mcSmartV5)return;
  const {lex,rhyme}=await loadData();
  const s=d.createElement('script');
  s.textContent='('+install.toString()+')('+JSON.stringify(lex)+','+JSON.stringify(rhyme)+');';
  d.body.appendChild(s);s.remove();
 }catch(e){console.error('Smart Composer v5 loader',e)}
}
const f=document.getElementById('beatFrame');
f?.addEventListener('load',()=>{setTimeout(patch,250);setTimeout(patch,900);setTimeout(patch,1800)});
setInterval(patch,1300);setTimeout(patch,450);
})();