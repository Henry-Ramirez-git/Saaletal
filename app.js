/* ======================================================================
   app.js – gemeinsame Konfiguration & Hilfsfunktionen
   Wird von index.html, newsfeed.html, rezensionen.html und admin.html geladen.
   ====================================================================== */

/* >>> FIREBASE VERBINDEN <<<
   Firebase Console → Projekteinstellungen (Zahnrad) → "Meine Apps" → Web-App (</>)
   → "firebaseConfig" → die 4 Werte unten ersetzen.
   Solange hier "DEIN_…" steht, läuft die Seite im Vorschau-Modus mit Beispielinhalten. */
const CFG={apiKey:"DEIN_API_KEY",authDomain:"DEIN_PROJEKT.firebaseapp.com",projectId:"DEIN_PROJEKT",appId:"DEINE_APP_ID"};

/* >>> EMAILJS VERBINDEN <<<
   emailjs.com → Account → Public Key / Email Services → Service ID / Email Templates → Template ID.
   Die Vorlage nutzt die Variablen: name, email, phone, subject, message (siehe emailjs-vorlage.html). */
const EJS={pub:"DEIN_PUBLIC_KEY",svc:"DEIN_SERVICE_ID",tpl:"DEIN_TEMPLATE_ID"};

/* ---------- Hilfsfunktionen ---------- */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const p2=n=>String(n).padStart(2,"0");
const iso=d=>`${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}`;
const fd=(k,o)=>new Date(k+"T00:00").toLocaleDateString("de-DE",o||{weekday:"long",day:"numeric",month:"long",year:"numeric"});
const tel=s=>"tel:+49"+String(s).replace(/\D/g,"").replace(/^0/,"");
const okc=h=>/^#[0-9a-f]{6}$/i.test(h||"")?h:"#7cc430";                       // gültige Farbe oder Standardgrün
const onc=h=>{const n=parseInt(okc(h).slice(1),16);return ((n>>16)*299+(n>>8&255)*587+(n&255)*114)/1000>150?"#16240c":"#fff"}; // Textfarbe passend zur Farbe
const ms=o=>o&&o.createdAt?(o.createdAt.toMillis?o.createdAt.toMillis():+o.createdAt||0):0;
const stars=n=>`<span class="stars" role="img" aria-label="${n} von 5 Sternen">${"★".repeat(n)}<i>${"★".repeat(5-n)}</i></span>`;
/* graues Standard-Profilbild (Silhouette) für Mitarbeiter ohne Foto */
const AVATAR="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#e3e5e8"/><circle cx="200" cy="158" r="70" fill="#a8adb3"/><path d="M52 400c0-96 66-158 148-158s148 62 148 158z" fill="#a8adb3"/></svg>');

/* ---------- Firebase ---------- */
const OK=!CFG.projectId.startsWith("DEIN");
const DB=OK?(firebase.initializeApp(CFG),firebase.firestore()):null;
const AUTH=OK&&firebase.auth?firebase.auth():null;
/* Sammlungen: services, team, partners, events, news, reviews, hero, gallery  |  Dokumente in "settings": welcome, contact, bg, site */
const load=async(c,o={})=>{if(!DB)return[];let q=DB.collection(c);if(o.by)q=q.orderBy(o.by,o.dir||"asc");if(o.n)q=q.limit(o.n);return(await q.get()).docs.map(d=>({id:d.id,...d.data()}))};
const getDoc=async(c,id)=>DB?((await DB.collection(c).doc(id).get()).data()||null):null;
const save=(c,{id,...d})=>id?DB.collection(c).doc(id).set(d):DB.collection(c).add(d);
const setDoc=(c,id,d)=>DB.collection(c).doc(id).set(d);
const del=(c,id)=>DB.collection(c).doc(id).delete();

