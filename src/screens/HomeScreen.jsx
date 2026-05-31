import { useState, useRef, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { use24hTimer } from "../hooks/use24hTimer";
import { CoinIcon, CatDisplay } from "../components/SharedUI";
import { MAX_ENERGY } from "../data/constants";

export default function HomeScreen() {
  const { coins, energy, totalIncome, activeChar, addCoins, useEnergy } = useApp();
  const { rem, ok, claim, fmt } = use24hTimer();
  const [tapped, setTapped]         = useState(false);
  const [tapEffects, setTapEffects] = useState([]);
  const tapId = useRef(0);

  const handleClaim = async () => {
    if (!ok) return;
    claim();
    addCoins(totalIncome);
  };

  const handleTap = useCallback((e) => {
    if (energy <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++tapId.current;
    addCoins(1);
    useEnergy();
    setTapped(true);
    setTimeout(() => setTapped(false), 150);
    setTapEffects(p => [...p, { id, x, y }]);
    setTimeout(() => setTapEffects(p => p.filter(t => t.id !== id)), 700);
  }, [energy, addCoins, useEnergy]);

  const energyPct   = energy / MAX_ENERGY;
  const energyColor = energyPct > 0.5
    ? "linear-gradient(90deg,#0066ff,#00D4FF)"
    : energyPct > 0.2
      ? "linear-gradient(90deg,#cc7700,#ffbb00)"
      : "linear-gradient(90deg,#cc1a1a,#ff4444)";

  return (
    <div style={{ display:"flex", flexDirection:"column",
      height:"100%", overflow:"hidden" }}>

      {/* coin display */}
      <div className="coin-row">
        <CoinIcon size={40}/>
        <div className="coin-number">{coins.toLocaleString("en-US")}</div>
      </div>

      {/* income + claim */}
      <div className="income-wrap">
        <div className="income-card">
          <div style={{ width:28, height:28, borderRadius:8,
            background:"linear-gradient(135deg,#0d260a,#1a4010)",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#4ade80">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
          </div>
          <div>
            <div className="inc-label">Daily Income</div>
            <div className="inc-val">
              {totalIncome > 0
                ? "+" + totalIncome.toLocaleString("en-US")
                : "0"}
            </div>
          </div>
        </div>
        <div className="claim-card">
          <div className="timer-val">{ok ? "READY!" : fmt(rem)}</div>
          <button className="claim-btn" onClick={handleClaim}
            disabled={!ok || totalIncome === 0}>
            CLAIM
          </button>
        </div>
      </div>

      {/* tap area */}
      <div className="cat-area" onClick={handleTap}>
        <div
          className={tapped ? "cat-idle-paused" : "cat-idle"}
          style={{
            transform: tapped ? "scale(0.95)" : "scale(0.9)",
            transformOrigin: "center bottom",
            marginBottom: "-10px",
            transition: "transform 0.15s cubic-bezier(.34,1.56,.64,1)",
          }}>
          <CatDisplay character={activeChar} scale={0.82}/>
        </div>
        {tapEffects.map(t => (
          <div key={t.id} className="tap-effect"
            style={{ left:t.x - 14, top:t.y - 35 }}>+1</div>
        ))}
      </div>

      {/* energy bar */}
<div style={{ padding:"0 0 16px", flexShrink:0, zIndex:10,
  display:"flex", justifyContent:"center" }}>
  <div style={{
    display:"flex", alignItems:"center", gap:8,
    background:"#1a2a4a99",
    backdropFilter:"blur(10px)",
    borderRadius:20, padding:"6px 14px",
    border:"1px solid #ffffff15",
  }}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#00D4FF">
      <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
    </svg>
    <span style={{ fontFamily:"'Orbitron',monospace", fontSize:11,
      fontWeight:700, color:"#ffffff",
      letterSpacing:.5 }}>
      {energy}/{MAX_ENERGY}
    </span>
    {energy === 0 && (
      <span style={{ fontSize:9, color:"#ff4444",
        fontFamily:"'Orbitron',monospace", letterSpacing:.5 }}>
        RECHARGING
      </span>
    )}
  </div>
</div>

    </div>
  );
}