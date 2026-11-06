/* === KONFIGURATION: hier eigene Werte eintragen === */
const CFG={apiKey:"DEIN_API_KEY",authDomain:"DEIN_PROJEKT.firebaseapp.com",projectId:"DEIN_PROJEKT",appId:"DEINE_APP_ID"}; // Firebase
const EJS={pub:"DEIN_PUBLIC_KEY",svc:"DEIN_SERVICE_ID",tpl:"DEIN_TEMPLATE_ID"}; // EmailJS (Vorlage nutzt: name, email, phone, subject, message)
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const DB=CFG.projectId.startsWith("DEIN")?null:(firebase.initializeApp(CFG),firebase.firestore());
const DEF=["Häusliche Pflege nach SGB XI (Leistungen der Pflegekasse)","Behandlungspflege SGB V","Prophylaktische Maßnahmen (vorbeugende Maßnahmen)","Hauswirtschaftliche Versorgung","Einkauf","Verhinderungspflege / Urlaubsvertretung","Beratungseinsätze §37 Abs. 3 SGB XI","Betreuungs- und Entlastungsleistung §45 SGB XI"].map((title,i)=>({title,text:"",order:i+1}));
const load=async c=>DB?(await DB.collection(c).get()).docs.map(d=>({id:d.id,...d.data()})):[];
const save=(c,{id,...d})=>id?DB.collection(c).doc(id).set(d):DB.collection(c).add(d);
const del=(c,id)=>DB.collection(c).doc(id).delete();