/* ---------- Standardinhalte (werden gezeigt, solange das CMS leer ist) ---------- */
const DEF={
 services:[
  ["Häusliche Pflege","nach SGB XI – Leistungen der Pflegekasse","Hilfe bei der täglichen Pflege, damit Sie in Ihrem gewohnten Zuhause bleiben können.","heart"],
  ["Behandlungspflege","nach SGB V","Medizinische Pflege auf ärztliche Verordnung, zum Beispiel Verbandswechsel oder Medikamentengabe.","cross"],
  ["Vorbeugende Maßnahmen","Prophylaktische Maßnahmen","Wir beugen Folgeproblemen vor, damit Sie gesund und sicher bleiben.","shield"],
  ["Hauswirtschaft","Hauswirtschaftliche Versorgung","Wir unterstützen bei Wäsche, Reinigung und Mahlzeiten im Haushalt.","home"],
  ["Einkauf","Besorgungen für den Alltag","Wir erledigen Ihre Einkäufe und Besorgungen zuverlässig für Sie.","cart"],
  ["Verhinderungspflege","Urlaubsvertretung","Wir springen ein, wenn pflegende Angehörige eine Auszeit brauchen.","calendar"],
  ["Beratungseinsatz","nach § 37 Abs. 3 SGB XI","Wir beraten Sie und Ihre Angehörigen zu Ihrer Pflegesituation.","chat"],
  ["Betreuung & Entlastung","nach § 45 SGB XI","Betreuungs- und Entlastungsleistungen für mehr Zeit und Ruhe im Alltag.","users"]
 ].map(([title,sub,text,icon],i)=>({title,sub,text,icon,order:i+1})),
 team:[["Pflegedienstleitung"],["Stellv. Pflegedienstleitung"],["Altenpfleger/in"],["Altenpfleger/in"],["Krankenpfleger/in"],["Krankenpfleger/in"],["Pflegefachkraft"],["Pflegefachkraft"],["Pflegeassistent/in"],["Pflegeassistent/in"],["Hauswirtschaft"],["Betreuungskraft"],["Sekretariat"],["Verwaltung"]]
  .map(([role],i)=>({name:"Mitarbeiter "+(i+1),role,email:`mitarbeiter${i+1}@beispiel.de`,photo:"",order:i+1})),
 partners:[
  ["bpa","https://www.bpa.de","Bundesverband privater Anbieter sozialer Dienste"],
  ["Partner 2","","Platzhalter"],["Partner 3","","Platzhalter"],["Partner 4","","Platzhalter"]
 ].map(([name,url,text],i)=>({name,url,text,logo:"",order:i+1})),
 welcome:{
  heroTitle:"Willkommen beim Pflegeteam Saaletal",
  heroSub:"Ambulante Pflege in Bad Neustadt – familiär, menschlich, bei Ihnen daheim.",
  title:"Zuhause bleiben. Gut versorgt sein.",
  lead:"Pflegebedürftig zu werden heißt nicht, vertraute Strukturen aufzugeben. Das muss nicht sein!",
  points:"Familiengeführter ambulanter Pflegedienst\nHilfe genau dort, wo sie gebraucht wird: bei Ihnen daheim\nErfahrene, geschulte Mitarbeiter der Kranken- und Altenpflege mit Zusatzausbildungen\nMenschlichkeit, Respekt und Aufmerksamkeit als starke Vertrauensbasis\nWir kümmern uns rund um die Uhr um das Wohlbefinden unserer Patienten\nIhr Ziel ist unser Ziel: ein selbstbestimmtes Leben in den eigenen vier Wänden",
  closing:"Das Team des Pflegedienstes Saaletal wünscht Ihnen einen angenehmen Tag!"
 },
 contact:{notruf:"0151-65 48 90 18",mobil:"0151-65 48 90 18",festnetz:"09771-68 77 46 6",fax:"09771-68 77 47 7",email:"kontakt@familienpflege-pyritz.de",street:"Berliner Straße 17",city:"97616 Bad Neustadt"},
 site:{showReviews:true}
};
const SEEDABLE=["services","team","partners"];

