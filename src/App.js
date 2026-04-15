import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ─── ARC ORDER (chronological) ───
const ARC_ORDER = [
  "Romance Dawn","Orange Town","Syrup Village","Baratie","Arlong Park","Loguetown",
  "Reverse Mountain","Whisky Peak","Little Garden","Drum Island","Alabasta",
  "Jaya","Skypiea","Long Ring Long Land","Water 7","Enies Lobby","Post-Enies Lobby",
  "Thriller Bark","Sabaody Archipelago","Amazon Lily","Impel Down","Marineford","Post-War",
  "Return to Sabaody","Fish-Man Island","Punk Hazard","Dressrosa","Zou",
  "Whole Cake Island","Levely","Wano","Egghead"
];
function arcIndex(a){const i=ARC_ORDER.indexOf(a);return i===-1?999:i;}

// ─── CHARACTER DATABASE (150+) ───
const CHARACTERS = [
  {id:1,name:"Monkey D. Luffy",gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:"Gomu Gomu no Mi",dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:3000000000,height:174,origin:"East Blue",arc:"Romance Dawn",status:"Alive",laugh:"Shishishi",quote:"Je vais devenir le Roi des Pirates !"},
  {id:2,name:"Roronoa Zoro",gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:"None",dfType:"None",haki:["Obs","Arm","Conq"],bounty:1111000000,height:181,origin:"East Blue",arc:"Romance Dawn",status:"Alive",laugh:"",quote:"Rien ne s'est passé."},
  {id:3,name:"Nami",gender:"F",affiliation:"Pirate",crew:"Straw Hat Pirates",df:"None",dfType:"None",haki:["Obs"],bounty:366000000,height:170,origin:"East Blue",arc:"Orange Town",status:"Alive",laugh:"",quote:"L'argent, c'est la vie !"},
  {id:4,name:"Usopp",gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:"None",dfType:"None",haki:["Obs"],bounty:500000000,height:176,origin:"East Blue",arc:"Syrup Village",status:"Alive",laugh:"",quote:"J'ai 8000 hommes sous mes ordres !"},
  {id:5,name:"Sanji",gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:1032000000,height:180,origin:"North Blue",arc:"Baratie",status:"Alive",laugh:"",quote:"Un cuisinier ne gaspille jamais la nourriture."},
  {id:6,name:"Tony Tony Chopper",gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:"Hito Hito no Mi",dfType:"Zoan",haki:[],bounty:1000,height:90,origin:"Grand Line",arc:"Drum Island",status:"Alive",laugh:"",quote:"Tes compliments ne me font pas plaisir, idiot !"},
  {id:7,name:"Nico Robin",gender:"F",affiliation:"Pirate",crew:"Straw Hat Pirates",df:"Hana Hana no Mi",dfType:"Paramecia",haki:["Obs","Arm"],bounty:930000000,height:188,origin:"West Blue",arc:"Whisky Peak",status:"Alive",laugh:"",quote:"Je veux vivre !"},
  {id:8,name:"Franky",gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:"None",dfType:"None",haki:["Arm"],bounty:394000000,height:240,origin:"South Blue",arc:"Water 7",status:"Alive",laugh:"",quote:"SUUUUPER !"},
  {id:9,name:"Brook",gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:"Yomi Yomi no Mi",dfType:"Paramecia",haki:[],bounty:383000000,height:277,origin:"West Blue",arc:"Thriller Bark",status:"Alive",laugh:"Yohohoho",quote:"Puis-je voir votre culotte ?"},
  {id:10,name:"Jinbe",gender:"M",affiliation:"Pirate",crew:"Straw Hat Pirates",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:1100000000,height:301,origin:"Grand Line",arc:"Impel Down",status:"Alive",laugh:"",quote:"Ne perds pas confiance en toi !"},
  {id:11,name:"Shanks",gender:"M",affiliation:"Pirate",crew:"Red Hair Pirates",df:"None",dfType:"None",haki:["Obs","Arm","Conq"],bounty:4048900000,height:199,origin:"West Blue",arc:"Romance Dawn",status:"Alive",laugh:"Dahaha",quote:"Je parie sur la nouvelle génération."},
  {id:12,name:"Portgas D. Ace",gender:"M",affiliation:"Pirate",crew:"Whitebeard Pirates",df:"Mera Mera no Mi",dfType:"Logia",haki:["Obs","Arm","Conq"],bounty:550000000,height:185,origin:"South Blue",arc:"Drum Island",status:"Dead",laugh:"",quote:"Merci de m'avoir aimé."},
  {id:13,name:"Trafalgar Law",gender:"M",affiliation:"Pirate",crew:"Heart Pirates",df:"Ope Ope no Mi",dfType:"Paramecia",haki:["Obs","Arm"],bounty:3000000000,height:191,origin:"North Blue",arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:"ROOM !"},
  {id:14,name:"Boa Hancock",gender:"F",affiliation:"Pirate",crew:"Kuja Pirates",df:"Mero Mero no Mi",dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:1659000000,height:191,origin:"Grand Line",arc:"Amazon Lily",status:"Alive",laugh:"",quote:"On me pardonne car je suis belle."},
  {id:15,name:"Crocodile",gender:"M",affiliation:"Pirate",crew:"Cross Guild",df:"Suna Suna no Mi",dfType:"Logia",haki:[],bounty:1965000000,height:253,origin:"Grand Line",arc:"Whisky Peak",status:"Alive",laugh:"Kuhahaha",quote:"Les faibles ne choisissent pas leur mort."},
  {id:16,name:"Doflamingo",gender:"M",affiliation:"Pirate",crew:"Donquixote Pirates",df:"Ito Ito no Mi",dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:340000000,height:305,origin:"Grand Line",arc:"Jaya",status:"Alive",laugh:"Fuffuffuffu",quote:"Les pirates sont mauvais ? La Marine est juste ?"},
  {id:17,name:"Eustass Kid",gender:"M",affiliation:"Pirate",crew:"Kid Pirates",df:"Jiki Jiki no Mi",dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:3000000000,height:205,origin:"South Blue",arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:""},
  {id:18,name:"Kaido",gender:"M",affiliation:"Pirate",crew:"Beasts Pirates",df:"Uo Uo no Mi Model: Seiryu",dfType:"Mythical Zoan",haki:["Obs","Arm","Conq"],bounty:4611100000,height:710,origin:"Grand Line",arc:"Punk Hazard",status:"Alive",laugh:"Worororo",quote:"En un contre un, pariez sur Kaido."},
  {id:19,name:"Big Mom",gender:"F",affiliation:"Pirate",crew:"Big Mom Pirates",df:"Soru Soru no Mi",dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:4388000000,height:880,origin:"Grand Line",arc:"Thriller Bark",status:"Alive",laugh:"Mamamama",quote:"Vie ou Mort ?!"},
  {id:20,name:"Blackbeard",gender:"M",affiliation:"Pirate",crew:"Blackbeard Pirates",df:"Yami Yami no Mi",dfType:"Logia",haki:["Obs","Arm","Conq"],bounty:3996000000,height:344,origin:"Grand Line",arc:"Jaya",status:"Alive",laugh:"Zehahaha",quote:"Les rêves des gens ne s'arrêtent jamais !"},
  {id:21,name:"Buggy",gender:"M",affiliation:"Pirate",crew:"Cross Guild",df:"Bara Bara no Mi",dfType:"Paramecia",haki:[],bounty:3189000000,height:192,origin:"Grand Line",arc:"Orange Town",status:"Alive",laugh:"Gyahahaha",quote:"Mon nez n'est PAS rouge !"},
  {id:22,name:"Mihawk",gender:"M",affiliation:"Pirate",crew:"Cross Guild",df:"None",dfType:"None",haki:["Obs","Arm","Conq"],bounty:3590000000,height:198,origin:"Grand Line",arc:"Baratie",status:"Alive",laugh:"",quote:"Tu es faible."},
  {id:23,name:"Sabo",gender:"M",affiliation:"Revolutionary",crew:"Revolutionary Army",df:"Mera Mera no Mi",dfType:"Logia",haki:["Obs","Arm"],bounty:602000000,height:187,origin:"East Blue",arc:"Post-War",status:"Alive",laugh:"",quote:""},
  {id:24,name:"Akainu",gender:"M",affiliation:"Marine",crew:"Marines",df:"Magu Magu no Mi",dfType:"Logia",haki:["Obs","Arm"],bounty:0,height:306,origin:"Grand Line",arc:"Marineford",status:"Alive",laugh:"",quote:"Justice absolue."},
  {id:25,name:"Aokiji",gender:"M",affiliation:"Pirate",crew:"Blackbeard Pirates",df:"Hie Hie no Mi",dfType:"Logia",haki:["Obs","Arm"],bounty:0,height:298,origin:"Grand Line",arc:"Long Ring Long Land",status:"Alive",laugh:"Arara",quote:"Justice paresseuse."},
  {id:26,name:"Kizaru",gender:"M",affiliation:"Marine",crew:"Marines",df:"Pika Pika no Mi",dfType:"Logia",haki:["Obs","Arm"],bounty:0,height:302,origin:"Grand Line",arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:"Oh... c'est effrayant."},
  {id:27,name:"Garp",gender:"M",affiliation:"Marine",crew:"Marines",df:"None",dfType:"None",haki:["Obs","Arm","Conq"],bounty:0,height:287,origin:"East Blue",arc:"Water 7",status:"Alive",laugh:"Bwahahaha",quote:"Un poing d'amour !"},
  {id:28,name:"Smoker",gender:"M",affiliation:"Marine",crew:"Marines",df:"Moku Moku no Mi",dfType:"Logia",haki:["Obs","Arm"],bounty:0,height:209,origin:"Grand Line",arc:"Loguetown",status:"Alive",laugh:"",quote:""},
  {id:29,name:"Fujitora",gender:"M",affiliation:"Marine",crew:"Marines",df:"Zushi Zushi no Mi",dfType:"Paramecia",haki:["Obs","Arm"],bounty:0,height:270,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"",quote:"Je voudrais voir ton visage."},
  {id:30,name:"Whitebeard",gender:"M",affiliation:"Pirate",crew:"Whitebeard Pirates",df:"Gura Gura no Mi",dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:5046000000,height:666,origin:"Grand Line",arc:"Drum Island",status:"Dead",laugh:"Gurararara",quote:"One Piece existe !"},
  {id:31,name:"Yamato",gender:"F",affiliation:"Pirate",crew:"None",df:"Inu Inu no Mi Model: Okuchi no Makami",dfType:"Mythical Zoan",haki:["Obs","Arm","Conq"],bounty:0,height:263,origin:"Grand Line",arc:"Wano",status:"Alive",laugh:"",quote:"Je suis Oden !"},
  {id:32,name:"Marco",gender:"M",affiliation:"Pirate",crew:"Whitebeard Pirates",df:"Tori Tori no Mi Model: Phoenix",dfType:"Mythical Zoan",haki:["Obs","Arm"],bounty:1374000000,height:203,origin:"Grand Line",arc:"Marineford",status:"Alive",laugh:"",quote:""},
  {id:33,name:"Katakuri",gender:"M",affiliation:"Pirate",crew:"Big Mom Pirates",df:"Mochi Mochi no Mi",dfType:"Paramecia",haki:["Obs","Arm","Conq"],bounty:1057000000,height:509,origin:"Grand Line",arc:"Whole Cake Island",status:"Alive",laugh:"",quote:""},
  {id:34,name:"Enel",gender:"M",affiliation:"Other",crew:"None",df:"Goro Goro no Mi",dfType:"Logia",haki:["Obs"],bounty:0,height:266,origin:"Sky Island",arc:"Skypiea",status:"Alive",laugh:"Yahaha",quote:"Je suis Dieu."},
  {id:35,name:"Rob Lucci",gender:"M",affiliation:"World Gov.",crew:"CP0",df:"Neko Neko no Mi Model: Leopard",dfType:"Zoan",haki:["Obs","Arm"],bounty:0,height:212,origin:"Grand Line",arc:"Water 7",status:"Alive",laugh:"",quote:""},
  {id:36,name:"Gecko Moria",gender:"M",affiliation:"Pirate",crew:"Thriller Bark Pirates",df:"Kage Kage no Mi",dfType:"Paramecia",haki:[],bounty:320000000,height:692,origin:"Grand Line",arc:"Thriller Bark",status:"Alive",laugh:"Kishishishi",quote:""},
  {id:37,name:"Bartholomew Kuma",gender:"M",affiliation:"Revolutionary",crew:"Revolutionary Army",df:"Nikyu Nikyu no Mi",dfType:"Paramecia",haki:[],bounty:296000000,height:689,origin:"South Blue",arc:"Thriller Bark",status:"Alive",laugh:"",quote:"Si tu devais voyager, où irais-tu ?"},
  {id:38,name:"Oden",gender:"M",affiliation:"Pirate",crew:"Roger Pirates",df:"None",dfType:"None",haki:["Obs","Arm","Conq"],bounty:0,height:382,origin:"Grand Line",arc:"Wano",status:"Dead",laugh:"",quote:"J'ai été fait pour bouillir !"},
  {id:39,name:"Vivi",gender:"F",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:[],bounty:0,height:169,origin:"Grand Line",arc:"Whisky Peak",status:"Alive",laugh:"",quote:""},
  {id:40,name:"Carrot",gender:"F",affiliation:"Pirate",crew:"None",df:"None",dfType:"None",haki:["Obs"],bounty:0,height:161,origin:"Grand Line",arc:"Zou",status:"Alive",laugh:"",quote:"Garchu !"},
  {id:41,name:"Perona",gender:"F",affiliation:"Pirate",crew:"Thriller Bark Pirates",df:"Horo Horo no Mi",dfType:"Paramecia",haki:[],bounty:0,height:160,origin:"Grand Line",arc:"Thriller Bark",status:"Alive",laugh:"Horohorohoro",quote:""},
  {id:42,name:"Magellan",gender:"M",affiliation:"World Gov.",crew:"Impel Down",df:"Doku Doku no Mi",dfType:"Paramecia",haki:[],bounty:0,height:491,origin:"Grand Line",arc:"Impel Down",status:"Alive",laugh:"",quote:""},
  {id:43,name:"Ivankov",gender:"M",affiliation:"Revolutionary",crew:"Revolutionary Army",df:"Horu Horu no Mi",dfType:"Paramecia",haki:[],bounty:0,height:449,origin:"Grand Line",arc:"Impel Down",status:"Alive",laugh:"Vahahaha",quote:"HEEEE-HAW !"},
  {id:44,name:"Bon Clay",gender:"M",affiliation:"Pirate",crew:"Baroque Works",df:"Mane Mane no Mi",dfType:"Paramecia",haki:[],bounty:32000000,height:231,origin:"Grand Line",arc:"Whisky Peak",status:"Alive",laugh:"",quote:"L'amitié est un trésor !"},
  {id:45,name:"Caesar Clown",gender:"M",affiliation:"Other",crew:"None",df:"Gasu Gasu no Mi",dfType:"Logia",haki:[],bounty:300000000,height:309,origin:"Grand Line",arc:"Punk Hazard",status:"Alive",laugh:"Shurorororo",quote:""},
  {id:46,name:"Tashigi",gender:"F",affiliation:"Marine",crew:"Marines",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:0,height:170,origin:"East Blue",arc:"Loguetown",status:"Alive",laugh:"",quote:""},
  {id:47,name:"Arlong",gender:"M",affiliation:"Pirate",crew:"Arlong Pirates",df:"None",dfType:"None",haki:[],bounty:20000000,height:263,origin:"Grand Line",arc:"Arlong Park",status:"Alive",laugh:"Shahaha",quote:"Les humains sont inférieurs."},
  {id:48,name:"Kuro",gender:"M",affiliation:"Pirate",crew:"Black Cat Pirates",df:"None",dfType:"None",haki:[],bounty:16000000,height:190,origin:"East Blue",arc:"Syrup Village",status:"Alive",laugh:"",quote:""},
  {id:49,name:"Don Krieg",gender:"M",affiliation:"Pirate",crew:"Krieg Pirates",df:"None",dfType:"None",haki:[],bounty:17000000,height:245,origin:"East Blue",arc:"Baratie",status:"Alive",laugh:"",quote:""},
  {id:50,name:"Wapol",gender:"M",affiliation:"Other",crew:"None",df:"Baku Baku no Mi",dfType:"Paramecia",haki:[],bounty:0,height:210,origin:"Grand Line",arc:"Drum Island",status:"Alive",laugh:"Mahaha",quote:""},
  {id:51,name:"Bellamy",gender:"M",affiliation:"Pirate",crew:"Bellamy Pirates",df:"Bane Bane no Mi",dfType:"Paramecia",haki:["Arm"],bounty:195000000,height:240,origin:"North Blue",arc:"Jaya",status:"Alive",laugh:"",quote:""},
  {id:52,name:"Wyper",gender:"M",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:[],bounty:0,height:183,origin:"Sky Island",arc:"Skypiea",status:"Alive",laugh:"",quote:""},
  {id:53,name:"Foxy",gender:"M",affiliation:"Pirate",crew:"Foxy Pirates",df:"Noro Noro no Mi",dfType:"Paramecia",haki:[],bounty:24000000,height:215,origin:"Grand Line",arc:"Long Ring Long Land",status:"Alive",laugh:"Fehfehfeh",quote:""},
  {id:54,name:"Paulie",gender:"M",affiliation:"Other",crew:"Galley-La",df:"None",dfType:"None",haki:[],bounty:0,height:195,origin:"Grand Line",arc:"Water 7",status:"Alive",laugh:"",quote:""},
  {id:55,name:"Spandam",gender:"M",affiliation:"World Gov.",crew:"CP0",df:"None",dfType:"None",haki:[],bounty:0,height:182,origin:"Grand Line",arc:"Water 7",status:"Alive",laugh:"",quote:""},
  {id:56,name:"Kaku",gender:"M",affiliation:"World Gov.",crew:"CP0",df:"Ushi Ushi no Mi Model: Giraffe",dfType:"Zoan",haki:["Obs","Arm"],bounty:0,height:193,origin:"Grand Line",arc:"Water 7",status:"Alive",laugh:"",quote:""},
  {id:57,name:"Jabra",gender:"M",affiliation:"World Gov.",crew:"CP9",df:"Inu Inu no Mi Model: Wolf",dfType:"Zoan",haki:[],bounty:0,height:212,origin:"Grand Line",arc:"Enies Lobby",status:"Alive",laugh:"",quote:""},
  {id:58,name:"Absalom",gender:"M",affiliation:"Pirate",crew:"Thriller Bark Pirates",df:"Suke Suke no Mi",dfType:"Paramecia",haki:[],bounty:0,height:240,origin:"Grand Line",arc:"Thriller Bark",status:"Dead",laugh:"",quote:""},
  {id:59,name:"Jewelry Bonney",gender:"F",affiliation:"Pirate",crew:"Bonney Pirates",df:"Toshi Toshi no Mi",dfType:"Paramecia",haki:[],bounty:320000000,height:174,origin:"South Blue",arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:""},
  {id:60,name:"Capone Bege",gender:"M",affiliation:"Pirate",crew:"Fire Tank Pirates",df:"Shiro Shiro no Mi",dfType:"Paramecia",haki:["Obs","Arm"],bounty:350000000,height:166,origin:"West Blue",arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:""},
  {id:61,name:"Basil Hawkins",gender:"M",affiliation:"Pirate",crew:"Hawkins Pirates",df:"Wara Wara no Mi",dfType:"Paramecia",haki:[],bounty:320000000,height:210,origin:"North Blue",arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:""},
  {id:62,name:"X Drake",gender:"M",affiliation:"Marine",crew:"SWORD",df:"Ryu Ryu no Mi Model: Allosaurus",dfType:"Ancient Zoan",haki:["Obs","Arm"],bounty:222000000,height:233,origin:"North Blue",arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:""},
  {id:63,name:"Urouge",gender:"M",affiliation:"Pirate",crew:"Fallen Monk Pirates",df:"Unknown",dfType:"Paramecia",haki:["Obs"],bounty:108000000,height:388,origin:"Sky Island",arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:""},
  {id:64,name:"Killer",gender:"M",affiliation:"Pirate",crew:"Kid Pirates",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:200000000,height:195,origin:"South Blue",arc:"Sabaody Archipelago",status:"Alive",laugh:"Fafafa",quote:""},
  {id:65,name:"Scratchmen Apoo",gender:"M",affiliation:"Pirate",crew:"On Air Pirates",df:"Unknown",dfType:"Paramecia",haki:["Obs"],bounty:350000000,height:256,origin:"Grand Line",arc:"Sabaody Archipelago",status:"Alive",laugh:"Apapapa",quote:""},
  {id:66,name:"Rayleigh",gender:"M",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:["Obs","Arm","Conq"],bounty:0,height:188,origin:"Grand Line",arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:"Mon capitaine n'a pas fui."},
  {id:67,name:"Sentomaru",gender:"M",affiliation:"Marine",crew:"Marines",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:0,height:271,origin:"Grand Line",arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:""},
  {id:68,name:"Fisher Tiger",gender:"M",affiliation:"Pirate",crew:"Sun Pirates",df:"None",dfType:"None",haki:[],bounty:230000000,height:270,origin:"Grand Line",arc:"Fish-Man Island",status:"Dead",laugh:"",quote:""},
  {id:69,name:"Hody Jones",gender:"M",affiliation:"Pirate",crew:"New Fish-Man Pirates",df:"None",dfType:"None",haki:[],bounty:0,height:383,origin:"Grand Line",arc:"Fish-Man Island",status:"Alive",laugh:"Jahaha",quote:""},
  {id:70,name:"Vergo",gender:"M",affiliation:"Pirate",crew:"Donquixote Pirates",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:0,height:209,origin:"North Blue",arc:"Punk Hazard",status:"Dead",laugh:"",quote:""},
  {id:71,name:"Monet",gender:"F",affiliation:"Pirate",crew:"Donquixote Pirates",df:"Yuki Yuki no Mi",dfType:"Logia",haki:[],bounty:0,height:180,origin:"Grand Line",arc:"Punk Hazard",status:"Dead",laugh:"",quote:""},
  {id:72,name:"Rebecca",gender:"F",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:["Obs"],bounty:0,height:171,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"",quote:""},
  {id:73,name:"Kyros",gender:"M",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:0,height:230,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"",quote:""},
  {id:74,name:"Cavendish",gender:"M",affiliation:"Pirate",crew:"Straw Hat Grand Fleet",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:330000000,height:208,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"",quote:""},
  {id:75,name:"Bartolomeo",gender:"M",affiliation:"Pirate",crew:"Straw Hat Grand Fleet",df:"Bari Bari no Mi",dfType:"Paramecia",haki:[],bounty:200000000,height:220,origin:"East Blue",arc:"Dressrosa",status:"Alive",laugh:"",quote:"LUFFY-SENPAI !"},
  {id:76,name:"Sai",gender:"M",affiliation:"Pirate",crew:"Straw Hat Grand Fleet",df:"None",dfType:"None",haki:["Obs","Arm","Conq"],bounty:210000000,height:200,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"",quote:""},
  {id:77,name:"Pedro",gender:"M",affiliation:"Pirate",crew:"Nox Pirates",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:382000000,height:233,origin:"Grand Line",arc:"Zou",status:"Dead",laugh:"",quote:"L'aube du monde approche."},
  {id:78,name:"Inuarashi",gender:"M",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:0,height:511,origin:"Grand Line",arc:"Zou",status:"Alive",laugh:"",quote:""},
  {id:79,name:"Nekomamushi",gender:"M",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:0,height:522,origin:"Grand Line",arc:"Zou",status:"Alive",laugh:"",quote:""},
  {id:80,name:"Charlotte Cracker",gender:"M",affiliation:"Pirate",crew:"Big Mom Pirates",df:"Bisu Bisu no Mi",dfType:"Paramecia",haki:["Obs","Arm"],bounty:860000000,height:307,origin:"Grand Line",arc:"Whole Cake Island",status:"Alive",laugh:"",quote:""},
  {id:81,name:"Charlotte Smoothie",gender:"F",affiliation:"Pirate",crew:"Big Mom Pirates",df:"Shibo Shibo no Mi",dfType:"Paramecia",haki:["Obs","Arm"],bounty:932000000,height:464,origin:"Grand Line",arc:"Whole Cake Island",status:"Alive",laugh:"",quote:""},
  {id:82,name:"Pudding",gender:"F",affiliation:"Pirate",crew:"Big Mom Pirates",df:"Memo Memo no Mi",dfType:"Paramecia",haki:[],bounty:0,height:166,origin:"Grand Line",arc:"Whole Cake Island",status:"Alive",laugh:"",quote:""},
  {id:83,name:"King",gender:"M",affiliation:"Pirate",crew:"Beasts Pirates",df:"Ryu Ryu no Mi Model: Pteranodon",dfType:"Ancient Zoan",haki:["Obs","Arm","Conq"],bounty:1390000000,height:613,origin:"Grand Line",arc:"Wano",status:"Alive",laugh:"",quote:""},
  {id:84,name:"Queen",gender:"M",affiliation:"Pirate",crew:"Beasts Pirates",df:"Ryu Ryu no Mi Model: Brachiosaurus",dfType:"Ancient Zoan",haki:["Obs","Arm"],bounty:1320000000,height:612,origin:"Grand Line",arc:"Wano",status:"Alive",laugh:"Muhahaha",quote:""},
  {id:85,name:"Jack",gender:"M",affiliation:"Pirate",crew:"Beasts Pirates",df:"Zou Zou no Mi Model: Mammoth",dfType:"Ancient Zoan",haki:["Obs","Arm"],bounty:1000000000,height:830,origin:"Grand Line",arc:"Zou",status:"Alive",laugh:"",quote:""},
  {id:86,name:"Ulti",gender:"F",affiliation:"Pirate",crew:"Beasts Pirates",df:"Ryu Ryu no Mi Model: Pachycephalosaurus",dfType:"Ancient Zoan",haki:["Obs","Arm"],bounty:400000000,height:173,origin:"Grand Line",arc:"Wano",status:"Alive",laugh:"",quote:""},
  {id:87,name:"Page One",gender:"M",affiliation:"Pirate",crew:"Beasts Pirates",df:"Ryu Ryu no Mi Model: Spinosaurus",dfType:"Ancient Zoan",haki:[],bounty:290000000,height:171,origin:"Grand Line",arc:"Wano",status:"Alive",laugh:"",quote:""},
  {id:88,name:"Who's-Who",gender:"M",affiliation:"Pirate",crew:"Beasts Pirates",df:"Neko Neko no Mi Model: Saber Tiger",dfType:"Ancient Zoan",haki:["Obs","Arm"],bounty:546000000,height:336,origin:"Grand Line",arc:"Wano",status:"Alive",laugh:"",quote:""},
  {id:89,name:"Black Maria",gender:"F",affiliation:"Pirate",crew:"Beasts Pirates",df:"Kumo Kumo no Mi Model: Rosamygale",dfType:"Ancient Zoan",haki:["Obs","Arm"],bounty:480000000,height:820,origin:"Grand Line",arc:"Wano",status:"Alive",laugh:"",quote:""},
  {id:90,name:"Sasaki",gender:"M",affiliation:"Pirate",crew:"Beasts Pirates",df:"Ryu Ryu no Mi Model: Triceratops",dfType:"Ancient Zoan",haki:["Arm"],bounty:472000000,height:318,origin:"Grand Line",arc:"Wano",status:"Alive",laugh:"",quote:""},
  {id:91,name:"Kinemon",gender:"M",affiliation:"Other",crew:"None",df:"Fuku Fuku no Mi",dfType:"Paramecia",haki:["Obs","Arm"],bounty:0,height:195,origin:"Grand Line",arc:"Punk Hazard",status:"Alive",laugh:"",quote:""},
  {id:92,name:"Momonosuke",gender:"M",affiliation:"Other",crew:"None",df:"Artificial Dragon",dfType:"Zoan",haki:[],bounty:0,height:180,origin:"Grand Line",arc:"Punk Hazard",status:"Alive",laugh:"",quote:""},
  {id:93,name:"Helmeppo",gender:"M",affiliation:"Marine",crew:"Marines",df:"None",dfType:"None",haki:[],bounty:0,height:195,origin:"East Blue",arc:"Romance Dawn",status:"Alive",laugh:"",quote:""},
  {id:94,name:"Vegapunk",gender:"M",affiliation:"World Gov.",crew:"None",df:"Nomi Nomi no Mi",dfType:"Paramecia",haki:[],bounty:0,height:270,origin:"Grand Line",arc:"Egghead",status:"Dead",laugh:"",quote:"Le monde attend mon message."},
  {id:95,name:"Denjiro",gender:"M",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:0,height:230,origin:"Grand Line",arc:"Wano",status:"Alive",laugh:"",quote:""},
  {id:96,name:"Monkey D. Dragon",gender:"M",affiliation:"Revolutionary",crew:"Revolutionary Army",df:"Unknown",dfType:"Unknown",haki:["Obs","Arm","Conq"],bounty:0,height:256,origin:"East Blue",arc:"Loguetown",status:"Alive",laugh:"",quote:""},
  {id:97,name:"Im",gender:"Unknown",affiliation:"World Gov.",crew:"World Government",df:"Unknown",dfType:"Unknown",haki:[],bounty:0,height:170,origin:"Grand Line",arc:"Levely",status:"Alive",laugh:"",quote:""},
  {id:98,name:"Gol D. Roger",gender:"M",affiliation:"Pirate",crew:"Roger Pirates",df:"None",dfType:"None",haki:["Obs","Arm","Conq"],bounty:5564800000,height:274,origin:"East Blue",arc:"Romance Dawn",status:"Dead",laugh:"",quote:"Mon trésor ? Quelque part sur Grand Line."},
  {id:99,name:"Tama",gender:"F",affiliation:"Other",crew:"None",df:"Kibi Kibi no Mi",dfType:"Paramecia",haki:[],bounty:0,height:110,origin:"Grand Line",arc:"Wano",status:"Alive",laugh:"",quote:""},
  {id:100,name:"Shirahoshi",gender:"F",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:[],bounty:0,height:1187,origin:"Grand Line",arc:"Fish-Man Island",status:"Alive",laugh:"",quote:""},
  {id:101,name:"Donquixote Rosinante",gender:"M",affiliation:"Marine",crew:"Marines",df:"Nagi Nagi no Mi",dfType:"Paramecia",haki:[],bounty:0,height:293,origin:"Grand Line",arc:"Dressrosa",status:"Dead",laugh:"",quote:""},
  {id:102,name:"Senior Pink",gender:"M",affiliation:"Pirate",crew:"Donquixote Pirates",df:"Sui Sui no Mi",dfType:"Paramecia",haki:[],bounty:0,height:231,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"",quote:"Hard-boiled."},
  {id:103,name:"Sugar",gender:"F",affiliation:"Pirate",crew:"Donquixote Pirates",df:"Hobi Hobi no Mi",dfType:"Paramecia",haki:[],bounty:0,height:110,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"",quote:""},
  {id:104,name:"Coby",gender:"M",affiliation:"Marine",crew:"Marines",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:0,height:167,origin:"East Blue",arc:"Romance Dawn",status:"Alive",laugh:"",quote:""},
  {id:105,name:"Hatchan",gender:"M",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:[],bounty:8000000,height:227,origin:"Grand Line",arc:"Arlong Park",status:"Alive",laugh:"",quote:""},
  {id:106,name:"Koala",gender:"F",affiliation:"Revolutionary",crew:"Revolutionary Army",df:"None",dfType:"None",haki:[],bounty:0,height:160,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"",quote:""},
  {id:107,name:"Diamante",gender:"M",affiliation:"Pirate",crew:"Donquixote Pirates",df:"Hira Hira no Mi",dfType:"Paramecia",haki:["Arm"],bounty:0,height:525,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"Uhahahaha",quote:""},
  {id:108,name:"Pica",gender:"M",affiliation:"Pirate",crew:"Donquixote Pirates",df:"Ishi Ishi no Mi",dfType:"Paramecia",haki:["Obs","Arm"],bounty:0,height:450,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"Pikkya",quote:""},
  {id:109,name:"Trebol",gender:"M",affiliation:"Pirate",crew:"Donquixote Pirates",df:"Beta Beta no Mi",dfType:"Paramecia",haki:[],bounty:0,height:349,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"Behehehe",quote:""},
  {id:110,name:"Baby 5",gender:"F",affiliation:"Pirate",crew:"Donquixote Pirates",df:"Buki Buki no Mi",dfType:"Paramecia",haki:["Arm"],bounty:0,height:181,origin:"Grand Line",arc:"Punk Hazard",status:"Alive",laugh:"",quote:"Tu as besoin de moi ?!"},
  {id:111,name:"Viola",gender:"F",affiliation:"Other",crew:"None",df:"Giro Giro no Mi",dfType:"Paramecia",haki:[],bounty:0,height:178,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"",quote:""},
  {id:112,name:"Charlotte Perospero",gender:"M",affiliation:"Pirate",crew:"Big Mom Pirates",df:"Pero Pero no Mi",dfType:"Paramecia",haki:["Obs","Arm"],bounty:700000000,height:333,origin:"Grand Line",arc:"Whole Cake Island",status:"Alive",laugh:"Perorin",quote:""},
  {id:113,name:"Charlotte Oven",gender:"M",affiliation:"Pirate",crew:"Big Mom Pirates",df:"Netsu Netsu no Mi",dfType:"Paramecia",haki:["Obs","Arm"],bounty:300000000,height:492,origin:"Grand Line",arc:"Whole Cake Island",status:"Alive",laugh:"",quote:""},
  {id:114,name:"Stussy",gender:"F",affiliation:"World Gov.",crew:"CP0",df:"None",dfType:"None",haki:[],bounty:0,height:175,origin:"Grand Line",arc:"Whole Cake Island",status:"Alive",laugh:"",quote:""},
  {id:115,name:"Morgans",gender:"M",affiliation:"Other",crew:"None",df:"Tori Tori no Mi Model: Albatross",dfType:"Zoan",haki:[],bounty:0,height:310,origin:"Grand Line",arc:"Whole Cake Island",status:"Alive",laugh:"",quote:"BIG NEWS !"},
  {id:116,name:"Sengoku",gender:"M",affiliation:"Marine",crew:"Marines",df:"Hito Hito no Mi Model: Daibutsu",dfType:"Mythical Zoan",haki:["Obs","Arm","Conq"],bounty:0,height:278,origin:"Grand Line",arc:"Marineford",status:"Alive",laugh:"",quote:""},
  {id:117,name:"Kalifa",gender:"F",affiliation:"World Gov.",crew:"CP0",df:"Awa Awa no Mi",dfType:"Paramecia",haki:[],bounty:0,height:180,origin:"Grand Line",arc:"Water 7",status:"Alive",laugh:"",quote:"C'est du harcèlement sexuel."},
  {id:118,name:"Blueno",gender:"M",affiliation:"World Gov.",crew:"CP9",df:"Doa Doa no Mi",dfType:"Paramecia",haki:[],bounty:0,height:319,origin:"Grand Line",arc:"Water 7",status:"Alive",laugh:"",quote:""},
  {id:119,name:"Iceburg",gender:"M",affiliation:"Other",crew:"Galley-La",df:"None",dfType:"None",haki:[],bounty:0,height:199,origin:"Grand Line",arc:"Water 7",status:"Alive",laugh:"",quote:""},
  {id:120,name:"Caribou",gender:"M",affiliation:"Pirate",crew:"Caribou Pirates",df:"Numa Numa no Mi",dfType:"Logia",haki:[],bounty:210000000,height:227,origin:"Grand Line",arc:"Return to Sabaody",status:"Alive",laugh:"Kehihihi",quote:""},
  {id:121,name:"Mr. 1",gender:"M",affiliation:"Pirate",crew:"Cross Guild",df:"Supa Supa no Mi",dfType:"Paramecia",haki:[],bounty:75000000,height:212,origin:"South Blue",arc:"Whisky Peak",status:"Alive",laugh:"",quote:""},
  {id:122,name:"Mr. 3",gender:"M",affiliation:"Pirate",crew:"Buggy's Delivery",df:"Doru Doru no Mi",dfType:"Paramecia",haki:[],bounty:24000000,height:179,origin:"Grand Line",arc:"Little Garden",status:"Alive",laugh:"",quote:""},
  {id:123,name:"Shakky",gender:"F",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:["Obs","Arm","Conq"],bounty:0,height:176,origin:"Grand Line",arc:"Sabaody Archipelago",status:"Alive",laugh:"",quote:""},
  {id:124,name:"Otohime",gender:"F",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:["Obs"],bounty:0,height:174,origin:"Grand Line",arc:"Fish-Man Island",status:"Dead",laugh:"",quote:""},
  {id:125,name:"Hyogoro",gender:"M",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:["Obs","Arm"],bounty:0,height:148,origin:"Grand Line",arc:"Wano",status:"Alive",laugh:"",quote:""},
  {id:126,name:"Wanda",gender:"F",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:[],bounty:0,height:172,origin:"Grand Line",arc:"Zou",status:"Alive",laugh:"",quote:""},
  {id:127,name:"Gan Fall",gender:"M",affiliation:"Other",crew:"None",df:"None",dfType:"None",haki:[],bounty:0,height:177,origin:"Sky Island",arc:"Skypiea",status:"Alive",laugh:"",quote:""},
  {id:128,name:"Kumadori",gender:"M",affiliation:"World Gov.",crew:"CP9",df:"None",dfType:"None",haki:[],bounty:0,height:320,origin:"Grand Line",arc:"Enies Lobby",status:"Alive",laugh:"Yoyoi",quote:""},
  {id:129,name:"Fukurou",gender:"M",affiliation:"World Gov.",crew:"CP9",df:"None",dfType:"None",haki:[],bounty:0,height:298,origin:"Grand Line",arc:"Enies Lobby",status:"Alive",laugh:"Chapapapa",quote:""},
  {id:130,name:"Leo",gender:"M",affiliation:"Pirate",crew:"Straw Hat Grand Fleet",df:"Nui Nui no Mi",dfType:"Paramecia",haki:[],bounty:0,height:25,origin:"Grand Line",arc:"Dressrosa",status:"Alive",laugh:"",quote:""},
];

