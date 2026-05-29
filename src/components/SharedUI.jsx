import { useState, useEffect, useRef } from "react";

// ── Coin icon ──────────────────────────────────────────────────
export const CoinIcon = ({ size = 38 }) => {
  const [err, setErr] = useState(false);
  if (!err) return (
    <img src="/coin.png" alt="coin" onError={() => setErr(true)}
      style={{ width:size, height:size, objectFit:"contain", flexShrink:0,
        filter:"drop-shadow(0 2px 8px #f5c51866)" }}/>
  );
  return (
    <div style={{ width:size, height:size, flexShrink:0, borderRadius:"50%",
      background:"radial-gradient(circle at 38% 32%, #fff3a0, #f5c518 40%, #c8860a 75%, #8a5500)",
      boxShadow:"0 2px 14px #f5c51855", display:"flex", alignItems:"center",
      justifyContent:"center", fontSize:size * 0.42, fontWeight:900, color:"#5a2d00" }}>W</div>
  );
};

// ── Logo ───────────────────────────────────────────────────────
export function LogoCenter() {
  const [err, setErr] = useState(false);
  if (err) return (
    <div style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:26,
      letterSpacing:3, background:"linear-gradient(130deg,#fff 20%,#00D4FF 85%)",
      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>MAVI</div>
  );
  return (
    <img src="/logo.png" alt="MAVI" onError={() => setErr(true)}
      style={{ height:38, objectFit:"contain", filter:"drop-shadow(0 2px 12px #00D4FF55)" }}/>
  );
}

// ── Floating particles ─────────────────────────────────────────
export const Particles = () => {
  const pts = useRef(Array.from({ length:16 }, (_, i) => ({
    id:i, x:Math.random() * 100, delay:Math.random() * 9,
    dur:6 + Math.random() * 8, size:1 + Math.random() * 2, op:0.06 + Math.random() * 0.18,
  }))).current;
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:1 }}>
      {pts.map(p => (
        <div key={p.id} style={{ position:"absolute", left:p.x + "%", bottom:-8,
          width:p.size, height:p.size, borderRadius:"50%", background:"#00D4FF", opacity:p.op,
          animation:`floatUp ${p.dur}s ${p.delay}s infinite linear` }}/>
      ))}
    </div>
  );
};

// ── Profile avatar ─────────────────────────────────────────────
export const ProfileAvatar = ({ character, level, size = 46, onClick }) => {
  const src = character?.circleSrc ?? null;
  const [err, setErr] = useState(false);
  useEffect(() => { setErr(false); }, [src]);

  return (
    <div style={{ position:"relative", flexShrink:0, cursor:onClick ? "pointer" : "default" }} onClick={onClick}>
      <div style={{ width:size, height:size, borderRadius:"50%",
        background:"linear-gradient(135deg,#0d1a3a,#1a2a5a)",
        border:"2px solid #00D4FF55", overflow:"hidden",
        boxShadow:"0 0 0 1px #00D4FF22, 0 4px 12px #00000060" }}>
        {src && !err
          ? <img src={src} alt="avatar" onError={() => setErr(true)}
              style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          : <div style={{ width:"100%", height:"100%", display:"flex",
              alignItems:"center", justifyContent:"center", fontSize:size * 0.46 }}>🐾</div>
        }
      </div>
      <div style={{ position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)",
        background:"linear-gradient(135deg,#0066cc,#00D4FF)", borderRadius:8, padding:"1px 7px",
        fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, color:"#fff",
        letterSpacing:.5, whiteSpace:"nowrap", boxShadow:"0 2px 8px #00D4FF55",
        border:"1px solid #00D4FF44" }}>{level}</div>
    </div>
  );
};

