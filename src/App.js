import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ─── ARC ORDER ───
const ARC_ORDER=["Romance Dawn","Orange Town","Syrup Village","Baratie","Arlong Park","Loguetown","Reverse Mountain","Whisky Peak","Little Garden","Drum Island","Alabasta","Jaya","Skypiea","Long Ring Long Land","Water 7","Enies Lobby","Post-Enies Lobby","Thriller Bark","Sabaody Archipelago","Amazon Lily","Impel Down","Marineford","Post-War","Return to Sabaody","Fish-Man Island","Punk Hazard","Dressrosa","Zou","Whole Cake Island","Levely","Wano","Egghead"];
function arcIdx(a){const i=ARC_ORDER.indexOf(a);return i===-1?999:i;}

// ─── i18n ───
const LANG_OPTIONS=[{code:"fr",label:"Français",flag:"🇫🇷"},{code:"en",label:"English",flag:"🇬🇧"},{code:"es",label:"Español",flag:"🇪🇸"}];
const T={
  fr:{title:"Grand Piecedle",subtitle:"personnages • 5 modes • Quotidien",play:"🎮 Jouer",stats:"📊 Stats",classic:"Classique",classicD:"Devine par attributs",devilFruit:"Fruit du Démon",devilFruitD:"Quel possesseur ?",bounty:"Prime",bountyD:"Quelle prime ?",quote:"Citation",quoteD:"Qui a dit ça ?",laugh:"Rire",laughD:"Quel rire ?",placeholder:"Tape le nom d'un personnage...",attempt:"Essai n°",hint:"Indice",hints:"INDICES DÉBLOQUÉS",higher:"plus élevé/tardif",lower:"plus bas/tôt",win:"Victoire !",wasIt:"C'était",inAttempts:"en %n essai%s",share:"📋 Partager",copied:"✅ Copié !",correct:"Correct",close:"Proche",wrong:"Incorrect",origin:"Origine",status:"Statut",alive:"Vivant",dead:"Mort",fruit:"Fruit du Démon",none:"Aucun",footer:"Fan Game 🏴‍☠️ Nouveau défi chaque jour à minuit",dfClue:"FRUIT DU DÉMON",dfQ:"Qui possède ce fruit ?",bountyClue:"PRIME RECHERCHÉE",bountyQ:"Quel pirate possède cette prime ?",quoteClue:"CITATION",quoteQ:"Qui a dit ça ?",laughClue:"RIRE MYSTÈRE",laughQ:"À qui appartient ce rire ?",wantedClue:"AVIS DE RECHERCHE",wantedQ:"Qui se cache derrière cet avis ?",streak:"Streak",record:"Record",victories:"Victoires",statistics:"Statistiques",gender:"Genre",group:"Groupe",fruitType:"Fruit",haki:"Haki",primeH:"Prime",height:"Taille",originH:"Origine",arcH:"Arc",nameH:"Nom",legend:"↑↓ = valeur / arc chronologique",marine:"Marine",revolutionary:"Révolutionnaire",worldGov:"Gouvernement Mondial",civil:"Civil",pseudo:"Ton pseudo",pseudoPlaceholder:"Entre ton pseudo...",save:"Sauvegarder",leaderboard:"🏴‍☠️ TOP 10 ÉQUIPAGE",todayFound:"ont trouvé aujourd'hui",players:"joueurs",noLeaderboard:"Aucun pirate au classement",rank:"Rang",hardcore:"Mode Hardcore",hardcoreDesc:"6 essais max",lost:"Défaite...",lostMsg:"Le personnage était",attemptsLeft:"%n essais restants",history:"Historique",historyTitle:"📅 Historique des 30 derniers jours",soundOn:"Son activé",soundOff:"Son désactivé",won2:"Gagné",lost2:"Perdu",notPlayed:"Non joué",nextChallenge:"Prochain défi dans"},
  en:{title:"Grand Piecedle",subtitle:"characters • 5 modes • Daily",play:"🎮 Play",stats:"📊 Stats",classic:"Classic",classicD:"Guess by attributes",devilFruit:"Devil Fruit",devilFruitD:"Who has it?",bounty:"Bounty",bountyD:"Whose bounty?",quote:"Quote",quoteD:"Who said this?",laugh:"Laugh",laughD:"Whose laugh?",placeholder:"Type a character name...",attempt:"Attempt #",hint:"Hint",hints:"HINTS UNLOCKED",higher:"higher/later",lower:"lower/earlier",win:"Victory!",wasIt:"It was",inAttempts:"in %n attempt%s",share:"📋 Share",copied:"✅ Copied!",correct:"Correct",close:"Close",wrong:"Wrong",origin:"Origin",status:"Status",alive:"Alive",dead:"Dead",fruit:"Devil Fruit",none:"None",footer:"Fan Game 🏴‍☠️ New challenge every day at midnight",dfClue:"DEVIL FRUIT",dfQ:"Who has this fruit?",bountyClue:"WANTED BOUNTY",bountyQ:"Which pirate has this bounty?",quoteClue:"MYSTERY QUOTE",quoteQ:"Who said this?",laughClue:"MYSTERY LAUGH",laughQ:"Whose laugh is this?",wantedClue:"WANTED POSTER",wantedQ:"Who's hiding behind this poster?",streak:"Streak",record:"Record",victories:"Victories",statistics:"Statistics",gender:"Gender",group:"Group",fruitType:"Fruit",haki:"Haki",primeH:"Bounty",height:"Height",originH:"Origin",arcH:"Arc",nameH:"Name",legend:"↑↓ = value / chronological arc",marine:"Marine",revolutionary:"Revolutionary",worldGov:"World Government",civil:"Civilian",hardcore:"Hardcore Mode",hardcoreDesc:"6 attempts max",lost:"Defeat...",lostMsg:"The character was",attemptsLeft:"%n attempts left",history:"History",historyTitle:"📅 Last 30 days history",soundOn:"Sound on",soundOff:"Sound off",won2:"Won",lost2:"Lost",notPlayed:"Not played",nextChallenge:"Next challenge in"},
  es:{title:"Grand Piecedle",subtitle:"personajes • 5 modos • Diario",play:"🎮 Jugar",stats:"📊 Stats",classic:"Clásico",classicD:"Adivina por atributos",devilFruit:"Fruta del Diablo",devilFruitD:"¿Quién la tiene?",bounty:"Recompensa",bountyD:"¿De quién?",quote:"Cita",quoteD:"¿Quién lo dijo?",laugh:"Risa",laughD:"¿De quién?",placeholder:"Escribe el nombre...",attempt:"Intento #",hint:"Pista",hints:"PISTAS",higher:"más alto/tardío",lower:"más bajo/temprano",win:"¡Victoria!",wasIt:"Era",inAttempts:"en %n intento%s",share:"📋 Compartir",copied:"✅ ¡Copiado!",correct:"Correcto",close:"Cerca",wrong:"Incorrecto",origin:"Origen",status:"Estado",alive:"Vivo",dead:"Muerto",fruit:"Fruta del Diablo",none:"Ninguna",footer:"Fan Game 🏴‍☠️ Nuevo desafío cada día a medianoche",dfClue:"FRUTA DEL DIABLO",dfQ:"¿Quién posee esta fruta?",bountyClue:"RECOMPENSA",bountyQ:"¿Qué pirata tiene esta recompensa?",quoteClue:"CITA MISTERIOSA",quoteQ:"¿Quién dijo esto?",laughClue:"RISA MISTERIOSA",laughQ:"¿De quién es esta risa?",wantedClue:"CARTEL DE BÚSQUEDA",wantedQ:"¿Quién se esconde detrás?",streak:"Racha",record:"Récord",victories:"Victorias",statistics:"Estadísticas",gender:"Género",group:"Grupo",fruitType:"Fruta",haki:"Haki",primeH:"Recompensa",height:"Altura",originH:"Origen",arcH:"Arco",nameH:"Nombre",legend:"↑↓ = valor / arco cronológico",marine:"Marina",revolutionary:"Revolucionario",worldGov:"Gobierno Mundial",civil:"Civil",hardcore:"Modo Hardcore",hardcoreDesc:"6 intentos máx",lost:"Derrota...",lostMsg:"El personaje era",attemptsLeft:"%n intentos restantes",history:"Historial",historyTitle:"📅 Historial de los últimos 30 días",soundOn:"Sonido activado",soundOff:"Sonido desactivado",won2:"Ganado",lost2:"Perdido",notPlayed:"No jugado",nextChallenge:"Próximo desafío en"},
};

