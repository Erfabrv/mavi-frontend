export const CHARACTERS = [
  { id:"lv1",  minLevel:1,  label:"Rookie", catSrc:"/cats/cat_lv1.png",  circleSrc:"/profile/profile_lv1.png",  bigSrc:"/profile-big/big_lv1.png"  },
  { id:"lv5",  minLevel:5,  label:"Scout",  catSrc:"/cats/cat_lv5.png",  circleSrc:"/profile/profile_lv5.png",  bigSrc:"/profile-big/big_lv5.png"  },
  { id:"lv10", minLevel:10, label:"Elite",  catSrc:"/cats/cat_lv10.png", circleSrc:"/profile/profile_lv10.png", bigSrc:"/profile-big/big_lv10.png" },
  { id:"lv20", minLevel:20, label:"Legend", catSrc:"/cats/cat_lv20.png", circleSrc:"/profile/profile_lv20.png", bigSrc:"/profile-big/big_lv20.png" },
];

export const MAX_LEVEL     = 100;
export const MAX_ENERGY    = 500;
export const REFERRAL_CODE = "MAVI-X7K2";
export const THIRTY_DAYS   = 30 * 24 * 60 * 60 * 1000;
export const LAST_REVENUE  = 1500000000;

// ── سیستم لول بازیکن ─────────────────────────────────────────
// لول ۱ = ۱۰۰۰ XP، هر لول +۲۵۰ XP، لول ۱۰۰ = ۲۵۷۵۰ XP
// کل XP برای لول ۱۰۰: 1,337,500
export const xpForNextLevel  = (lvl) => 1000 + (lvl - 1) * 250;
export const totalXpForLevel = (lvl) => {
  if (lvl <= 1) return 0;
  const n = lvl - 1;
  return n * 1000 + (n * (n - 1) / 2) * 250;
};
export const getPlayerLevel = (totalXp) => {
  let lvl = 1;
  while (lvl < MAX_LEVEL && totalXp >= totalXpForLevel(lvl + 1)) lvl++;
  return lvl;
};

// ── جدول آپگرید بیزینس‌ها (مستقیم از اکسل) ──────────────────
// هر بیزینس یه آرایه از ۵۰ آپگرید داره
// هر آیتم: [upgradeCost, incomePerDay, xpGain]

const GROCERY_TABLE = [
  [348,174,209],[376,188,226],[406,203,244],[440,220,263],[474,237,285],
  [768,256,307],[831,277,332],[897,299,358],[969,323,387],[1044,348,418],
  [1128,376,452],[1218,406,488],[1317,439,527],[1422,474,569],[1536,512,614],
  [2765,553,663],[2985,597,717],[3225,645,774],[3480,696,836],[3760,752,903],
  [4060,812,975],[4385,877,1053],[4740,948,1137],[5115,1023,1228],[5525,1105,1326],
  [5970,1194,1432],[6445,1289,1547],[6960,1392,1671],[7520,1504,1804],[8120,1624,1949],
  [8770,1754,2105],[9470,1894,2273],[10230,2046,2455],[11045,2209,2651],[11930,2386,2863],
  [12885,2577,3092],[13915,2783,3340],[15030,3006,3607],[16230,3246,3895],[17530,3506,4207],
  [26502,3786,4544],[28623,4089,4907],[30912,4416,5300],[33390,4770,5724],[36057,5151,6181],
  [38941,5563,6676],[42056,6008,7210],[45423,6489,7787],[49056,7008,8410],[52990,7570,9079],
];

const COFFEE_TABLE = [
  [698,349,279],[752,376,301],[814,407,325],[878,439,351],[948,474,379],
  [1536,512,410],[1659,553,443],[1791,597,478],[1935,645,516],[2091,697,557],
  [2259,753,602],[2439,813,650],[2634,878,702],[2844,948,758],[3072,1024,819],
  [5530,1106,885],[5970,1194,955],[6450,1290,1032],[6965,1393,1114],[7520,1504,1203],
  [8125,1625,1300],[8775,1755,1404],[9475,1895,1516],[10235,2047,1637],[11050,2210,1768],
  [11935,2387,1910],[12890,2578,2063],[13920,2784,2228],[15035,3007,2406],[16240,3248,2598],
  [17540,3508,2806],[18940,3788,3031],[20455,4091,3273],[22095,4419,3535],[23860,4772,3818],
  [25770,5154,4123],[27830,5566,4453],[30055,6011,4809],[32460,6492,5194],[35060,7012,5609],
  [53011,7573,6058],[57246,8178,6543],[61831,8833,7066],[66773,9539,7631],[72114,10302,8242],
  [77889,11127,8901],[84119,12017,9613],[90846,12978,10382],[98112,14016,11213],[105952,15136,12111],
];