const CHARS=CHARACTERS.filter((c,i,a)=>a.findIndex(x=>x.name===c.name)===i);

// ─── SEEDING ───
function getDaySeed(){const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();}
function sRand(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return s/2147483647;};}
function pickDaily(mode){
  const seed=getDaySeed()+mode.charCodeAt(0)*137+mode.length*31;
  const r=sRand(seed);
  let pool=CHARS;
  if(mode==="devilFruit") pool=CHARS.filter(c=>c.df!=="None"&&c.df!=="Unknown");
  if(mode==="quote") pool=CHARS.filter(c=>c.quote&&c.quote.length>0);
  if(mode==="laugh") pool=CHARS.filter(c=>c.laugh&&c.laugh.length>0);
  return pool[Math.floor(r()*pool.length)];
}

// ─── COMPARE ───
function compare(g,a){
  const cols=[];
  const eq=(x,y)=>String(x).toLowerCase()===String(y).toLowerCase();
  const nSt=(x,y)=>x===y?"correct":Math.abs(x-y)/Math.max(x,y,1)<.15?"close":"wrong";
  const aCmp=(x,y)=>{if(!x.length&&!y.length)return"correct";if(JSON.stringify([...x].sort())===JSON.stringify([...y].sort()))return"correct";if(x.some(v=>y.includes(v)))return"close";return"wrong";};
  const arcSt=(x,y)=>{if(x===y)return"correct";const d=Math.abs(arcIndex(x)-arcIndex(y));return d<=2?"close":"wrong";};
  cols.push({l:"Genre",v:g.gender,s:eq(g.gender,a.gender)?"correct":"wrong"});
  cols.push({l:"Affiliation",v:g.affiliation,s:eq(g.affiliation,a.affiliation)?"correct":"wrong"});
  cols.push({l:"Équipage",v:g.crew,s:eq(g.crew,a.crew)?"correct":"wrong"});
  cols.push({l:"Fruit",v:g.dfType==="None"?"Aucun":g.dfType,s:eq(g.dfType,a.dfType)?"correct":"wrong"});
  cols.push({l:"Haki",v:g.haki.length?g.haki.join(", "):"Aucun",s:aCmp(g.haki,a.haki)});
  cols.push({l:"Prime",v:g.bounty===0?"—":(g.bounty>=1e9?(g.bounty/1e9).toFixed(1)+"B":g.bounty>=1e6?(g.bounty/1e6).toFixed(0)+"M":g.bounty.toLocaleString("fr")),s:nSt(g.bounty,a.bounty),ar:g.bounty<a.bounty?"↑":g.bounty>a.bounty?"↓":""});
  cols.push({l:"Taille",v:g.height+"cm",s:nSt(g.height,a.height),ar:g.height<a.height?"↑":g.height>a.height?"↓":""});
  cols.push({l:"Origine",v:g.origin,s:eq(g.origin,a.origin)?"correct":"wrong"});
  const gA=arcIndex(g.arc),aA=arcIndex(a.arc);
  cols.push({l:"Arc",v:g.arc,s:arcSt(g.arc,a.arc),ar:gA<aA?"↑":gA>aA?"↓":""});
  cols.push({l:"Statut",v:g.status,s:eq(g.status,a.status)?"correct":"wrong"});
  return cols;
}

