export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@500;600;700&family=Bebas+Neue&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#020208;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:'Rajdhani',sans-serif;}
  @keyframes floatUp{0%{transform:translateY(0);opacity:.5}85%{opacity:.08}100%{transform:translateY(-680px);opacity:0}}
  @keyframes tapFloat{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-80px) scale(1.2);opacity:0}}
  @keyframes glowOrb{0%,100%{opacity:.3}50%{opacity:.6}}
  @keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes catIdle{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
  @keyframes pulseGlow{0%,100%{box-shadow:0 0 12px #00D4FF44}50%{box-shadow:0 0 28px #00D4FFaa}}

  .shell{
  width:100vw;
  height:100dvh;
  border-radius:0;
  overflow:hidden;
  position:relative;
  display:flex;
  flex-direction:column;
  border:none;
  box-shadow:none;
  animation:slideUp .45s ease;
  background-image:url('/bg.jpg');
  background-size:cover;
  background-position:center top;
  background-color:#03040e;
}
  .shell::before{
    content:'';position:absolute;inset:0;border-radius:inherit;
    background:linear-gradient(180deg,rgba(2,3,14,.72) 0%,rgba(2,3,14,.38) 30%,rgba(2,3,14,.28) 55%,rgba(2,3,14,.82) 100%);
    z-index:0;
  }

  .header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:20px 18px 12px;
  position:sticky;
  top:0;
  z-index:100;
  background:linear-gradient(180deg,#03040eee 0%,#03040e99 100%);
  backdrop-filter:blur(10px);
  flex-shrink:0;
}

.bottom-nav{
  background:#04040ecc;
  border-top:1px solid #0d1226;
  padding:10px 4px 22px;
  display:flex;
  justify-content:space-around;
  position:sticky;
  bottom:0;
  z-index:100;
  backdrop-filter:blur(14px);
  flex-shrink:0;
}
  .logo-wrap{position:absolute;left:50%;transform:translateX(-50%);top:16px;z-index:11;}

  .faq-btn{
    background:#08091ecc;border:1px solid #182040;color:#6080a0;
    font-family:'Rajdhani',sans-serif;font-weight:700;font-size:13px;
    padding:8px 16px;border-radius:11px;cursor:pointer;letter-spacing:1px;
    backdrop-filter:blur(8px);transition:all .2s;
  }
  .faq-btn:hover{border-color:#00D4FF44;color:#00D4FF;}

  .coin-row{display:flex;align-items:center;justify-content:center;gap:10px;padding:6px 20px 2px;position:relative;z-index:10;flex-shrink:0;}
  .coin-number{font-family:'Bebas Neue',monospace;font-size:38px;font-weight:400;color:#fff;letter-spacing:2px;text-shadow:0 0 40px #00D4FF33,0 2px 0 #00000088;line-height:1;}

  .income-wrap{margin:4px 16px 4px;position:relative;z-index:10;display:flex;gap:8px;flex-shrink:0;}
  .income-card{flex:1;background:#07091acc;border:1px solid #101830;border-radius:12px;padding:7px 12px;display:flex;align-items:center;gap:8px;backdrop-filter:blur(10px);}
  .inc-label{font-size:9px;color:#3a5070;font-weight:600;letter-spacing:.5px;text-transform:uppercase;}
  .inc-val{font-family:'Orbitron',monospace;font-size:12px;font-weight:700;color:#f5c518;margin-top:1px;}

  .claim-card{background:#07091acc;border:1px solid #101830;border-radius:12px;padding:7px 10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;backdrop-filter:blur(10px);min-width:100px;}
  .claim-btn{background:linear-gradient(135deg,#0055cc,#00D4FF);border:none;border-radius:8px;padding:6px 14px;color:#fff;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:12px;cursor:pointer;letter-spacing:.5px;width:100%;animation:pulseGlow 2s ease-in-out infinite;}
  .claim-btn:disabled{background:#0d0d22;color:#222;animation:none;cursor:default;}

  .cat-area{flex:1;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;z-index:10;overflow:hidden;min-height:0;}
  .cat-idle{animation:catIdle 3.2s ease-in-out infinite;}
  .cat-idle-paused{animation:none;}
  .tap-effect{position:absolute;pointer-events:none;animation:tapFloat .7s ease-out forwards;font-family:'Orbitron',monospace;font-size:20px;font-weight:700;color:#00D4FF;text-shadow:0 0 12px #00D4FF;z-index:50;}

  .energy-section{padding:0 20px 6px;position:relative;z-index:10;flex-shrink:0;}
  .energy-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;}
  .energy-num{font-family:'Orbitron',monospace;font-size:11px;font-weight:700;color:#00D4FF;}
  .energy-track{height:6px;background:#060610;border-radius:4px;overflow:hidden;border:1px solid #101828;}
  .energy-fill{height:100%;border-radius:4px;transition:width .4s ease,background .6s ease;box-shadow:0 0 8px #00D4FF55;}

  .bottom-nav{background:#04040ecc;border-top:1px solid #0d1226;padding:10px 4px 22px;display:flex;justify-content:space-around;position:relative;z-index:20;backdrop-filter:blur(14px);}
  .nav-btn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 14px;border-radius:14px;cursor:pointer;background:transparent;border:none;transition:background .2s;}
  .nav-btn.active{background:#081428;}
  .nav-label{font-size:11px;font-weight:700;letter-spacing:.5px;}

  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:#101828;border-radius:4px;}
`;