const REALESTATE_TABLE = [
  [1046,523,349],[1130,565,376],[1220,610,407],[1318,659,439],[1422,711,474],
  [2304,768,512],[2490,830,553],[2688,896,597],[2904,968,645],[3135,1045,697],
  [3387,1129,753],[3657,1219,813],[3951,1317,878],[4266,1422,948],[4608,1536,1024],
  [8295,1659,1106],[8955,1791,1194],[9675,1935,1290],[10445,2089,1393],[11280,2256,1504],
  [12185,2437,1625],[13160,2632,1755],[14215,2843,1895],[15350,3070,2047],[16580,3316,2210],
  [17905,3581,2387],[19335,3867,2578],[20885,4177,2784],[22555,4511,3007],[24360,4872,3248],
  [26305,5261,3508],[28410,5682,3788],[30685,6137,4091],[33140,6628,4419],[35790,7158,4772],
  [38655,7731,5154],[41745,8349,5566],[45085,9017,6011],[48690,9738,6492],[52585,10517,7012],
  [79513,11359,7573],[85876,12268,8178],[92743,13249,8833],[100163,14309,9539],[108178,15454,10302],
  [116830,16690,11127],[126175,18025,12017],[136269,19467,12978],[147168,21024,14016],[158921,22703,15136],
];

const ELECTRONICS_TABLE = [
  [1742,871,436],[1882,941,471],[2032,1016,508],[2196,1098,549],[2372,1186,593],
  [3840,1280,640],[4149,1383,691],[4479,1493,747],[4839,1613,806],[5226,1742,871],
  [5643,1881,941],[6096,2032,1016],[6582,2194,1097],[7110,2370,1185],[7680,2560,1280],
  [13820,2764,1382],[14925,2985,1493],[16120,3224,1612],[17410,3482,1741],[18805,3761,1880],
  [20310,4062,2031],[21935,4387,2193],[23690,4738,2369],[25585,5117,2558],[27630,5526,2763],
  [29840,5968,2984],[32225,6445,3223],[34805,6961,3481],[37590,7518,3759],[40595,8119,4060],
  [43845,8769,4384],[47350,9470,4735],[51140,10228,5114],[55230,11046,5523],[59650,11930,5965],
  [64420,12884,6442],[69575,13915,6958],[75140,15028,7514],[81155,16231,8115],[87645,17529,8765],
  [132517,18931,9466],[143122,20446,10223],[154574,22082,11041],[166936,23848,11924],[180292,25756,12878],
  [194712,27816,13908],[210294,30042,15021],[227115,32445,16223],[245287,35041,17520],[264922,37846,18921],
];

const MALL_TABLE = [
  [2788,1394,523],[3012,1506,565],[3252,1626,610],[3512,1756,659],[3794,1897,711],
  [6147,2049,768],[6639,2213,830],[7170,2390,896],[7743,2581,968],[8361,2787,1045],
  [9030,3010,1129],[9753,3251,1219],[10533,3511,1317],[11376,3792,1422],[12285,4095,1536],
  [22115,4423,1659],[23885,4777,1791],[25795,5159,1935],[27860,5572,2089],[30085,6017,2256],
  [32495,6499,2437],[35095,7019,2632],[37900,7580,2843],[40935,8187,3070],[44205,8841,3316],
  [47745,9549,3581],[51565,10313,3867],[55690,11138,4177],[60145,12029,4511],[64955,12991,4872],
  [70150,14030,5261],[75765,15153,5682],[81825,16365,6137],[88370,17674,6628],[95440,19088,7158],
  [103075,20615,7731],[111320,22264,8349],[120225,24045,9017],[129845,25969,9738],[140230,28046,10517],
  [212030,30290,11359],[228991,32713,12268],[247310,35330,13249],[267099,38157,14309],[288463,41209,15454],
  [311542,44506,16690],[336469,48067,18025],[363384,51912,19467],[392455,56065,21024],[423850,60550,22703],
];