// ─── CHARACTER DATABASE ───
// img field: place character portraits in public/img/ folder as "id.png" (e.g. 1.png for Luffy)
// The game will look for /img/{id}.png — add your own images there!
const CHARACTERS=[
  {id:1,name:{fr:"Monkey D. Luffy",en:"Monkey D. Luffy",es:"Monkey D. Luffy"},gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:{fr:"Gomu Gomu no Mi",en:"Gomu Gomu no Mi",es:"Gomu Gomu no Mi"},dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:3000000000,height:174,origin:{fr:"East Blue",en:"East Blue",es:"East Blue"},arc:"Romance Dawn",status:"Alive",laugh:"Shishishi",quote:{fr:"Je vais devenir le Roi des Pirates !",en:"I'm gonna be King of the Pirates!",es:"¡Voy a ser el Rey de los Piratas!"}},
  {id:2,name:{fr:"Roronoa Zoro",en:"Roronoa Zoro",es:"Roronoa Zoro"},gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:{fr:"None",en:"None",es:"None"},dfType:"None",haki:["Obs","Arm","Conq"],bounty:1111000000,height:181,origin:{fr:"East Blue",en:"East Blue",es:"East Blue"},arc:"Romance Dawn",status:"Alive",laugh:"",quote:{fr:"Rien ne s'est passé.",en:"Nothing happened.",es:"No pasó nada."}},
  {id:3,name:{fr:"Nami",en:"Nami",es:"Nami"},gender:"F",affiliation:"Pirate",crew:"Straw Hat Pirates",df:{fr:"None",en:"None",es:"None"},dfType:"None",haki:["Obs"],bounty:366000000,height:170,origin:{fr:"East Blue",en:"East Blue",es:"East Blue"},arc:"Orange Town",status:"Alive",laugh:"",quote:{fr:"L'argent, c'est la vie !",en:"Money makes the world go round!",es:"¡El dinero es la vida!"}},
  {id:4,name:{fr:"Usopp",en:"Usopp",es:"Usopp"},gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:{fr:"None",en:"None",es:"None"},dfType:"None",haki:["Obs"],bounty:500000000,height:176,origin:{fr:"East Blue",en:"East Blue",es:"East Blue"},arc:"Syrup Village",status:"Alive",laugh:"",quote:{fr:"J'ai 8000 hommes sous mes ordres !",en:"I have 8000 men under my command!",es:"¡Tengo 8000 hombres bajo mi mando!"}},
  {id:5,name:{fr:"Sanji",en:"Sanji",es:"Sanji"},gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:{fr:"None",en:"None",es:"None"},dfType:"None",haki:["Obs","Arm"],bounty:1032000000,height:180,origin:{fr:"North Blue",en:"North Blue",es:"North Blue"},arc:"Baratie",status:"Alive",laugh:"",quote:{fr:"Un cuisinier ne gaspille jamais la nourriture.",en:"A cook never wastes food.",es:"Un cocinero nunca desperdicia comida."}},
  {id:6,name:{fr:"Tony Tony Chopper",en:"Tony Tony Chopper",es:"Tony Tony Chopper"},gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:{fr:"Hito Hito no Mi",en:"Hito Hito no Mi",es:"Hito Hito no Mi"},dfType:"Zoan",haki:[],bounty:1000,height:90,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Drum Island",status:"Alive",laugh:"",quote:{fr:"Tes compliments ne me font pas plaisir, idiot !",en:"Your compliments don't make me happy, jerk!",es:"¡Tus halagos no me hacen feliz, idiota!"}},
  {id:7,name:{fr:"Nico Robin",en:"Nico Robin",es:"Nico Robin"},gender:"F",affiliation:"Pirate",crew:"Straw Hat Pirates",df:{fr:"Hana Hana no Mi",en:"Hana Hana no Mi",es:"Hana Hana no Mi"},dfType:"Paramecia",haki:["Obs","Arm"],bounty:930000000,height:188,origin:{fr:"West Blue",en:"West Blue",es:"West Blue"},arc:"Whisky Peak",status:"Alive",laugh:"",quote:{fr:"Je veux vivre !",en:"I want to live!",es:"¡Quiero vivir!"}},
  {id:8,name:{fr:"Franky",en:"Franky",es:"Franky"},gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:{fr:"None",en:"None",es:"None"},dfType:"None",haki:["Arm"],bounty:394000000,height:240,origin:{fr:"South Blue",en:"South Blue",es:"South Blue"},arc:"Water 7",status:"Alive",laugh:"",quote:{fr:"SUUUUPER !",en:"SUUUUPER!",es:"¡SUUUUPER!"}},
  {id:9,name:{fr:"Brook",en:"Brook",es:"Brook"},gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:{fr:"Yomi Yomi no Mi",en:"Yomi Yomi no Mi",es:"Yomi Yomi no Mi"},dfType:"Paramecia",haki:[],bounty:383000000,height:277,origin:{fr:"West Blue",en:"West Blue",es:"West Blue"},arc:"Thriller Bark",status:"Alive",laugh:"Yohohoho",quote:{fr:"Puis-je voir votre culotte ?",en:"May I see your panties?",es:"¿Puedo ver sus bragas?"}},
  {id:10,name:{fr:"Jinbe",en:"Jinbe",es:"Jinbe"},gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:{fr:"None",en:"None",es:"None"},dfType:"None",haki:["Obs","Arm"],bounty:1100000000,height:301,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Impel Down",status:"Alive",laugh:"",quote:{fr:"Ne perds pas confiance en toi !",en:"Don't lose faith in yourself!",es:"¡No pierdas la confianza!"}},
  {id:11,name:{fr:"Shanks",en:"Shanks",es:"Shanks"},gender:"M",affiliation:"Pirate",crew:"Red Hair Pirates",df:{fr:"None",en:"None",es:"None"},dfType:"None",haki:["Obs","Arm","Conq"],bounty:4048900000,height:199,origin:{fr:"West Blue",en:"West Blue",es:"West Blue"},arc:"Romance Dawn",status:"Alive",laugh:"Dahaha",quote:{fr:"Je parie sur la nouvelle génération.",en:"I bet on the new generation.",es:"Apuesto por la nueva generación."}},
  {id:12,name:{fr:"Portgas D. Ace",en:"Portgas D. Ace",es:"Portgas D. Ace"},gender:"M",affiliation:"Pirate",crew:"Whitebeard Pirates",df:{fr:"Mera Mera no Mi",en:"Mera Mera no Mi",es:"Mera Mera no Mi"},dfType:"Logia",haki:["Obs","Arm","Conq"],bounty:550000000,height:185,origin:{fr:"South Blue",en:"South Blue",es:"South Blue"},arc:"Drum Island",status:"Dead",laugh:"",quote:{fr:"Merci de m'avoir aimé.",en:"Thank you for loving me.",es:"Gracias por haberme querido."}},
  {id:13,name:{fr:"Trafalgar Law",en:"Trafalgar Law",es:"Trafalgar Law"},gender:"M",affiliation:"Pirate",crew:"Heart Pirates",df:{fr:"Ope Ope no Mi",en:"Ope Ope no Mi",es:"Ope Ope no Mi"},dfType:"Paramecia",haki:["Obs","Arm"],bounty:3000000000,height:191,origin:{fr:"North Blue",en:"North Blue",es:"North Blue"},arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:{fr:"ROOM !",en:"ROOM!",es:"¡ROOM!"}},
  {id:14,name:{fr:"Boa Hancock",en:"Boa Hancock",es:"Boa Hancock"},gender:"F",affiliation:"Pirate",crew:"Kuja Pirates",df:{fr:"Mero Mero no Mi",en:"Mero Mero no Mi",es:"Mero Mero no Mi"},dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:1659000000,height:191,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Amazon Lily",status:"Alive",laugh:"",quote:{fr:"On me pardonne car je suis belle.",en:"I am forgiven because I am beautiful.",es:"Me perdonan porque soy hermosa."}},
  {id:15,name:{fr:"Crocodile",en:"Crocodile",es:"Crocodile"},gender:"M",affiliation:"Pirate",crew:"Cross Guild",df:{fr:"Suna Suna no Mi",en:"Suna Suna no Mi",es:"Suna Suna no Mi"},dfType:"Logia",haki:[],bounty:1965000000,height:253,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Whisky Peak",status:"Alive",laugh:"Kuhahaha",quote:{fr:"Les faibles ne choisissent pas leur mort.",en:"The weak can't choose how they die.",es:"Los débiles no eligen su muerte."}},
  {id:16,name:{fr:"Doflamingo",en:"Doflamingo",es:"Doflamingo"},gender:"M",affiliation:"Pirate",crew:"Donquixote Pirates",df:{fr:"Ito Ito no Mi",en:"Ito Ito no Mi",es:"Ito Ito no Mi"},dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:340000000,height:305,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Jaya",status:"Alive",laugh:"Fuffuffuffu",quote:{fr:"Les pirates sont mauvais ? La Marine est juste ?",en:"Pirates are evil? Marines are just?",es:"¿Los piratas son malvados? ¿La Marina es justa?"}},
  {id:17,name:{fr:"Barbe Blanche",en:"Whitebeard",es:"Barbablanca"},gender:"M",affiliation:"Pirate",crew:"Whitebeard Pirates",df:{fr:"Gura Gura no Mi",en:"Gura Gura no Mi",es:"Gura Gura no Mi"},dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:5046000000,height:666,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Drum Island",status:"Dead",laugh:"Gurararara",quote:{fr:"One Piece existe !",en:"One Piece is real!",es:"¡One Piece existe!"}},
  {id:18,name:{fr:"Barbe Noire",en:"Blackbeard",es:"Barbanegra"},gender:"M",affiliation:"Pirate",crew:"Blackbeard Pirates",df:{fr:"Yami Yami no Mi",en:"Yami Yami no Mi",es:"Yami Yami no Mi"},dfType:"Logia",haki:["Obs","Arm","Conq"],bounty:3996000000,height:344,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Jaya",status:"Alive",laugh:"Zehahaha",quote:{fr:"Les rêves des gens ne s'arrêtent jamais !",en:"People's dreams never end!",es:"¡Los sueños nunca terminan!"}},
  {id:19,name:{fr:"Kaido",en:"Kaido",es:"Kaido"},gender:"M",affiliation:"Pirate",crew:"Beasts Pirates",df:{fr:"Uo Uo no Mi Model: Seiryu",en:"Uo Uo no Mi Model: Seiryu",es:"Uo Uo no Mi Model: Seiryu"},dfType:"Mythical Zoan",haki:["Obs","Arm","Conq"],bounty:4611100000,height:710,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Punk Hazard",status:"Alive",laugh:"Worororo",quote:{fr:"En un contre un, pariez sur Kaido.",en:"In a one-on-one, bet on Kaido.",es:"En un uno contra uno, apuesten por Kaido."}},
  {id:20,name:{fr:"Big Mom",en:"Big Mom",es:"Big Mom"},gender:"F",affiliation:"Pirate",crew:"Big Mom Pirates",df:{fr:"Soru Soru no Mi",en:"Soru Soru no Mi",es:"Soru Soru no Mi"},dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:4388000000,height:880,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Thriller Bark",status:"Alive",laugh:"Mamamama",quote:{fr:"Vie ou Mort ?!",en:"Life or Death?!",es:"¿Vida o Muerte?!"}},
  {id:21,name:{fr:"Buggy",en:"Buggy",es:"Buggy"},gender:"M",affiliation:"Pirate",crew:"Cross Guild",df:{fr:"Bara Bara no Mi",en:"Bara Bara no Mi",es:"Bara Bara no Mi"},dfType:"Paramecia",haki:[],bounty:3189000000,height:192,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Orange Town",status:"Alive",laugh:"Gyahahaha",quote:{fr:"Mon nez n'est PAS rouge !",en:"My nose is NOT red!",es:"¡Mi nariz NO es roja!"}},
  {id:22,name:{fr:"Mihawk",en:"Mihawk",es:"Mihawk"},gender:"M",affiliation:"Pirate",crew:"Cross Guild",df:{fr:"None",en:"None",es:"None"},dfType:"None",haki:["Obs","Arm","Conq"],bounty:3590000000,height:198,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Baratie",status:"Alive",laugh:"",quote:{fr:"Tu es faible.",en:"You are weak.",es:"Eres débil."}},
  {id:23,name:{fr:"Sabo",en:"Sabo",es:"Sabo"},gender:"M",affiliation:"Revolutionary",crew:"Revolutionary Army",df:{fr:"Mera Mera no Mi",en:"Mera Mera no Mi",es:"Mera Mera no Mi"},dfType:"Logia",haki:["Obs","Arm"],bounty:602000000,height:187,origin:{fr:"East Blue",en:"East Blue",es:"East Blue"},arc:"Post-War",status:"Alive",laugh:"",quote:{fr:"",en:"",es:""}},
  {id:24,name:{fr:"Akainu",en:"Akainu",es:"Akainu"},gender:"M",affiliation:"Marine",crew:"Marines",df:{fr:"Magu Magu no Mi",en:"Magu Magu no Mi",es:"Magu Magu no Mi"},dfType:"Logia",haki:["Obs","Arm"],bounty:0,height:306,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Marineford",status:"Alive",laugh:"",quote:{fr:"Justice absolue.",en:"Absolute justice.",es:"Justicia absoluta."}},
  {id:25,name:{fr:"Garp",en:"Garp",es:"Garp"},gender:"M",affiliation:"Marine",crew:"Marines",df:{fr:"None",en:"None",es:"None"},dfType:"None",haki:["Obs","Arm","Conq"],bounty:0,height:287,origin:{fr:"East Blue",en:"East Blue",es:"East Blue"},arc:"Water 7",status:"Alive",laugh:"Bwahahaha",quote:{fr:"Un poing d'amour !",en:"A fist of love!",es:"¡Un puño de amor!"}},
  {id:26,name:{fr:"Gol D. Roger",en:"Gol D. Roger",es:"Gol D. Roger"},gender:"M",affiliation:"Pirate",crew:"Roger Pirates",df:{fr:"None",en:"None",es:"None"},dfType:"None",haki:["Obs","Arm","Conq"],bounty:5564800000,height:274,origin:{fr:"East Blue",en:"East Blue",es:"East Blue"},arc:"Romance Dawn",status:"Dead",laugh:"",quote:{fr:"Mon trésor ? Quelque part sur Grand Line.",en:"My treasure? Somewhere on the Grand Line.",es:"¿Mi tesoro? En algún lugar del Grand Line."}},
  {id:27,name:{fr:"Eustass Kid",en:"Eustass Kid",es:"Eustass Kid"},gender:"M",affiliation:"Pirate",crew:"Kid Pirates",df:{fr:"Jiki Jiki no Mi",en:"Jiki Jiki no Mi",es:"Jiki Jiki no Mi"},dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:3000000000,height:205,origin:{fr:"South Blue",en:"South Blue",es:"South Blue"},arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:{fr:"",en:"",es:""}},
  {id:28,name:{fr:"Katakuri",en:"Katakuri",es:"Katakuri"},gender:"M",affiliation:"Pirate",crew:"Big Mom Pirates",df:{fr:"Mochi Mochi no Mi",en:"Mochi Mochi no Mi",es:"Mochi Mochi no Mi"},dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:1057000000,height:509,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Whole Cake Island",status:"Alive",laugh:"",quote:{fr:"",en:"",es:""}},
  {id:29,name:{fr:"Yamato",en:"Yamato",es:"Yamato"},gender:"F",affiliation:"Pirate",crew:"None",df:{fr:"Inu Inu no Mi Model: Okuchi no Makami",en:"Inu Inu no Mi Model: Okuchi no Makami",es:"Inu Inu no Mi Model: Okuchi no Makami"},dfType:"Mythical Zoan",haki:["Obs","Arm","Conq"],bounty:0,height:263,origin:{fr:"Grand Line",en:"Grand Line",es:"Grand Line"},arc:"Wano",status:"Alive",laugh:"",quote:{fr:"Je suis Oden !",en:"I am Oden!",es:"¡Soy Oden!"}},
  {id:30,name:{fr:"Enel",en:"Enel",es:"Enel"},gender:"M",affiliation:"Other",crew:"None",df:{fr:"Goro Goro no Mi",en:"Goro Goro no Mi",es:"Goro Goro no Mi"},dfType:"Logia",haki:["Obs"],bounty:0,height:266,origin:{fr:"Sky Island",en:"Sky Island",es:"Isla del Cielo"},arc:"Skypiea",status:"Alive",laugh:"Yahaha",quote:{fr:"Je suis Dieu.",en:"I am God.",es:"Soy Dios."}},
];

// ─── HELPERS ───
const CHARS=CHARACTERS;
const getL=(obj,lang)=>typeof obj==="object"&&obj!==null?(obj[lang]||obj.fr||obj.en||""):obj;

function getDaySeed(){const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();}
function sRand(seed){let s=seed|0;if(s===0)s=1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%1000000)/1000000;};}
function pickDaily(mode){
  const seed=getDaySeed()*1000+mode.charCodeAt(0)*137+mode.length*31;
  const r=sRand(seed);for(let i=0;i<10;i++)r();
  let pool=CHARS;
  if(mode==="devilFruit")pool=CHARS.filter(c=>getL(c.df,"en")!=="None"&&getL(c.df,"en")!=="Unknown");
  if(mode==="quote")pool=CHARS.filter(c=>{const q=getL(c.quote,"fr");return q&&q.length>0;});
  if(mode==="laugh")pool=CHARS.filter(c=>c.laugh&&c.laugh.length>0);
  return pool[Math.floor(r()*pool.length)];
}

// ─── CREW COLORS ───
const CC={"Straw Hat Pirates":"#e74c3c","Whitebeard Pirates":"#ecf0f1","Heart Pirates":"#f1c40f","Kuja Pirates":"#e91e63","Cross Guild":"#9b59b6","Donquixote Pirates":"#e84393","Kid Pirates":"#d63031","Beasts Pirates":"#6c5ce7","Big Mom Pirates":"#fd79a8","Blackbeard Pirates":"#2d3436","Red Hair Pirates":"#c0392b","Roger Pirates":"#f39c12","Revolutionary Army":"#00b894","Marines":"#0984e3","CP0":"#636e72","None":"#dfe6e9"};
function gc(crew){return CC[crew]||"#b2bec3";}
function gi(name){const p=name.replace(/[^a-zA-ZÀ-ÿ ]/g,"").split(" ").filter(Boolean);return p.length>=2?(p[0][0]+p[p.length-1][0]).toUpperCase():name.slice(0,2).toUpperCase();}
// Character image: looks for /img/{id}.png — fallback to initials avatar
function charImg(id){return `${process.env.PUBLIC_URL}/img/${id}.png`;}

// ─── COMPARE ───
function compare(g,a,lang){
  const cols=[];
  const eq=(x,y)=>String(x).toLowerCase()===String(y).toLowerCase();
  const nSt=(x,y)=>x===y?"correct":Math.abs(x-y)/Math.max(x,y,1)<.15?"close":"wrong";
  const aCmp=(x,y)=>{if(!x.length&&!y.length)return"correct";if(JSON.stringify([...x].sort())===JSON.stringify([...y].sort()))return"correct";if(x.some(v=>y.includes(v)))return"close";return"wrong";};
  const arcSt=(x,y)=>{if(x===y)return"correct";return Math.abs(arcIdx(x)-arcIdx(y))<=2?"close":"wrong";};
  const t=T[lang]||T.fr;
  const fac=c=>{if(c.crew&&c.crew!=="None")return c.crew;if(c.affiliation==="Marine")return t.marine;if(c.affiliation==="Revolutionary")return t.revolutionary;if(c.affiliation==="World Gov.")return t.worldGov;return t.civil;};
  cols.push({l:t.gender,v:g.gender,s:eq(g.gender,a.gender)?"correct":"wrong"});
  cols.push({l:t.group,v:fac(g),s:eq(fac(g),fac(a))?"correct":"wrong"});
  cols.push({l:t.fruitType,v:g.dfType==="None"?t.none:g.dfType,s:eq(g.dfType,a.dfType)?"correct":"wrong"});
  cols.push({l:t.haki,v:g.haki.length?g.haki.join(", "):t.none,s:aCmp(g.haki,a.haki)});
  cols.push({l:t.primeH,v:g.bounty===0?"—":(g.bounty>=1e9?(g.bounty/1e9).toFixed(1)+"B":g.bounty>=1e6?(g.bounty/1e6).toFixed(0)+"M":g.bounty.toLocaleString()),s:nSt(g.bounty,a.bounty),ar:g.bounty<a.bounty?"↑":g.bounty>a.bounty?"↓":""});
  cols.push({l:t.height,v:g.height+"cm",s:nSt(g.height,a.height),ar:g.height<a.height?"↑":g.height>a.height?"↓":""});
  cols.push({l:t.originH,v:getL(g.origin,lang),s:eq(getL(g.origin,lang),getL(a.origin,lang))?"correct":"wrong"});
  const gA=arcIdx(g.arc),aA=arcIdx(a.arc);
  cols.push({l:t.arcH,v:g.arc,s:arcSt(g.arc,a.arc),ar:gA<aA?"↑":gA>aA?"↓":""});
  return cols;
}

// ─── FONT ───
const FONT="https://fonts.googleapis.com/css2?family=Pirata+One&family=DM+Sans:wght@300;400;500;600;700&display=swap";
const MODES_K=["classic","devilFruit","bounty","quote","laugh"];

// ─── AVATAR COMPONENT ───
function Avatar({char,size=36}){
  const[err,setErr]=useState(false);
  const name=typeof char.name==="object"?char.name.fr:char.name;
  if(err)return <div className="avatar" style={{width:size,height:size,background:gc(char.crew),fontSize:size*.33}}>{gi(name)}</div>;
  return <img src={charImg(char.id)} alt={name} onError={()=>setErr(true)} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(255,255,255,.15)"}} />;
}

// ─── APP ───
export default function App(){
  const[lang,setLang]=useState(()=>{try{return localStorage.getItem("gp_lang")||"fr";}catch{return"fr";}});
  const t=T[lang]||T.fr;
  const[mode,setMode]=useState("classic");
  const[guesses,setGuesses]=useState([]);
  const[input,setInput]=useState("");
  const[won,setWon]=useState(false);
  const[showSug,setShowSug]=useState(false);
  const[hintLvl,setHintLvl]=useState(0);
  const[streaks,setStreaks]=useState(()=>{try{return JSON.parse(localStorage.getItem("gp_streaks"))||{};}catch{return{};}});
  const[totalWins,setTotalWins]=useState(()=>{try{return JSON.parse(localStorage.getItem("gp_wins_all"))||{};}catch{return{};}});
  const[bestStreaks,setBestStreaks]=useState(()=>{try{return JSON.parse(localStorage.getItem("gp_bests"))||{};}catch{return{};}});
  // Convenience accessors for current mode
  const streak=streaks[mode]||0;
  const bestStreak=bestStreaks[mode]||0;
  const modeWins=totalWins[mode]||0;
  const[tab,setTab]=useState("game");
  const[copied,setCopied]=useState(false);
  const[hardcore,setHardcore]=useState(()=>{try{return JSON.parse(localStorage.getItem("gp_hc"))||false;}catch{return false;}});
  const[lost,setLost]=useState(false);
  const[soundOn,setSoundOn]=useState(()=>{try{const v=localStorage.getItem("gp_sound");return v===null?true:JSON.parse(v);}catch{return true;}});
  const[showConfetti,setShowConfetti]=useState(false);
  const[countdown,setCountdown]=useState("");
  const MAX_ATTEMPTS=6;
  const[pseudo,setPseudo]=useState(()=>{try{return localStorage.getItem("gp_pseudo")||"";}catch{return"";}});
  const[pseudoInput,setPseudoInput]=useState("");
  const[dailyWins,setDailyWins]=useState({});
  const inputRef=useRef(null);

  // ─── FIREBASE CONFIG ───
  // Replace this URL with YOUR Firebase Realtime Database URL
  const FB_URL="https://grandpiecedle-default-rtdb.europe-west1.firebasedatabase.app";

  // Leaderboard: shared via Firebase
  const[leaderboard,setLeaderboard]=useState([]);

  // Fetch leaderboard from Firebase on mount
  useEffect(()=>{
    fetch(`${FB_URL}/leaderboard.json`)
      .then(r=>r.json())
      .then(data=>{
        if(data){
          const arr=Object.values(data);
          arr.sort((a,b)=>b.streak-a.streak);
          setLeaderboard(arr.slice(0,10));
        }
      }).catch(()=>{});
  },[]);

  // Fetch daily winners count from Firebase on mount + mode change
  useEffect(()=>{
    const day=getDaySeed();
    fetch(`${FB_URL}/daily/${day}.json`)
      .then(r=>r.json())
      .then(data=>{if(data)setDailyWins(data);})
      .catch(()=>{});
  },[mode]);

  // Update leaderboard on Firebase when bestStreaks change
  const overallBest=useMemo(()=>Math.max(0,...Object.values(bestStreaks)),[bestStreaks]);
  useEffect(()=>{
    if(pseudo&&overallBest>0){
      fetch(`${FB_URL}/leaderboard/${pseudo}.json`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({pseudo,streak:overallBest})
      }).then(()=>fetch(`${FB_URL}/leaderboard.json`))
      .then(r=>r.json()).then(data=>{
        if(data){
          const arr=Object.values(data);
          arr.sort((a,b)=>b.streak-a.streak);
          setLeaderboard(arr.slice(0,10));
        }
      }).catch(()=>{});
    }
  },[overallBest,pseudo,FB_URL]);

  // Save pseudo
  const savePseudo=()=>{
    const p=pseudoInput.trim().slice(0,16);
    if(p){setPseudo(p);try{localStorage.setItem("gp_pseudo",p);}catch{}}
  };

  // Track daily winners count on Firebase
  useEffect(()=>{
    if(won&&pseudo){
      const day=getDaySeed();
      const key=mode;
      setDailyWins(prev=>{
        const existing=prev[key]||{};
        if(!existing[pseudo]){
          const update={...prev,[key]:{...existing,[pseudo]:true}};
          fetch(`${FB_URL}/daily/${day}/${key}/${pseudo}.json`,{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(true)
          }).catch(()=>{});
          return update;
        }
        return prev;
      });
    }
  },[won,pseudo,mode,FB_URL]);

  useEffect(()=>{try{localStorage.setItem("gp_lang",lang);}catch{}},[lang]);
  useEffect(()=>{try{localStorage.setItem("gp_hc",JSON.stringify(hardcore));}catch{}},[hardcore]);
  useEffect(()=>{try{localStorage.setItem("gp_sound",JSON.stringify(soundOn));}catch{}},[soundOn]);

  // ─── AUDIO ───
  const playSound=useCallback((type)=>{
    if(!soundOn)return;
    try{
      const ctx=new(window.AudioContext||window.webkitAudioContext)();
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      osc.connect(gain);gain.connect(ctx.destination);
      if(type==="win"){
        osc.type="triangle";osc.frequency.setValueAtTime(523,ctx.currentTime);
        osc.frequency.setValueAtTime(659,ctx.currentTime+0.15);
        osc.frequency.setValueAtTime(784,ctx.currentTime+0.3);
        osc.frequency.setValueAtTime(1047,ctx.currentTime+0.45);
        gain.gain.setValueAtTime(0.3,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.7);
        osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.7);
      } else if(type==="lose"){
        osc.type="sawtooth";osc.frequency.setValueAtTime(300,ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100,ctx.currentTime+0.6);
        gain.gain.setValueAtTime(0.2,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.6);
        osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.6);
      } else {
        osc.type="sine";osc.frequency.setValueAtTime(220,ctx.currentTime);
        osc.frequency.setValueAtTime(180,ctx.currentTime+0.1);
        gain.gain.setValueAtTime(0.15,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.2);
        osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.2);
      }
    }catch{}
  },[soundOn]);

  // ─── CONFETTI ───
  const launchConfetti=useCallback(()=>{
    setShowConfetti(true);
    setTimeout(()=>setShowConfetti(false),3000);
  },[]);

  // ─── COUNTDOWN ───
  useEffect(()=>{
    if(!won&&!lost)return;
    const tick=()=>{
      const now=new Date();
      const tomorrow=new Date(now);
      tomorrow.setDate(tomorrow.getDate()+1);
      tomorrow.setHours(0,0,0,0);
      const diff=tomorrow-now;
      const h=String(Math.floor(diff/3600000)).padStart(2,"0");
      const m=String(Math.floor((diff%3600000)/60000)).padStart(2,"0");
      const s=String(Math.floor((diff%60000)/1000)).padStart(2,"0");
      setCountdown(`${h}:${m}:${s}`);
    };
    tick();
    const id=setInterval(tick,1000);
    return()=>clearInterval(id);
  },[won,lost]);

  // ─── HISTORY ───
  const getHistory=useCallback(()=>{
    const days=[];
    const today=new Date();
    for(let i=29;i>=0;i--){
      const d=new Date(today);d.setDate(d.getDate()-i);
      const seed=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();
      const key=`gp_classic_${seed}`;
      try{
        const data=JSON.parse(localStorage.getItem(key));
        if(data&&data.w)days.push({date:d,status:"won"});
        else if(data&&data.g&&data.g.length>0)days.push({date:d,status:"lost"});
        else days.push({date:d,status:"none"});
      }catch{days.push({date:d,status:"none"});}
    }
    return days;
  },[]);

  const answer=useMemo(()=>pickDaily(mode),[mode]);

  useEffect(()=>{
    try{const k=`gp_${mode}_${getDaySeed()}`;const d=JSON.parse(localStorage.getItem(k));if(d){setGuesses(d.g||[]);setWon(d.w||false);setLost(d.l||false);setHintLvl(d.h||0);}else{setGuesses([]);setWon(false);setLost(false);setHintLvl(0);}}catch{setGuesses([]);setWon(false);setLost(false);setHintLvl(0);}
  },[mode]);
  useEffect(()=>{
    try{const k=`gp_${mode}_${getDaySeed()}`;localStorage.setItem(k,JSON.stringify({g:guesses,w:won,l:lost,h:hintLvl}));localStorage.setItem("gp_streaks",JSON.stringify(streaks));localStorage.setItem("gp_wins_all",JSON.stringify(totalWins));localStorage.setItem("gp_bests",JSON.stringify(bestStreaks));}catch{}
  },[guesses,won,lost,hintLvl,streaks,totalWins,bestStreaks,mode]);

  const suggestions=useMemo(()=>{
    if(!input.trim())return[];
    const l=input.toLowerCase(),gn=guesses.map(g=>g.name);
    return CHARS.filter(c=>{const n=getL(c.name,lang).toLowerCase();return n.includes(l)&&!gn.includes(getL(c.name,lang));}).slice(0,20);
  },[input,guesses,lang]);

  const submitGuess=useCallback(char=>{
    if(won||lost)return;
    const cols=compare(char,answer,lang);
    const isW=getL(char.name,lang)===getL(answer.name,lang);
    const ts=Date.now();
    const newGuesses=[...guesses,{name:getL(char.name,lang),charId:char.id,crew:char.crew,cols,isWin:isW,ts}];
    setGuesses(newGuesses);
    setInput("");setShowSug(false);
    if(isW){
      setWon(true);
      playSound("win");
      launchConfetti();
      setStreaks(prev=>{const next=(prev[mode]||0)+1;setBestStreaks(b=>({...b,[mode]:Math.max(b[mode]||0,next)}));return{...prev,[mode]:next};});
      setTotalWins(p=>({...p,[mode]:(p[mode]||0)+1}));
    } else if(hardcore&&newGuesses.length>=MAX_ATTEMPTS){
      setLost(true);
      playSound("lose");
      setStreaks(prev=>({...prev,[mode]:0}));
    } else {
      playSound("wrong");
    }
  },[answer,won,lost,lang,guesses,hardcore,playSound,launchConfetti,mode]);

  const hints=useMemo(()=>{
    const h=[];
    if(hintLvl>=1)h.push(`${t.origin} : ${getL(answer.origin,lang)}`);
    if(hintLvl>=2)h.push(`${t.status} : ${answer.status==="Alive"?t.alive:t.dead}`);
    if(hintLvl>=3){const df=getL(answer.df,lang);h.push(`${t.fruit} : ${df&&df!=="None"&&df!=="Unknown"?df:t.none}`);}
    return h;
  },[hintLvl,answer,lang,t]);

  const shareResult=()=>{
    const grid=guesses.map(g=>g.cols.map(c=>c.s==="correct"?"🟩":c.s==="close"?"🟨":"🟥").join("")).join("\n");
    const text=`🏴‍☠️ Grand Piecedle — ${t[mode]||mode}\n${won?`✅ ${guesses.length} 🎯`:"❌"}\n🔥 ${streak}\n\n${grid}`;
    navigator.clipboard?.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),2000);
  };

  // Blur for wanted poster mode (bounty)
  const blurLevels=[25,18,12,8,5,3,1,0];
  const currentBlur=blurLevels[Math.min(guesses.length,blurLevels.length-1)];

  const modesList=[
    {key:"classic",icon:"⚔️",label:t.classic,desc:t.classicD},
    {key:"devilFruit",icon:"🍎",label:t.devilFruit,desc:t.devilFruitD},
    {key:"bounty",icon:"💰",label:t.bounty,desc:t.bountyD},
    {key:"quote",icon:"💬",label:t.quote,desc:t.quoteD},
    {key:"laugh",icon:"😂",label:t.laugh,desc:t.laughD},
  ];

  return(
  <>
  <link href={FONT} rel="stylesheet"/>
  <style>{`
    *{box-sizing:border-box;margin:0;padding:0}
    :root{--bg:#07080d;--bg2:#0e1018;--bg3:#161825;--bg4:#1e2035;--gold:#d4a843;--gold2:#f0c850;--gold3:#c49530;--red:#c0392b;--green:#1a8a4a;--green2:#27ae60;--orange:#d4780a;--blue:#2980b9;--text:#e8e0d0;--text2:#9a9488;--text3:#5a5650;--correct:#1a5e35;--close:#7a6510;--wrong:#3a1515;--correct-b:#2a8e55;--close-b:#b89520;--wrong-b:#6a2525}
    @keyframes su{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes gl{0%,100%{box-shadow:0 0 8px rgba(212,168,67,.2)}50%{box-shadow:0 0 24px rgba(212,168,67,.35)}}
    @keyframes flipIn{0%{opacity:0;transform:rotateX(-90deg) scale(.85)}40%{opacity:.6;transform:rotateX(-20deg) scale(.95)}100%{opacity:1;transform:rotateX(0) scale(1)}}
    @keyframes nameGlow{0%{opacity:0;transform:translateX(-10px)}60%{opacity:1;transform:translateX(3px)}100%{opacity:1;transform:translateX(0)}}
    @keyframes waveMove{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes skullFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-6px) rotate(2deg)}}
    .su{animation:su .4s ease forwards}.gl{animation:gl 2s ease-in-out infinite}
    .flip-cell{animation:flipIn .5s cubic-bezier(.34,1.56,.64,1) both;transform-origin:center top;backface-visibility:hidden}
    .flip-name{animation:nameGlow .4s ease both}
    .avatar{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;color:#fff;flex-shrink:0;text-shadow:0 1px 2px rgba(0,0,0,.5);border:2px solid rgba(255,255,255,.15)}
    input::placeholder{color:var(--text3)}
    @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
    .confetti-piece{position:fixed;top:-10px;width:10px;height:10px;z-index:999;pointer-events:none;animation:confettiFall 2.5s ease-out forwards}
    .toggle-row{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--bg3);border-radius:10px;margin-bottom:8px}
    .toggle-label{font-size:14px;color:var(--text);display:flex;align-items:center;gap:8px}
    .toggle-sub{font-size:11px;color:var(--text3)}
    .toggle-btn{width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;position:relative;transition:background .2s}
    .toggle-btn::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s}
    .toggle-btn.on{background:var(--green2)}
    .toggle-btn.on::after{transform:translateX(20px)}
    .toggle-btn.off{background:var(--text3)}
    ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--text3);border-radius:3px}
  `}</style>
  <div style={{fontFamily:"'DM Sans',sans-serif",background:"var(--bg)",color:"var(--text)",minHeight:"100vh",position:"relative",overflow:"hidden"}}>
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse at 20% 0%,rgba(212,168,67,.06) 0%,transparent 45%),radial-gradient(ellipse at 80% 100%,rgba(192,57,43,.04) 0%,transparent 45%)"}}/>
    <div style={{position:"fixed",bottom:0,left:0,right:0,height:140,overflow:"hidden",pointerEvents:"none",zIndex:0,opacity:.1}}>
      <svg style={{position:"absolute",bottom:0,width:"200%",animation:"waveMove 20s linear infinite"}} viewBox="0 0 2400 120" preserveAspectRatio="none">
        <path d="M0,60 C400,120 800,0 1200,60 C1600,120 2000,0 2400,60 L2400,120 L0,120 Z" fill="var(--gold)"/>
      </svg>
    </div>
    <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:0,opacity:.02,animation:"skullFloat 6s ease-in-out infinite",fontSize:300,lineHeight:1}}>☠️</div>
    <div style={{position:"relative",zIndex:1,maxWidth:1000,margin:"0 auto",padding:"20px 16px 60px"}}>

    {/* LANG SELECTOR */}
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8,gap:4}}>
      {LANG_OPTIONS.map(l=>(
        <button key={l.code} onClick={()=>setLang(l.code)} style={{background:lang===l.code?"rgba(212,168,67,.15)":"transparent",border:lang===l.code?"1px solid rgba(212,168,67,.3)":"1px solid transparent",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:16,color:"var(--text)"}}>{l.flag}</button>
      ))}
    </div>

    {/* HEADER */}
    <header style={{textAlign:"center",marginBottom:28}}>
      <h1 style={{fontFamily:"'Pirata One',cursive",fontSize:"clamp(2.6rem,8vw,4.2rem)",color:"var(--gold)",textShadow:"0 0 60px rgba(212,168,67,.3),0 3px 8px rgba(0,0,0,.6)",letterSpacing:4,lineHeight:1}}>{t.title}</h1>
      <p style={{color:"var(--text2)",fontSize:13,marginTop:10,letterSpacing:2.5,textTransform:"uppercase"}}>{CHARS.length} {t.subtitle}</p>
      {streak>0&&<div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:10,background:"rgba(212,168,67,.1)",border:"1px solid rgba(212,168,67,.2)",borderRadius:20,padding:"5px 16px",fontSize:14,color:"var(--gold)",fontWeight:600}}>🔥 {t.streak} : {streak}</div>}
    </header>

    {/* TABS */}
    <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:22}}>
      {[{k:"game",l:t.play},{k:"stats",l:t.stats}].map(x=>(
        <button key={x.k} onClick={()=>setTab(x.k)} style={{background:tab===x.k?"rgba(212,168,67,.12)":"transparent",border:tab===x.k?"1px solid rgba(212,168,67,.25)":"1px solid transparent",borderRadius:10,padding:"8px 22px",color:tab===x.k?"var(--gold)":"var(--text3)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:tab===x.k?600:400}}>{x.l}</button>
      ))}
    </div>

    {tab==="stats"&&(
      <div className="su">
        {/* PSEUDO */}
        <div style={{background:"var(--bg2)",border:"1px solid rgba(212,168,67,.1)",borderRadius:14,padding:20,marginBottom:16}}>
          <div style={{fontSize:12,color:"var(--gold)",fontWeight:700,letterSpacing:2,marginBottom:10}}>{t.pseudo}</div>
          {pseudo?(
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontFamily:"'Pirata One',cursive",fontSize:24,color:"var(--gold2)"}}>{pseudo}</div>
              <button onClick={()=>{setPseudo("");setPseudoInput("");try{localStorage.removeItem("gp_pseudo");}catch{}}} style={{background:"none",border:"1px solid var(--text3)",borderRadius:6,padding:"4px 10px",color:"var(--text3)",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>✏️</button>
            </div>
          ):(
            <div style={{display:"flex",gap:8}}>
              <input value={pseudoInput} onChange={e=>setPseudoInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")savePseudo();}}
                placeholder={t.pseudoPlaceholder} maxLength={16}
                style={{flex:1,padding:"10px 14px",background:"var(--bg3)",border:"1px solid rgba(212,168,67,.15)",borderRadius:10,color:"var(--text)",fontSize:15,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
              <button onClick={savePseudo} style={{background:"var(--gold)",color:"#0a0a0f",border:"none",borderRadius:10,padding:"0 20px",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:14}}>{t.save}</button>
            </div>
          )}
        </div>

        {/* PERSONAL STATS */}
        <div style={{background:"var(--bg2)",border:"1px solid rgba(212,168,67,.1)",borderRadius:14,padding:24,marginBottom:16}}>
          <h3 style={{fontFamily:"'Pirata One',cursive",color:"var(--gold)",fontSize:24,marginBottom:12}}>{t.statistics}</h3>
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {["classic","devilFruit","bounty","quote","laugh"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{padding:"4px 12px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",border:mode===m?"1px solid var(--gold)":"1px solid rgba(255,255,255,.06)",background:mode===m?"rgba(212,168,67,.12)":"var(--bg3)",color:mode===m?"var(--gold)":"var(--text3)"}}>{t[m]||m}</button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[{l:t.victories,v:modeWins,i:"🏆"},{l:t.streak,v:streak,i:"🔥"},{l:t.record,v:bestStreak,i:"⭐"}].map(s=>(
              <div key={s.l} style={{background:"var(--bg3)",borderRadius:12,padding:18,textAlign:"center"}}>
                <div style={{fontSize:28}}>{s.i}</div>
                <div style={{fontFamily:"'Pirata One',cursive",fontSize:30,color:"var(--gold2)"}}>{s.v}</div>
                <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LEADERBOARD */}
        <div style={{background:"var(--bg2)",border:"1px solid rgba(212,168,67,.1)",borderRadius:14,padding:24,marginBottom:24}}>
          <h3 style={{fontFamily:"'Pirata One',cursive",color:"var(--gold)",fontSize:22,marginBottom:16,textAlign:"center"}}>{t.leaderboard}</h3>
          {leaderboard.length===0?(
            <div style={{textAlign:"center",color:"var(--text3)",fontSize:14,padding:20}}>{t.noLeaderboard}</div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {leaderboard.map((entry,i)=>{
                const rankBg=["linear-gradient(135deg,#f0c850,#d4a843)","linear-gradient(135deg,#c0c0c0,#a0a0a0)","linear-gradient(135deg,#cd7f32,#a0522d)"];
                const rowBg=["rgba(240,200,80,.08)","rgba(192,192,192,.08)","rgba(205,127,50,.08)"];
                const borderColors=["rgba(240,200,80,.4)","rgba(192,192,192,.3)","rgba(205,127,50,.3)"];
                const glowColors=["0 0 20px rgba(240,200,80,.25)","0 0 15px rgba(192,192,192,.2)","0 0 12px rgba(205,127,50,.15)"];
                const textColors=["#f0c850","#d0d0d0","#cd7f32"];
                const isTop3=i<3;
                const isMe=entry.pseudo===pseudo;
                return(
                  <div key={entry.pseudo}
                    style={{
                      display:"flex",alignItems:"center",gap:12,padding:"12px 16px",
                      background:isTop3?rowBg[i]:"var(--bg3)",
                      border:`1px solid ${isTop3?borderColors[i]:"rgba(255,255,255,.04)"}`,
                      borderRadius:12,
                      boxShadow:isTop3?glowColors[i]:"none",
                      transition:"all .3s ease",
                      cursor:"default",
                      transform:isMe?"scale(1.02)":"scale(1)",
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow=isTop3?glowColors[i].replace(".25)",".5)").replace(".2)",".4)").replace(".15)",".3)"):"0 0 15px rgba(212,168,67,.15)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform=isMe?"scale(1.02)":"scale(1)";e.currentTarget.style.boxShadow=isTop3?glowColors[i]:"none";}}>
                    {/* Rank */}
                    <div style={{
                      width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                      background:isTop3?rankBg[i]:"var(--bg4)",
                      color:isTop3?"#0a0a0f":"var(--text3)",
                      fontFamily:"'Pirata One',cursive",fontSize:isTop3?20:16,fontWeight:700,
                    }}>
                      {i===0?"👑":i===1?"🥈":i===2?"🥉":i+1}
                    </div>
                    {/* Pseudo */}
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:isMe?700:500,color:isTop3?textColors[i]:"var(--text)",fontFamily:isTop3?"'Pirata One',cursive":"'DM Sans',sans-serif"}}>
                        {entry.pseudo}{isMe?" ⭐":""}
                      </div>
                    </div>
                    {/* Streak */}
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{fontSize:18}}>🔥</span>
                      <span style={{fontFamily:"'Pirata One',cursive",fontSize:22,color:isTop3?textColors[i]:"var(--text)"}}>{entry.streak}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* HISTORY CALENDAR */}
        <div style={{background:"var(--bg2)",border:"1px solid rgba(212,168,67,.1)",borderRadius:14,padding:24,marginBottom:24}}>
          <h3 style={{fontFamily:"'Pirata One',cursive",color:"var(--gold)",fontSize:22,marginBottom:16,textAlign:"center"}}>{t.historyTitle}</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
            {getHistory().map((day,i)=>{
              const d=day.date;
              const label=`${d.getDate()}/${d.getMonth()+1}`;
              const bg=day.status==="won"?"var(--correct)":day.status==="lost"?"var(--wrong)":"var(--bg3)";
              const border=day.status==="won"?"var(--correct-b)":day.status==="lost"?"var(--wrong-b)":"rgba(255,255,255,.04)";
              const icon=day.status==="won"?"✅":day.status==="lost"?"❌":"·";
              const isToday=i===29;
              return(
                <div key={i} title={`${label} — ${day.status==="won"?t.won2:day.status==="lost"?t.lost2:t.notPlayed}`} style={{
                  background:bg,border:`1px solid ${border}`,borderRadius:8,padding:"8px 2px",textAlign:"center",
                  position:"relative",
                  boxShadow:isToday?"0 0 8px rgba(212,168,67,.3)":"none",
                }}>
                  <div style={{fontSize:10,color:"var(--text3)",marginBottom:2}}>{label}</div>
                  <div style={{fontSize:16}}>{icon}</div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:12}}>
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--text2)"}}>
              <div style={{width:12,height:12,borderRadius:3,background:"var(--correct)"}}/> {t.won2}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--text2)"}}>
              <div style={{width:12,height:12,borderRadius:3,background:"var(--wrong)"}}/> {t.lost2}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--text2)"}}>
              <div style={{width:12,height:12,borderRadius:3,background:"var(--bg3)",border:"1px solid rgba(255,255,255,.06)"}}/> {t.notPlayed}
            </div>
          </div>
        </div>
      </div>
    )}

    {tab==="game"&&<>
    {/* MODES */}
    <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:28,flexWrap:"wrap"}}>
      {modesList.map(m=>(
        <button key={m.key} onClick={()=>{setMode(m.key);setInput("");setShowSug(false);}} style={{
          background:mode===m.key?"linear-gradient(135deg,var(--gold),var(--gold3))":"var(--bg3)",
          color:mode===m.key?"#0a0a0f":"var(--text2)",
          border:mode===m.key?"none":"1px solid rgba(255,255,255,.06)",
          borderRadius:12,padding:"14px 18px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
          fontWeight:mode===m.key?700:400,fontSize:14,transition:"all .25s",minWidth:120,textAlign:"center",
        }}>
          <div style={{fontSize:26,marginBottom:4}}>{m.icon}</div>
          <div style={{fontWeight:700}}>{m.label}</div>
          <div style={{fontSize:11,opacity:.7,marginTop:2}}>{m.desc}</div>
        </button>
      ))}
    </div>

    {/* CLUE PANELS */}
    {mode==="devilFruit"&&!won&&(
      <div className="gl" style={{background:"linear-gradient(135deg,rgba(192,57,43,.12),rgba(139,26,26,.06))",border:"1px solid rgba(192,57,43,.25)",borderRadius:16,padding:24,textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:12,color:"var(--red)",fontWeight:700,letterSpacing:2.5,marginBottom:8}}>🍎 {t.dfClue}</div>
        <div style={{fontFamily:"'Pirata One',cursive",fontSize:28,color:"var(--gold2)"}}>{getL(answer.df,lang)}</div>
        <div style={{fontSize:14,color:"var(--text2)",marginTop:8}}>{t.dfQ}</div>
      </div>
    )}
    {mode==="bounty"&&!won&&(
      <div className="gl" style={{background:"linear-gradient(135deg,rgba(212,168,67,.12),rgba(184,134,11,.06))",border:"1px solid rgba(212,168,67,.25)",borderRadius:16,padding:24,textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:12,color:"var(--gold)",fontWeight:700,letterSpacing:2.5,marginBottom:8}}>💰 {t.bountyClue}</div>
        {/* Blurred wanted poster — gets clearer with each guess */}
        <div style={{margin:"12px auto",width:100,height:100,borderRadius:12,overflow:"hidden",border:"3px solid var(--gold3)",filter:`blur(${currentBlur}px)`,transition:"filter .6s ease"}}>
          <Avatar char={answer} size={100}/>
        </div>
        <div style={{fontFamily:"'Pirata One',cursive",fontSize:36,color:"var(--gold2)",marginTop:8}}>{answer.bounty.toLocaleString()} ₿</div>
        <div style={{fontSize:14,color:"var(--text2)",marginTop:6}}>{t.bountyQ}</div>
      </div>
    )}
    {mode==="quote"&&!won&&(
      <div className="gl" style={{background:"linear-gradient(135deg,rgba(41,128,185,.12),rgba(41,128,185,.04))",border:"1px solid rgba(41,128,185,.25)",borderRadius:16,padding:24,textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:12,color:"var(--blue)",fontWeight:700,letterSpacing:2.5,marginBottom:8}}>💬 {t.quoteClue}</div>
        <div style={{fontFamily:"'Pirata One',cursive",fontSize:22,color:"var(--gold2)",fontStyle:"italic",lineHeight:1.4}}>« {getL(answer.quote,lang)} »</div>
        <div style={{fontSize:14,color:"var(--text2)",marginTop:8}}>{t.quoteQ}</div>
      </div>
    )}
    {mode==="laugh"&&!won&&(
      <div className="gl" style={{background:"linear-gradient(135deg,rgba(212,120,10,.12),rgba(212,120,10,.04))",border:"1px solid rgba(212,120,10,.25)",borderRadius:16,padding:24,textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:12,color:"var(--orange)",fontWeight:700,letterSpacing:2.5,marginBottom:8}}>😂 {t.laughClue}</div>
        <div style={{fontFamily:"'Pirata One',cursive",fontSize:38,color:"var(--gold2)",letterSpacing:4}}>{answer.laugh}</div>
        <div style={{fontSize:14,color:"var(--text2)",marginTop:8}}>{t.laughQ}</div>
      </div>
    )}

    {/* HINTS */}
    {hints.length>0&&(
      <div style={{background:"rgba(26,106,58,.08)",border:"1px solid rgba(39,174,96,.15)",borderRadius:12,padding:16,marginBottom:20}}>
        <div style={{fontSize:11,color:"var(--green2)",fontWeight:700,letterSpacing:2,marginBottom:8}}>{t.hints}</div>
        {hints.map((h,i)=><div key={i} style={{fontSize:14,color:"var(--text)",marginBottom:4}}>💡 {h}</div>)}
      </div>
    )}

    {/* TOGGLES */}
    <div style={{marginBottom:16}}>
      <div className="toggle-row">
        <div className="toggle-label">⚔️ {t.hardcore} <span className="toggle-sub">({t.hardcoreDesc})</span></div>
        <button className={`toggle-btn ${hardcore?"on":"off"}`} onClick={()=>setHardcore(p=>!p)}/>
      </div>
      <div className="toggle-row">
        <div className="toggle-label">{soundOn?"🔊":"🔇"} {soundOn?t.soundOn:t.soundOff}</div>
        <button className={`toggle-btn ${soundOn?"on":"off"}`} onClick={()=>setSoundOn(p=>!p)}/>
      </div>
    </div>

    {/* INPUT */}
    {!won&&!lost&&(
      <div style={{position:"relative",marginBottom:24}}>
        <div style={{display:"flex",gap:10}}>
          <div style={{flex:1,position:"relative"}}>
            <input ref={inputRef} type="text" value={input}
              onChange={e=>{setInput(e.target.value);setShowSug(true);}}
              onFocus={()=>setShowSug(true)}
              placeholder={t.placeholder}
              style={{width:"100%",padding:"16px 20px",background:"var(--bg2)",border:"2px solid rgba(212,168,67,.15)",borderRadius:14,color:"var(--text)",fontSize:17,fontFamily:"'DM Sans',sans-serif",outline:"none"}}
              onKeyDown={e=>{if(e.key==="Enter"&&suggestions.length>0)submitGuess(suggestions[0]);}}/>
            {showSug&&suggestions.length>0&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:99,background:"var(--bg2)",border:"1px solid rgba(212,168,67,.15)",borderRadius:"0 0 14px 14px",maxHeight:420,overflowY:"auto"}}>
                {suggestions.map(s=>(
                  <div key={s.id} onClick={()=>submitGuess(s)}
                    style={{padding:"10px 14px",cursor:"pointer",fontSize:15,borderBottom:"1px solid rgba(255,255,255,.04)",display:"flex",alignItems:"center",gap:10}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(212,168,67,.08)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <Avatar char={s} size={34}/>
                    <div style={{flex:1}}>
                      <div style={{color:"var(--gold)",fontWeight:600}}>{getL(s.name,lang)}</div>
                      <div style={{color:"var(--text3)",fontSize:11,marginTop:1}}>{s.crew!=="None"?s.crew:s.affiliation}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {guesses.length>=3&&!won&&!lost&&hintLvl<3&&(
            <button onClick={()=>setHintLvl(p=>Math.min(p+1,3))} style={{background:"rgba(39,174,96,.1)",border:"1px solid rgba(39,174,96,.2)",borderRadius:14,padding:"0 18px",color:"var(--green2)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>
              💡 {t.hint} ({3-hintLvl})
            </button>
          )}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:12,color:"var(--text3)"}}>
          <span>{t.attempt}{guesses.length+1}{hardcore?` · ${t.attemptsLeft.replace("%n",MAX_ATTEMPTS-guesses.length)}`:""}</span>
          <span>↑ {t.higher} · ↓ {t.lower}</span>
        </div>
        {/* Hardcore progress bar */}
        {hardcore&&(
          <div style={{marginTop:8,height:6,background:"var(--bg3)",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(guesses.length/MAX_ATTEMPTS)*100}%`,background:guesses.length>=MAX_ATTEMPTS-1?"var(--red)":"var(--gold)",borderRadius:3,transition:"width .4s ease"}}/>
          </div>
        )}
      </div>
    )}

    {/* CONFETTI */}
    {showConfetti&&Array.from({length:50}).map((_,i)=>(
      <div key={i} className="confetti-piece" style={{
        left:`${Math.random()*100}%`,
        background:["#f0c850","#e74c3c","#27ae60","#3498db","#9b59b6","#e91e63","#f39c12"][i%7],
        borderRadius:Math.random()>.5?"50%":"0",
        width:Math.random()*8+6,height:Math.random()*8+6,
        animationDelay:`${Math.random()*1.5}s`,
        animationDuration:`${2+Math.random()*2}s`,
      }}/>
    ))}

    {/* WIN */}
    {won&&(
      <div className="su" style={{background:"linear-gradient(135deg,rgba(26,138,74,.12),rgba(39,174,96,.06))",border:"2px solid var(--green2)",borderRadius:16,padding:24,textAlign:"center",marginBottom:24}}>
        <div style={{margin:"0 auto 8px",width:80,height:80,borderRadius:"50%",overflow:"hidden",border:"3px solid var(--gold)"}}><Avatar char={answer} size={80}/></div>
        <div style={{fontFamily:"'Pirata One',cursive",fontSize:30,color:"var(--gold2)"}}>🏴‍☠️ {t.win}</div>
        <div style={{fontSize:16,marginTop:4}}>{t.wasIt} <strong style={{color:"var(--gold)"}}>{getL(answer.name,lang)}</strong> {t.inAttempts.replace("%n",guesses.length).replace("%s",guesses.length>1?"s":"")}</div>
        <button onClick={shareResult} style={{marginTop:14,background:"var(--gold)",color:"#0a0a0f",border:"none",borderRadius:10,padding:"12px 24px",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:15}}>{copied?t.copied:t.share}</button>
        <div style={{marginTop:10,fontSize:13,color:"var(--text2)"}}>🔥 {streak} · ⭐ {bestStreak}</div>
        {countdown&&<div style={{marginTop:10,fontSize:13,color:"var(--text3)"}}>{t.nextChallenge} <strong style={{color:"var(--gold)",fontFamily:"'Pirata One',cursive",fontSize:18}}>{countdown}</strong></div>}
      </div>
    )}

    {/* LOSE (hardcore) */}
    {lost&&(
      <div className="su" style={{background:"linear-gradient(135deg,rgba(192,57,43,.12),rgba(192,57,43,.06))",border:"2px solid var(--red)",borderRadius:16,padding:24,textAlign:"center",marginBottom:24}}>
        <div style={{margin:"0 auto 8px",width:80,height:80,borderRadius:"50%",overflow:"hidden",border:"3px solid var(--red)"}}><Avatar char={answer} size={80}/></div>
        <div style={{fontFamily:"'Pirata One',cursive",fontSize:28,color:"var(--red)"}}>{t.lost}</div>
        <div style={{fontSize:16,marginTop:4}}>{t.lostMsg} <strong style={{color:"var(--gold)"}}>{getL(answer.name,lang)}</strong></div>
        <button onClick={shareResult} style={{marginTop:14,background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--text3)",borderRadius:10,padding:"12px 24px",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:15}}>{copied?t.copied:t.share}</button>
        {countdown&&<div style={{marginTop:10,fontSize:13,color:"var(--text3)"}}>{t.nextChallenge} <strong style={{color:"var(--gold)",fontFamily:"'Pirata One',cursive",fontSize:18}}>{countdown}</strong></div>}
      </div>
    )}

    {/* TABLE */}
    {guesses.length>0&&(()=>{
      const latestTs=Math.max(...guesses.map(g=>g.ts||0));
      const charById=id=>CHARS.find(c=>c.id===id);
      return(
      <div style={{overflowX:"auto",marginBottom:20,borderRadius:12,perspective:"800px"}}>
        <table style={{width:"100%",borderCollapse:"separate",borderSpacing:3,minWidth:820}}>
          <thead><tr>
            <th style={th}>{t.nameH}</th>
            {[t.gender,t.group,t.fruitType,t.haki,t.primeH,t.height,t.originH,t.arcH].map(h=>(
              <th key={h} style={th}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[...guesses].reverse().map((g,i)=>{
              const isLatest=g.ts===latestTs;
              const ch=charById(g.charId);
              return(
              <tr key={g.ts||i}>
                <td className={isLatest?"flip-name":""} style={{...td,background:g.isWin?"var(--correct)":"var(--bg3)",fontWeight:600,color:g.isWin?"var(--gold2)":"var(--text)",borderLeft:g.isWin?"3px solid var(--green2)":"none",whiteSpace:"nowrap",padding:0}}>
                  <div style={{display:"flex",alignItems:"center",height:"100%"}}>
                    <div style={{width:52,height:52,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.2)",borderRadius:"8px 0 0 8px"}}>
                      {ch&&<Avatar char={ch} size={48}/>}
                    </div>
                    <div style={{borderLeft:"2px solid rgba(212,168,67,.2)",height:36,flexShrink:0}}/>
                    <span style={{padding:"0 12px",fontSize:13}}>{g.name}</span>
                  </div>
                </td>
                {g.cols.map((c,j)=>(
                  <td key={j} className={isLatest?"flip-cell":""} style={{...td,background:`var(--${c.s})`,borderBottom:`2px solid var(--${c.s}-b)`,animationDelay:isLatest?`${250+j*200}ms`:"0ms"}}>
                    <div style={{fontSize:12,lineHeight:1.3,fontWeight:c.s==="correct"?700:400}}>{c.v}</div>
                    {c.ar&&<div style={{fontSize:15,marginTop:2,opacity:.8}}>{c.ar}</div>}
                  </td>
                ))}
              </tr>);
            })}
          </tbody>
        </table>
      </div>);
    })()}

    {/* LEGEND */}
    <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",padding:"14px 0",borderTop:"1px solid rgba(255,255,255,.04)",marginTop:12}}>
      {[{c:"var(--correct)",l:t.correct},{c:"var(--close)",l:t.close},{c:"var(--wrong)",l:t.wrong}].map(x=>(
        <div key={x.l} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"var(--text2)"}}>
          <div style={{width:14,height:14,borderRadius:3,background:x.c}}/>{x.l}
        </div>
      ))}
      <span style={{fontSize:12,color:"var(--text3)"}}>{t.legend}</span>
    </div>

    {/* DAILY COUNTER */}
    <div style={{textAlign:"center",padding:"12px 0",marginTop:4}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(212,168,67,.06)",border:"1px solid rgba(212,168,67,.1)",borderRadius:20,padding:"8px 20px"}}>
        <span style={{fontSize:18}}>🏴‍☠️</span>
        <span style={{fontSize:14,color:"var(--gold)"}}>
          <strong>{Object.keys(dailyWins[mode]||{}).length}</strong> {t.players} {t.todayFound}
        </span>
      </div>
    </div>
    </>}

    <footer style={{textAlign:"center",padding:"24px 0 8px",fontSize:12,color:"var(--text3)"}}>
      Grand Piecedle — {t.footer}
    </footer>
    </div>
  </div>
  </>);
}

const th={padding:"10px 8px",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--gold3)",background:"var(--bg2)",borderRadius:8,whiteSpace:"nowrap",textAlign:"center"};
const td={padding:"10px 8px",fontSize:13,textAlign:"center",borderRadius:8,color:"var(--text)",transition:"background .3s"};
