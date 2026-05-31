import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { CoinIcon } from "../components/SharedUI";
import {
  BUSINESS_DEFS, bizCurrentIncome, bizUpgradeCost,
  bizXPGain, fmtRial,
} from "../data/constants";
import { upgradeBusiness } from "../services/api";

function LevelBar({ current, max, color }) {
  const pct = Math.min(100, (current / max) * 100);
  return (
    <div style={{ height:4, background:"#060610", borderRadius:3,
      overflow:"hidden", border:"1px solid #101828", marginTop:5 }}>
      <div style={{ height:"100%", width:pct+"%", borderRadius:3,
        background:`linear-gradient(90deg,${color}88,${color})`,
        boxShadow:`0 0 6px ${color}66`,
        transition:"width .4s ease" }}/>
    </div>
  );
}

function BusinessCard({ def, level, bizLevel, coins, onUpgrade }) {
  const isUnlocked = level >= def.unlockLevel;
  const isMaxed    = bizLevel >= def.maxLevel;
  const owned      = bizLevel > 0;
  const cost       = bizUpgradeCost(def, bizLevel);
  const canAfford  = coins >= cost;
  const currIncome = bizCurrentIncome(def, bizLevel);
  const nextIncome = (bizLevel < def.maxLevel && def.table?.[bizLevel]) 
  ? def.table[bizLevel][1] 
  : currIncome;
  const xpGain     = bizXPGain(def, bizLevel);

  return (
    <div style={{
      background: owned ? "#08100a" : "#08080f",
      border:`1px solid ${owned ? def.color + "33" : "#161630"}`,
      borderRadius:18, marginBottom:12, overflow:"hidden",
      boxShadow: owned ? `0 0 16px ${def.color}0a` : "none",
      opacity: isUnlocked ? 1 : 0.45,
      transition:"all .3s",
    }}>
      <div style={{ height:3,
        background: owned
          ? `linear-gradient(90deg,transparent,${def.color},transparent)`
          : "transparent" }}/>

      <div style={{ padding:"13px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
          <div style={{ width:50, height:50, borderRadius:14, flexShrink:0,
            background: owned
              ? `linear-gradient(135deg,${def.colorDark},${def.color}22)`
              : "#0e0e20",
            border:`1px solid ${owned ? def.color+"44" : "#1e1e40"}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:26, boxShadow: owned ? `0 0 12px ${def.color}22` : "none" }}>
            {def.emoji}
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
              <span style={{ fontWeight:700, fontSize:13,
                color: owned ? "#c0d8f0" : "#3a4a6a",
                whiteSpace:"nowrap", overflow:"hidden",
                textOverflow:"ellipsis" }}>{def.name}</span>
              {isMaxed && (
                <span style={{ fontSize:8, fontFamily:"'Orbitron',monospace",
                  color:"#f5c518", background:"#3a2a00",
                  padding:"2px 6px", borderRadius:5, letterSpacing:1,
                  flexShrink:0 }}>MAX</span>
              )}
            </div>

            {isUnlocked ? (
              owned ? (
                <>
                  <div style={{ display:"flex", alignItems:"center",
                    justifyContent:"space-between", marginBottom:2 }}>
                    <span style={{ fontFamily:"'Orbitron',monospace", fontSize:9,
                      color:def.color }}>LV {bizLevel} / {def.maxLevel}</span>
                    <span style={{ fontFamily:"'Orbitron',monospace", fontSize:9,
                      color:"#3a5070" }}>{Math.round((bizLevel/def.maxLevel)*100)}%</span>
                  </div>
                  <LevelBar current={bizLevel} max={def.maxLevel} color={def.color}/>
                </>
              ) : (
                <span style={{ fontSize:11, color:"#3a5070" }}>Not purchased yet</span>
              )
            ) : (
              <span style={{ fontSize:10, color:"#3a3a5a",
                fontFamily:"'Orbitron',monospace" }}>
                🔒 Unlocks at Level {def.unlockLevel}
              </span>
            )}
          </div>
        </div>

        {isUnlocked && (
          <div style={{ display:"flex", gap:6, marginBottom:12 }}>
            <div style={{ flex:1, background:"#04050f",
              border:"1px solid #0d1530", borderRadius:10, padding:"8px 10px" }}>
              <div style={{ fontSize:8, color:"#3a5070",
                fontFamily:"'Orbitron',monospace",
                letterSpacing:.5, marginBottom:3 }}>INCOME/DAY</div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <CoinIcon size={12}/>
                <span style={{ fontFamily:"'Orbitron',monospace", fontSize:11,
                  fontWeight:700, color: owned ? "#f5c518" : "#2a3a5a" }}>
                  {owned ? fmtRial(currIncome) : fmtRial(def.table?.[0]?.[1] || 0)}
                </span>
              </div>
              {owned && !isMaxed && (
                <div style={{ fontSize:8, color:"#2a5a2a",
                  fontFamily:"'Orbitron',monospace", marginTop:2 }}>
                  → {fmtRial(nextIncome)} next
                </div>
              )}
            </div>

            <div style={{ flex:1, background:"#04050f",
              border:"1px solid #0d1530", borderRadius:10, padding:"8px 10px" }}>
              <div style={{ fontSize:8, color:"#3a5070",
                fontFamily:"'Orbitron',monospace",
                letterSpacing:.5, marginBottom:3 }}>XP GAIN</div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#a78bfa">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
                </svg>
                <span style={{ fontFamily:"'Orbitron',monospace", fontSize:11,
                  fontWeight:700, color:"#a78bfa" }}>
                  +{isMaxed ? 0 : fmtRial(xpGain)}
                </span>
              </div>
            </div>

            <div style={{ flex:1, background:"#04050f",
              border:"1px solid #0d1530", borderRadius:10, padding:"8px 10px" }}>
              <div style={{ fontSize:8, color:"#3a5070",
                fontFamily:"'Orbitron',monospace",
                letterSpacing:.5, marginBottom:3 }}>
                {isMaxed ? "MAXED" : owned ? "UPGRADE" : "BUY"}
              </div>
              {!isMaxed ? (
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <CoinIcon size={12}/>
                  <span style={{ fontFamily:"'Orbitron',monospace", fontSize:11,
                    fontWeight:700, color: canAfford ? "#00D4FF" : "#cc3333" }}>
                    {fmtRial(cost)}
                  </span>
                </div>
              ) : (
                <span style={{ fontFamily:"'Orbitron',monospace",
                  fontSize:11, color:"#f5c518" }}>✓</span>
              )}
            </div>
          </div>
        )}

        <div style={{ fontSize:11, color:"#2a3a5a",
          fontFamily:"'Rajdhani',sans-serif", fontWeight:600,
          marginBottom: isUnlocked ? 12 : 0,
          lineHeight:1.5 }}>{def.desc}</div>

        {isUnlocked && !isMaxed && (
          <button onClick={() => canAfford && onUpgrade(def)} disabled={!canAfford}
            style={{
              width:"100%", padding:"10px", borderRadius:12, border:"none",
              cursor: canAfford ? "pointer" : "not-allowed",
              background: canAfford
                ? owned
                  ? `linear-gradient(135deg,${def.colorDark},${def.color}99)`
                  : "linear-gradient(135deg,#0a2a0a,#1a6a1a)"
                : "#0a0a1a",
              fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:700,
              color: canAfford ? "#fff" : "#2a2a4a",
              letterSpacing:.5,
              boxShadow: canAfford ? `0 4px 16px ${def.color}22` : "none",
              transition:"all .2s",
            }}>
            {owned ? `UPGRADE — ${fmtRial(cost)}` : `BUY — ${fmtRial(cost)}`}
          </button>
        )}

        {isUnlocked && isMaxed && (
          <div style={{ width:"100%", padding:"10px", borderRadius:12,
            background:"linear-gradient(135deg,#2a1a00,#5a3a00)",
            fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:700,
            color:"#f5c518", letterSpacing:.5, textAlign:"center" }}>
            ✦ FULLY UPGRADED
          </div>
        )}
      </div>
    </div>
  );
}

export default function CityScreen() {
  const { coins, level, spendCoins, setCityIncome, addXP, initialBusinesses } = useApp();

  const [businesses, setBusinesses] = useState(() => {
    const base = Object.fromEntries(BUSINESS_DEFS.map(b => [b.id, 0]));
    return base;
  });

  // لود businesses از سرور
  useEffect(() => {
  try {
    if (initialBusinesses?.length) {
      setBusinesses(prev => {
        const updated = { ...prev };
        initialBusinesses.forEach(b => {
          if (b.id && typeof b.level === 'number') {
            updated[b.id] = b.level;
          }
        });
        return updated;
      });
    }
  } catch(err) {
    console.error("Business load error:", err);
  }
}, [initialBusinesses]);

  // محاسبه درآمد کل
  useEffect(() => {
    const total = BUSINESS_DEFS.reduce((s, d) =>
      s + bizCurrentIncome(d, businesses[d.id]), 0);
    setCityIncome(total);
  }, [businesses]);

  const handleUpgrade = async (def) => {
    const bizLevel = businesses[def.id];
    if (bizLevel >= def.maxLevel) return;
    const cost   = bizUpgradeCost(def, bizLevel);
    if (coins < cost) return;
    const xpGain = bizXPGain(def, bizLevel);

    // آپدیت فوری UI
    spendCoins(cost);
    addXP(xpGain);
    setBusinesses(b => ({ ...b, [def.id]: b[def.id] + 1 }));

    // ذخیره در بک‌اند
    try {
      await upgradeBusiness(def.id, cost, xpGain);
    } catch (err) {
      console.error("Business upgrade failed:", err);
    }
  };

  const totalDailyIncome = BUSINESS_DEFS.reduce((s, d) =>
    s + bizCurrentIncome(d, businesses[d.id]), 0);
  const ownedCount = BUSINESS_DEFS.filter(d => businesses[d.id] > 0).length;
  const maxedCount = BUSINESS_DEFS.filter(d => businesses[d.id] >= d.maxLevel).length;

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"14px 16px 8px",
      position:"relative", zIndex:10 }}>

      <div style={{ display:"flex", alignItems:"center",
        justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:12,
          color:"#00D4FF88", letterSpacing:2 }}>MY BUSINESSES</div>
        <div style={{ display:"flex", gap:6 }}>
          <div style={{ background:"#07091a", border:"1px solid #0d1530",
            borderRadius:8, padding:"4px 10px",
            fontFamily:"'Orbitron',monospace", fontSize:9,
            color:"#3a6080" }}>{ownedCount}/6 owned</div>
          {maxedCount > 0 && (
            <div style={{ background:"#2a1a00", border:"1px solid #f5c51833",
              borderRadius:8, padding:"4px 10px",
              fontFamily:"'Orbitron',monospace", fontSize:9,
              color:"#f5c518" }}>{maxedCount} maxed</div>
          )}
        </div>
      </div>

      <div style={{ background:"linear-gradient(135deg,#07091a,#0a1428)",
        border:"1px solid #0d2040", borderRadius:14, padding:"12px 16px",
        marginBottom:16, display:"flex", alignItems:"center",
        justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:9, color:"#3a5070",
            fontFamily:"'Orbitron',monospace", letterSpacing:1, marginBottom:3 }}>
            TOTAL DAILY INCOME
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <CoinIcon size={18}/>
            <span style={{ fontFamily:"'Orbitron',monospace", fontSize:20,
              fontWeight:700, color:"#f5c518" }}>
              {totalDailyIncome.toLocaleString("en-US")}
            </span>
            <span style={{ fontSize:10, color:"#3a5070",
              fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>/ day</span>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:9, color:"#3a5070",
            fontFamily:"'Orbitron',monospace", letterSpacing:1, marginBottom:3 }}>
            MAX POSSIBLE
          </div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13,
            fontWeight:700, color:"#3a5070" }}>3,000,000</div>
        </div>
      </div>

      {BUSINESS_DEFS.map(def => (
        <BusinessCard
          key={def.id}
          def={def}
          level={level}
          bizLevel={businesses[def.id]}
          coins={coins}
          onUpgrade={handleUpgrade}
        />
      ))}
    </div>
  );
}