const HOTEL_TABLE = [
  [3834,1917,536],[4142,2071,579],[4472,2236,625],[4830,2415,675],[5216,2608,729],
  [8451,2817,787],[9126,3042,850],[9858,3286,918],[10644,3548,992],[11496,3832,1071],
  [12417,4139,1157],[13410,4470,1250],[14484,4828,1350],[15642,5214,1458],[16893,5631,1574],
  [30410,6082,1700],[32840,6568,1836],[35465,7093,1983],[38305,7661,2142],[41370,8274,2313],
  [44680,8936,2498],[48255,9651,2698],[52115,10423,2914],[56280,11256,3147],[60785,12157,3398],
  [65650,13130,3670],[70900,14180,3964],[76570,15314,4281],[82695,16539,4624],[89315,17863,4993],
  [96460,19292,5393],[104175,20835,5824],[112510,22502,6290],[121510,24302,6793],[131230,26246,7337],
  [141730,28346,7924],[153065,30613,8558],[165310,33062,9242],[178535,35707,9982],[192820,38564,10780],
  [291543,41649,11643],[314867,44981,12574],[340053,48579,13580],[367262,52466,14667],[396641,56663,15840],
  [428372,61196,17107],[462644,66092,18476],[499653,71379,19954],[539623,77089,21550],[582792,83256,23274],
];

// ── تعریف بیزینس‌ها ───────────────────────────────────────────
export const BUSINESS_DEFS = [
  {
    id:"grocery", name:"Small Grocery Store", emoji:"🛒",
    desc:"A neighborhood grocery — your first step into business.",
    unlockLevel:1, maxLevel:50,
    table: GROCERY_TABLE,
    totalCost:200000, maxIncome:100000, totalXP:120000,
    color:"#4ade80", colorDark:"#1a5a1a",
  },
  {
    id:"coffee", name:"Coffee Shop", emoji:"☕",
    desc:"Trendy café with a loyal customer base.",
    unlockLevel:2, maxLevel:50,
    table: COFFEE_TABLE,
    totalCost:400000, maxIncome:200000, totalXP:160000,
    color:"#f5c518", colorDark:"#5a3a00",
  },
  {
    id:"realestate", name:"Real Estate Agency", emoji:"🏠",
    desc:"Buy, sell, manage properties across the city.",
    unlockLevel:10, maxLevel:50,
    table: REALESTATE_TABLE,
    totalCost:600000, maxIncome:300000, totalXP:200000,
    color:"#60a5fa", colorDark:"#1a3a6a",
  },
  {
    id:"electronics", name:"Electronics Store", emoji:"📱",
    desc:"Latest gadgets, high margins, tech-savvy customers.",
    unlockLevel:25, maxLevel:50,
    table: ELECTRONICS_TABLE,
    totalCost:1000000, maxIncome:500000, totalXP:250000,
    color:"#a78bfa", colorDark:"#3a1a6a",
  },
  {
    id:"mall", name:"Shopping Mall", emoji:"🏬",
    desc:"Massive retail complex — hundreds of stores under one roof.",
    unlockLevel:45, maxLevel:50,
    table: MALL_TABLE,
    totalCost:1600000, maxIncome:800000, totalXP:300000,
    color:"#fb923c", colorDark:"#6a2a00",
  },
  {
    id:"hotel", name:"Luxury Hotel", emoji:"🏨",
    desc:"5-star experience. The pinnacle of your empire.",
    unlockLevel:70, maxLevel:50,
    table: HOTEL_TABLE,
    totalCost:2200000, maxIncome:1100000, totalXP:307500,
    color:"#00D4FF", colorDark:"#003a6a",
  },
];

// ── توابع دسترسی به جدول ─────────────────────────────────────
// bizLevel از ۱ شروع میشه (بعد از اولین خرید)
export const bizUpgradeCost = (def, bizLevel) => {
  const idx = bizLevel; // لول فعلی = ایندکس آپگرید بعدی
  if (idx >= def.table.length) return Infinity;
  return def.table[idx][0];
};