/* Beispielinhalte NUR im Vorschau-Modus (Firebase nicht verbunden) */
const plus=n=>{const d=new Date();d.setDate(d.getDate()+n);return iso(d)};
const DEMO={
 events:[
  {id:"d1",date:plus(2),time:"10:00",title:"Pflegestammtisch",text:"Austausch bei Kaffee und Kuchen für pflegende Angehörige.\nOhne Anmeldung.",image:"",color:"#7cc430"},
  {id:"d2",date:plus(5),time:"14:30",title:"Infonachmittag Pflegegrade",text:"Wir erklären, wie Pflegegrade beantragt werden.",image:"",color:"#4f9bd9"},
  {id:"d3",date:plus(5),time:"17:00",title:"Sprechstunde",text:"Persönliche Beratung im Büro.",image:"",color:"#e8a31b"},
  {id:"d4",date:plus(12),time:"",title:"Tag der offenen Tür",text:"Lernen Sie unser Team kennen.",image:"",color:"#8a5bc8"}
 ],
 news:[
  {id:"n1",date:plus(-1),title:"Beispiel: Neues Teammitglied",text:"Wir begrüßen Verstärkung in unserem Pflegeteam. (Beispieltext – im Admin-Bereich ersetzen.)",image:""},
  {id:"n2",date:plus(-6),title:"Beispiel: Sommerfest",text:"Danke an alle, die mitgefeiert haben! (Beispieltext)",image:""},
  {id:"n3",date:plus(-14),title:"Beispiel: Neue Öffnungszeiten",text:"Unser Büro ist ab sofort erweitert erreichbar. (Beispieltext)",image:""}
 ],
 reviews:[
  {id:"r1",name:"Familie M.",stars:5,text:"Sehr freundliches Team, wir fühlen uns bestens betreut.",createdAt:3},
  {id:"r2",name:"Helga K.",stars:5,text:"Immer pünktlich und herzlich.",createdAt:2},
  {id:"r3",name:"Thomas R.",stars:4,text:"Gute Beratung und schnelle Hilfe für meine Mutter.",createdAt:1}
 ]
};
const clone=o=>JSON.parse(JSON.stringify(o));
/* Liste laden: Firebase → sonst Standardinhalt/Vorschau */
async function col(c,o){
 if(!DB)return clone(DEMO[c]||DEF[c]||[]);
 try{const l=await load(c,o);return l.length?l:(SEEDABLE.includes(c)?clone(DEF[c]):[])}
 catch(e){console.warn("Firebase:",c,e);return SEEDABLE.includes(c)?clone(DEF[c]):[]}
}
/* Einzel-Dokument laden (Sammlung "settings") */
async function doc(id){
 let d={};try{d=DB?await getDoc("settings",id)||{}:{}}catch(e){console.warn("Firebase:",id,e)}
 return{...(DEF[id]||{}),...d};
}
const byO=(a,b)=>(a.order??99)-(b.order??99);

/* ---------- Kontaktdaten & Hintergrundbild auf allen Seiten ---------- */
function applyContact(c){
 $$("[data-ct]").forEach(a=>{const k=a.dataset.ct,v=c[k];if(!v)return;a.textContent=v;a.href=k==="email"?"mailto:"+v:tel(v)});
 $$("[data-cf]").forEach(s=>{const v=c[s.dataset.cf];if(v)s.textContent=v});
}
async function initCommon(){
 const[c,bg,site]=await Promise.all([doc("contact"),doc("bg"),doc("site")]);
 applyContact(c);
 if(bg.image)document.documentElement.style.setProperty("--bg-img",`url("${bg.image}")`);
 return{contact:c,site};
}

/* ---------- Animationen: Einblenden beim Scrollen ---------- */
const io="IntersectionObserver" in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12,rootMargin:"0px 0px -6% 0px"}):null;
function reveal(root=document){
 root.querySelectorAll(".rv:not(.in)").forEach(el=>{
  if(!io){el.classList.add("in");return}
  if(!el.style.getPropertyValue("--i")&&el.parentElement){const sib=[...el.parentElement.children].filter(x=>x.classList.contains("rv"));el.style.setProperty("--i",sib.indexOf(el)%4)}
  io.observe(el);
 });
}

/* ---------- Kopfzeile: Schatten, Burger-Menü, aktiver Menüpunkt ---------- */
function initNav(){
 const h=$("header"),b=$(".burger"),n=$("nav.mnav");
 const sc=()=>h&&h.classList.toggle("sc",scrollY>8);sc();addEventListener("scroll",sc,{passive:true});
 if(b&&n){
  const set=o=>{n.classList.toggle("open",o);b.setAttribute("aria-expanded",o);b.setAttribute("aria-label",o?"Menü schließen":"Menü öffnen")};
  b.onclick=()=>set(!n.classList.contains("open"));
  n.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
  addEventListener("keydown",e=>{if(e.key==="Escape")set(false)});
  document.addEventListener("click",e=>{if(!e.target.closest("header"))set(false)});
 }
 const links=$$('nav a[href^="#"]');
 if(links.length&&"IntersectionObserver" in window){
  const map=new Map(links.map(a=>[a.getAttribute("href").slice(1),a]));
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.removeAttribute("aria-current"));const a=map.get(e.target.id);a&&a.setAttribute("aria-current","true")}}),{rootMargin:"-45% 0px -50% 0px"});
  map.forEach((a,id)=>{const s=document.getElementById(id);s&&so.observe(s)});
 }
}