// ── SVG cat fallback ───────────────────────────────────────────
export const CatFallback = ({ scale = 1 }) => (
  <svg viewBox="0 0 200 280" width={260} height={338} xmlns="http://www.w3.org/2000/svg"
    style={{ filter:"drop-shadow(0 20px 40px #00D4FF55)",
      transform:`scale(${scale})`, transition:"transform .15s cubic-bezier(.34,1.56,.64,1)" }}>
    <ellipse cx="100" cy="272" rx="62" ry="11" fill="#00D4FF" opacity="0.2"/>
    <rect x="55" y="148" width="90" height="102" rx="9" fill="#1a1a2e"/>
    <polygon points="100,153 84,212 116,212" fill="#f0f0f0"/>
    <polygon points="100,159 93,202 107,202" fill="#1a1a1a"/>
    <rect x="97" y="192" width="7" height="5" rx="1" fill="#c8960a"/>
    <polygon points="100,153 66,170 79,212" fill="#20203a"/>
    <polygon points="100,153 134,170 121,212" fill="#20203a"/>
    <rect x="28" y="150" width="30" height="82" rx="15" fill="#1a1a2e"/>
    <rect x="142" y="150" width="30" height="82" rx="15" fill="#1a1a2e"/>
    <ellipse cx="43" cy="240" rx="15" ry="11" fill="#333"/>
    <ellipse cx="157" cy="240" rx="15" ry="11" fill="#333"/>
    <rect x="63" y="245" width="30" height="30" rx="7" fill="#0f0f1e"/>
    <rect x="107" y="245" width="30" height="30" rx="7" fill="#0f0f1e"/>
    <path d="M56 228 Q18 216 22 260 Q27 282 52 270" stroke="#4a4a5a" strokeWidth="11" fill="none" strokeLinecap="round"/>
    <rect x="84" y="133" width="32" height="22" rx="6" fill="#3a3a4a"/>
    <ellipse cx="100" cy="108" rx="54" ry="50" fill="#383848"/>
    <polygon points="52,72 38,38 76,66" fill="#383848"/>
    <polygon points="148,72 162,38 124,66" fill="#383848"/>
    <polygon points="54,69 45,48 70,67" fill="#6b4a5a"/>
    <polygon points="146,69 155,48 130,67" fill="#6b4a5a"/>
    <ellipse cx="100" cy="113" rx="42" ry="38" fill="#404050"/>
    <ellipse cx="81" cy="103" rx="14" ry="15" fill="#141428"/>
    <ellipse cx="119" cy="103" rx="14" ry="15" fill="#141428"/>
    <ellipse cx="81" cy="103" rx="11" ry="12" fill="#1878e8"/>
    <ellipse cx="119" cy="103" rx="11" ry="12" fill="#1878e8"/>
    <ellipse cx="81" cy="105" rx="5" ry="8" fill="#08081a"/>
    <ellipse cx="119" cy="105" rx="5" ry="8" fill="#08081a"/>
    <ellipse cx="77" cy="99" rx="3.5" ry="3.5" fill="white" opacity=".9"/>
    <ellipse cx="115" cy="99" rx="3.5" ry="3.5" fill="white" opacity=".9"/>
    <polygon points="100,119 96,126 104,126" fill="#c07878"/>
    <path d="M96,126 Q100,133 104,126" stroke="#a05858" strokeWidth="1.5" fill="none"/>
    <line x1="42" y1="120" x2="87" y2="123" stroke="#777" strokeWidth="1"/>
    <line x1="42" y1="127" x2="87" y2="127" stroke="#777" strokeWidth="1"/>
    <line x1="113" y1="123" x2="158" y2="120" stroke="#777" strokeWidth="1"/>
    <line x1="113" y1="127" x2="158" y2="127" stroke="#777" strokeWidth="1"/>
  </svg>
);

// ── Cat display with image + fallback ─────────────────────────
export const CatDisplay = ({ character, scale = 1 }) => {
  const src = character?.catSrc ?? null;
  const [loaded, setLoaded] = useState(false);
  const [err, setErr]       = useState(false);
  useEffect(() => { setLoaded(false); setErr(false); }, [src]);

  if (!src || err) return <CatFallback scale={scale} />;
  return (
    <div style={{ position:"relative", width:450, height:450,
      transform:`scale(${scale})`, transition:"transform .15s cubic-bezier(.34,1.56,.64,1)",
      filter:"drop-shadow(0 20px 48px #00D4FF55)" }}>
      {!loaded && (
        <div style={{ position:"absolute", inset:0, display:"flex",
          alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:40, height:40, border:"3px solid #00D4FF33",
            borderTopColor:"#00D4FF", borderRadius:"50%",
            animation:"spin 1s linear infinite" }}/>
        </div>
      )}
      <img src={src} alt="cat" onLoad={() => setLoaded(true)} onError={() => setErr(true)}
        style={{ width:"100%", height:"100%", objectFit:"contain",
          opacity:loaded ? 1 : 0, transition:"opacity .4s" }}/>
    </div>
  );
};