export const bizCurrentIncome = (def, lvl) => {
  if (lvl <= 0) return 0;
  // جمع درآمد همه لول‌ها از ۱ تا lvl
  let total = 0;
  for (let i = 0; i < lvl; i++) {
    total += def.table[i][1];
  }
  return total;
};

export const bizXPGain = (def, bizLevel) => {
  const idx = bizLevel;
  if (idx >= def.table.length) return 0;
  return def.table[idx][2];
};

// برای خرید اول (bizLevel=0) هزینه = ردیف اول جدول
export const bizBuyCost = (def) => def.table[0][0];
export const bizBuyXP   = (def) => def.table[0][2];
export const bizBuyIncome = (def) => def.table[0][1];

// ── backward compat برای CityScreen ──────────────────────────
export const bizIncome      = bizCurrentIncome;
export const bizUpgradeCostCompat = bizUpgradeCost;
export const bizXP          = bizXPGain;
export const bizTotalIncome = bizCurrentIncome;

export const INIT_TASKS = [
  { id:1, title:"Follow on Twitter",     reward:5000,  icon:"🐦", done:false },
  { id:2, title:"Join Telegram Channel", reward:10000, icon:"✈️", done:false },
  { id:3, title:"Invite 3 Friends",      reward:25000, icon:"👥", done:false },
  { id:4, title:"Watch Intro Video",     reward:2000,  icon:"▶️", done:true  },
  { id:5, title:"Connect Wallet",        reward:15000, icon:"👛", done:false },
  { id:6, title:"Share on Instagram",    reward:8000,  icon:"📸", done:false },
];

export const MOCK_REFERRALS = [
  { id:1, name:"Ali_99",    level:7,  earned:12000, joined:"2 days ago" },
  { id:2, name:"Sara_mavi", level:3,  earned:4500,  joined:"5 days ago" },
  { id:3, name:"Reza_x",    level:12, earned:28000, joined:"1 week ago" },
];

export const REVENUE_DATA = [
  { label:"Spr '01", value:180000000  },
  { label:"Sum '01", value:320000000  },
  { label:"Fal '01", value:550000000  },
  { label:"Win '01", value:410000000  },
  { label:"Spr '02", value:680000000  },
  { label:"Sum '02", value:580000000  },
  { label:"Fal '02", value:950000000  },
  { label:"Win '02", value:790000000  },
  { label:"Spr '03", value:1200000000 },
  { label:"Sum '03", value:1050000000 },
  { label:"Apr '05", value:1500000000 },
];

export const PACKAGES = [
  {
    id:"bronze", name:"Bronze Package", img:"/packages/bronze.png",
    minLevel:1,  price:20000000, profitPct:1, durationMonths:1,
    desc:"Entry-level stake — earn 1% of Mavi's monthly ad revenue.",
    accent:"#cd7f32", border:"#7a3b00",
  },
  {
    id:"silver", name:"Silver Package", img:"/packages/silver.png",
    minLevel:25, price:35000000, profitPct:2, durationMonths:1,
    desc:"Standard stake — receive 2% of monthly company revenue.",
    accent:"#c0c0c0", border:"#4a4a6a",
  },
  {
    id:"gold", name:"Gold Package", img:"/packages/gold.png",
    minLevel:45, price:50000000, profitPct:3, durationMonths:1,
    desc:"Premium stake — 3% share of monthly revenue plus priority payout.",
    accent:"#f5c518", border:"#5a3a00",
  },
  {
    id:"diamond", name:"Diamond Package", img:"/packages/diamond.png",
    minLevel:70, price:100000000, profitPct:5, durationMonths:1,
    desc:"Elite stake — 5% of monthly revenue with VIP shareholder status.",
    accent:"#00D4FF", border:"#003a6a",
  },
];

export const getUnlocked = (level) => CHARACTERS.filter(c => level >= c.minLevel);

export const fmtRial = (v) => {
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + "B";
  if (v >= 1_000_000)     return (v / 1_000_000).toFixed(1)     + "M";
  if (v >= 1_000)         return (v / 1_000).toFixed(1)         + "K";
  return v.toString();
};

export const fmtDate     = (d) => new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
export const daysBetween = (a, b) => Math.floor((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));