const FONT="https://fonts.googleapis.com/css2?family=Pirata+One&family=DM+Sans:wght@300;400;500;600;700&display=swap";
const MODES=[
  {key:"classic",label:"Classique",icon:"⚔️",desc:"Devine par attributs"},
  {key:"devilFruit",label:"Fruit du Démon",icon:"🍎",desc:"Quel possesseur ?"},
  {key:"bounty",label:"Prime",icon:"💰",desc:"Quelle prime ?"},
  {key:"quote",label:"Citation",icon:"💬",desc:"Qui a dit ça ?"},
  {key:"laugh",label:"Rire",icon:"😂",desc:"Quel rire ?"},
];

export default function App(){
  const[mode,setMode]=useState("classic");
  const[guesses,setGuesses]=useState([]);
  const[input,setInput]=useState("");
  const[won,setWon]=useState(false);
  const[showSug,setShowSug]=useState(false);
  const[hintLvl,setHintLvl]=useState(0);
  const[streak,setStreak]=useState(()=>{try{return JSON.parse(localStorage.getItem("gp_streak"))||0}catch{return 0}});
  const[totalWins,setTotalWins]=useState(()=>{try{return JSON.parse(localStorage.getItem("gp_wins"))||0}catch{return 0}});
  const[bestStreak,setBestStreak]=useState(()=>{try{return JSON.parse(localStorage.getItem("gp_best"))||0}catch{return 0}});
  const[tab,setTab]=useState("game");
  const[copied,setCopied]=useState(false);
  const ref=useRef(null);

  const answer=useMemo(()=>pickDaily(mode),[mode]);

  // persist per-mode per-day
  useEffect(()=>{
    try{
      const k=`gp_${mode}_${getDaySeed()}`;
      const d=JSON.parse(localStorage.getItem(k));
      if(d){setGuesses(d.g||[]);setWon(d.w||false);setHintLvl(d.h||0);}
      else{setGuesses([]);setWon(false);setHintLvl(0);}
    }catch{setGuesses([]);setWon(false);setHintLvl(0);}
  },[mode]);

  useEffect(()=>{
    try{
      const k=`gp_${mode}_${getDaySeed()}`;
      localStorage.setItem(k,JSON.stringify({g:guesses,w:won,h:hintLvl}));
      localStorage.setItem("gp_streak",JSON.stringify(streak));
      localStorage.setItem("gp_wins",JSON.stringify(totalWins));
      localStorage.setItem("gp_best",JSON.stringify(bestStreak));
    }catch{}
  },[guesses,won,hintLvl,streak,totalWins,bestStreak,mode]);

  const suggestions=useMemo(()=>{
    if(!input.trim())return[];
    const l=input.toLowerCase(),gn=guesses.map(g=>g.name);
    return CHARS.filter(c=>c.name.toLowerCase().includes(l)&&!gn.includes(c.name)).slice(0,20);
  },[input,guesses]);

  const submitGuess=useCallback(char=>{
    if(won)return;
    const cols=compare(char,answer);
    const isW=char.name===answer.name;
    setGuesses(p=>[...p,{name:char.name,cols,isWin:isW}]);
    setInput("");setShowSug(false);
    if(isW){setWon(true);setStreak(p=>p+1);setTotalWins(p=>p+1);setBestStreak(p=>Math.max(p,streak+1));}
  },[answer,won,guesses,streak]);

  const hints=useMemo(()=>{
    const h=[];
    if(hintLvl>=1)h.push(`Origine : ${answer.origin}`);
    if(hintLvl>=2)h.push(`Type de Fruit : ${answer.dfType==="None"?"Aucun":answer.dfType}`);
    if(hintLvl>=3)h.push(`Première lettre : ${answer.name[0]}`);
    return h;
  },[hintLvl,answer]);

  const shareResult=()=>{
    const grid=guesses.map(g=>g.cols.map(c=>c.s==="correct"?"🟩":c.s==="close"?"🟨":"🟥").join("")).join("\n");
    const text=`🏴‍☠️ Grand Piecedle — ${MODES.find(m=>m.key===mode)?.label}\n${won?`✅ En ${guesses.length} essai${guesses.length>1?"s":""}!`:"❌"}\n🔥 ${streak}\n\n${grid}`;
    navigator.clipboard?.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),2000);
  };

  return(
  <>
  <link href={FONT} rel="stylesheet"/>
  <style>{`
    *{box-sizing:border-box;margin:0;padding:0}
    :root{--bg:#07080d;--bg2:#0e1018;--bg3:#161825;--bg4:#1e2035;--gold:#d4a843;--gold2:#f0c850;--gold3:#c49530;--red:#c0392b;--green:#1a8a4a;--green2:#27ae60;--orange:#d4780a;--blue:#2980b9;--text:#e8e0d0;--text2:#9a9488;--text3:#5a5650;--correct:#1a5e35;--close:#7a6510;--wrong:#3a1515;--correct-b:#2a8e55;--close-b:#b89520;--wrong-b:#6a2525}
    @keyframes su{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes gl{0%,100%{box-shadow:0 0 8px rgba(212,168,67,.2)}50%{box-shadow:0 0 24px rgba(212,168,67,.35)}}
    .su{animation:su .4s ease forwards}.gl{animation:gl 2s ease-in-out infinite}
    input::placeholder{color:var(--text3)}
    ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--text3);border-radius:3px}
  `}</style>
  <div style={{fontFamily:"'DM Sans',sans-serif",background:"var(--bg)",color:"var(--text)",minHeight:"100vh",position:"relative"}}>
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse at 15% 0%,rgba(212,168,67,.05) 0%,transparent 40%),radial-gradient(ellipse at 85% 100%,rgba(192,57,43,.03) 0%,transparent 40%)"}}/>
    <div style={{position:"relative",zIndex:1,maxWidth:960,margin:"0 auto",padding:"14px 12px 40px"}}>

    {/* HEADER */}
    <header style={{textAlign:"center",marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10}}>
        <div style={{width:36,height:1,background:"linear-gradient(90deg,transparent,var(--gold))"}}/>
        <h1 style={{fontFamily:"'Pirata One',cursive",fontSize:"clamp(2rem,7vw,3.6rem)",color:"var(--gold)",textShadow:"0 0 50px rgba(212,168,67,.25),0 2px 6px rgba(0,0,0,.6)",letterSpacing:3,lineHeight:1}}>Grand Piecedle</h1>
        <div style={{width:36,height:1,background:"linear-gradient(90deg,var(--gold),transparent)"}}/>
      </div>
      <p style={{color:"var(--text2)",fontSize:11,marginTop:6,letterSpacing:2,textTransform:"uppercase"}}>{CHARS.length} personnages • 5 modes • Quotidien</p>
      {streak>0&&<div style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:6,background:"rgba(212,168,67,.1)",border:"1px solid rgba(212,168,67,.18)",borderRadius:20,padding:"3px 12px",fontSize:12,color:"var(--gold)"}}>🔥 {streak}</div>}
    </header>

    {/* TABS */}
    <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:16}}>
      {[{k:"game",l:"🎮 Jouer"},{k:"stats",l:"📊 Stats"}].map(t=>(
        <button key={t.k} onClick={()=>setTab(t.k)} style={{background:tab===t.k?"rgba(212,168,67,.1)":"transparent",border:tab===t.k?"1px solid rgba(212,168,67,.2)":"1px solid transparent",borderRadius:8,padding:"5px 16px",color:tab===t.k?"var(--gold)":"var(--text3)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:tab===t.k?600:400}}>{t.l}</button>
      ))}
    </div>

    {tab==="stats"&&(
      <div className="su" style={{background:"var(--bg2)",border:"1px solid rgba(212,168,67,.1)",borderRadius:14,padding:20,marginBottom:20}}>
        <h3 style={{fontFamily:"'Pirata One',cursive",color:"var(--gold)",fontSize:22,marginBottom:14}}>Statistiques</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[{l:"Victoires",v:totalWins,i:"🏆"},{l:"Streak",v:streak,i:"🔥"},{l:"Record",v:bestStreak,i:"⭐"}].map(s=>(
            <div key={s.l} style={{background:"var(--bg3)",borderRadius:10,padding:14,textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:2}}>{s.i}</div>
              <div style={{fontFamily:"'Pirata One',cursive",fontSize:26,color:"var(--gold2)"}}>{s.v}</div>
              <div style={{fontSize:10,color:"var(--text2)",marginTop:1}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    )}

    {tab==="game"&&<>
    {/* MODES */}
    <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:20,flexWrap:"wrap"}}>
      {MODES.map(m=>(
        <button key={m.key} onClick={()=>{setMode(m.key);setInput("");setShowSug(false);}} style={{
          background:mode===m.key?"linear-gradient(135deg,var(--gold),var(--gold3))":"var(--bg3)",
          color:mode===m.key?"#0a0a0f":"var(--text2)",
          border:mode===m.key?"none":"1px solid rgba(255,255,255,.05)",
          borderRadius:10,padding:"8px 12px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
          fontWeight:mode===m.key?700:400,fontSize:12,transition:"all .2s",minWidth:100,textAlign:"center",
        }}>
          <div style={{fontSize:18,marginBottom:1}}>{m.icon}</div>
          <div style={{fontWeight:600}}>{m.label}</div>
          <div style={{fontSize:9,opacity:.7}}>{m.desc}</div>
        </button>
      ))}
    </div>

    {/* CLUE PANELS */}
    {mode==="devilFruit"&&!won&&(
      <div className="gl" style={{background:"linear-gradient(135deg,rgba(192,57,43,.1),rgba(139,26,26,.05))",border:"1px solid rgba(192,57,43,.22)",borderRadius:12,padding:16,textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:10,color:"var(--red)",fontWeight:700,letterSpacing:2,marginBottom:4}}>🍎 FRUIT DU DÉMON</div>
        <div style={{fontFamily:"'Pirata One',cursive",fontSize:22,color:"var(--gold2)"}}>{answer.df}</div>
        <div style={{fontSize:11,color:"var(--text2)",marginTop:3}}>Qui possède ce fruit ?</div>
      </div>
    )}
    {mode==="bounty"&&!won&&(
      <div className="gl" style={{background:"linear-gradient(135deg,rgba(212,168,67,.1),rgba(184,134,11,.05))",border:"1px solid rgba(212,168,67,.22)",borderRadius:12,padding:16,textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:10,color:"var(--gold)",fontWeight:700,letterSpacing:2,marginBottom:4}}>💰 PRIME RECHERCHÉE</div>
        <div style={{fontFamily:"'Pirata One',cursive",fontSize:28,color:"var(--gold2)"}}>{answer.bounty.toLocaleString("fr")} ₿</div>
        <div style={{fontSize:11,color:"var(--text2)",marginTop:3}}>Quel pirate possède cette prime ?</div>
      </div>
    )}
    {mode==="quote"&&!won&&(
      <div className="gl" style={{background:"linear-gradient(135deg,rgba(41,128,185,.1),rgba(41,128,185,.03))",border:"1px solid rgba(41,128,185,.22)",borderRadius:12,padding:16,textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:10,color:"var(--blue)",fontWeight:700,letterSpacing:2,marginBottom:4}}>💬 CITATION</div>
        <div style={{fontFamily:"'Pirata One',cursive",fontSize:18,color:"var(--gold2)",fontStyle:"italic",lineHeight:1.4}}>« {answer.quote} »</div>
        <div style={{fontSize:11,color:"var(--text2)",marginTop:4}}>Qui a dit ça ?</div>
      </div>
    )}
    {mode==="laugh"&&!won&&(
      <div className="gl" style={{background:"linear-gradient(135deg,rgba(212,120,10,.1),rgba(212,120,10,.03))",border:"1px solid rgba(212,120,10,.22)",borderRadius:12,padding:16,textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:10,color:"var(--orange)",fontWeight:700,letterSpacing:2,marginBottom:4}}>😂 RIRE MYSTÈRE</div>
        <div style={{fontFamily:"'Pirata One',cursive",fontSize:30,color:"var(--gold2)",letterSpacing:3}}>{answer.laugh}</div>
        <div style={{fontSize:11,color:"var(--text2)",marginTop:4}}>À qui appartient ce rire ?</div>
      </div>
    )}

    {/* HINTS */}
    {hints.length>0&&(
      <div style={{background:"rgba(26,106,58,.06)",border:"1px solid rgba(39,174,96,.12)",borderRadius:10,padding:10,marginBottom:14}}>
        <div style={{fontSize:9,color:"var(--green2)",fontWeight:700,letterSpacing:1.5,marginBottom:4}}>INDICES</div>
        {hints.map((h,i)=><div key={i} style={{fontSize:12,color:"var(--text)",marginBottom:1}}>💡 {h}</div>)}
      </div>
    )}

    {/* INPUT */}
    {!won&&(
      <div style={{position:"relative",marginBottom:18}}>
        <div style={{display:"flex",gap:8}}>
          <div style={{flex:1,position:"relative"}}>
            <input ref={ref} type="text" value={input}
              onChange={e=>{setInput(e.target.value);setShowSug(true);}}
              onFocus={()=>setShowSug(true)}
              placeholder="Tape le nom d'un personnage..."
              style={{width:"100%",padding:"12px 14px",background:"var(--bg2)",border:"1px solid rgba(212,168,67,.12)",borderRadius:10,color:"var(--text)",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none"}}
              onKeyDown={e=>{if(e.key==="Enter"&&suggestions.length>0)submitGuess(suggestions[0]);}}/>
            {showSug&&suggestions.length>0&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:99,background:"var(--bg2)",border:"1px solid rgba(212,168,67,.12)",borderRadius:"0 0 10px 10px",maxHeight:400,overflowY:"auto"}}>
                {suggestions.map(s=>(
                  <div key={s.id} onClick={()=>submitGuess(s)}
                    style={{padding:"9px 12px",cursor:"pointer",fontSize:13,borderBottom:"1px solid rgba(255,255,255,.03)",display:"flex",justifyContent:"space-between",alignItems:"center"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(212,168,67,.07)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{color:"var(--gold)",fontWeight:500}}>{s.name}</span>
                    <span style={{color:"var(--text3)",fontSize:10}}>{s.crew!=="None"?s.crew:s.affiliation}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {guesses.length>=3&&!won&&hintLvl<3&&(
            <button onClick={()=>setHintLvl(p=>Math.min(p+1,3))} style={{background:"rgba(39,174,96,.08)",border:"1px solid rgba(39,174,96,.18)",borderRadius:10,padding:"0 12px",color:"var(--green2)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>
              💡 ({3-hintLvl})
            </button>
          )}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,color:"var(--text3)"}}>
          <span>Essai n°{guesses.length+1}</span>
          <span>↑ plus élevé/tardif · ↓ plus bas/tôt</span>
        </div>
      </div>
    )}

    {/* WIN */}
    {won&&(
      <div className="su" style={{background:"linear-gradient(135deg,rgba(26,138,74,.12),rgba(39,174,96,.06))",border:"2px solid var(--green2)",borderRadius:14,padding:20,textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:40}}>🏴‍☠️</div>
        <div style={{fontFamily:"'Pirata One',cursive",fontSize:28,color:"var(--gold2)",margin:"4px 0"}}>Victoire !</div>
        <div style={{fontSize:14}}>C'était <strong style={{color:"var(--gold)"}}>{answer.name}</strong> en {guesses.length} essai{guesses.length>1?"s":""}</div>
        <button onClick={shareResult} style={{marginTop:12,background:"var(--gold)",color:"#0a0a0f",border:"none",borderRadius:8,padding:"9px 20px",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13}}>
          {copied?"✅ Copié !":"📋 Partager"}
        </button>
        <div style={{marginTop:8,fontSize:11,color:"var(--text2)"}}>🔥 {streak} · ⭐ {bestStreak}</div>
      </div>
    )}

    {/* TABLE */}
    {guesses.length>0&&(
      <div style={{overflowX:"auto",marginBottom:16,borderRadius:10}}>
        <table style={{width:"100%",borderCollapse:"separate",borderSpacing:2,minWidth:780}}>
          <thead><tr>
            <th style={th}>Nom</th>
            {["Genre","Affil.","Équipage","Fruit","Haki","Prime","Taille","Origine","Arc","Statut"].map(h=>(
              <th key={h} style={th}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[...guesses].reverse().map((g,i)=>(
              <tr key={i} className="su" style={{animationDelay:`${i*30}ms`}}>
                <td style={{...td,background:g.isWin?"var(--correct)":"var(--bg3)",fontWeight:600,color:g.isWin?"var(--gold2)":"var(--text)",borderLeft:g.isWin?"2px solid var(--green2)":"none",whiteSpace:"nowrap"}}>
                  {g.name}
                </td>
                {g.cols.map((c,j)=>(
                  <td key={j} style={{...td,background:`var(--${c.s})`,borderBottom:`2px solid var(--${c.s}-b)`}}>
                    <div style={{fontSize:10,lineHeight:1.25,fontWeight:c.s==="correct"?600:400}}>{c.v}</div>
                    {c.ar&&<div style={{fontSize:13,marginTop:1,opacity:.75}}>{c.ar}</div>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* LEGEND */}
    <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",padding:"10px 0",borderTop:"1px solid rgba(255,255,255,.03)",marginTop:8}}>
      {[{c:"var(--correct)",l:"Correct"},{c:"var(--close)",l:"Proche"},{c:"var(--wrong)",l:"Incorrect"}].map(x=>(
        <div key={x.l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"var(--text2)"}}>
          <div style={{width:10,height:10,borderRadius:2,background:x.c}}/>{x.l}
        </div>
      ))}
      <span style={{fontSize:10,color:"var(--text3)"}}>↑↓ = valeur / arc chronologique</span>
    </div>
    </>}

    <footer style={{textAlign:"center",padding:"16px 0 4px",fontSize:10,color:"var(--text3)"}}>
      Grand Piecedle — Fan Game 🏴‍☠️ Nouveau défi à minuit
    </footer>
    </div>
  </div>
  </>);
}

const th={padding:"6px 4px",fontSize:8,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--gold3)",background:"var(--bg2)",borderRadius:5,whiteSpace:"nowrap",textAlign:"center"};
const td={padding:"6px 4px",fontSize:10,textAlign:"center",borderRadius:5,color:"var(--text)",transition:"background .3s"};
