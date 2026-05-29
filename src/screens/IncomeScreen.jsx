import { useState, useEffect } from "react";
import { buyPackage, withdrawProfit } from "../services/api";
import { useApp } from "../context/AppContext";
import { CoinIcon } from "../components/SharedUI";
import { PACKAGES, REVENUE_DATA, LAST_REVENUE, THIRTY_DAYS } from "../data/constants";

function getCurrentMonthWindow() {
  const now   = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const end   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
  return { start, end };
}

// ── Chart ──────────────────────────────────────────────────────
function RevenueChart({ soldPct, userPct, userProfit }) {
  const [animated, setAnimated] = useState(false);
  const maxVal = Math.max(...REVENUE_DATA.map(d => d.value));
  const minVal = Math.min(...REVENUE_DATA.map(d => d.value));
  const range  = maxVal - minVal;
  const { end } = getCurrentMonthWindow();

  // days remaining in month
  const [daysLeft, setDaysLeft] = useState(0);
  const [hoursLeft, setHoursLeft] = useState(0);
  useEffect(() => {
    const calc = () => {
      const rem = Math.max(0, end - Date.now());
      setDaysLeft(Math.floor(rem / (1000 * 60 * 60 * 24)));
      setHoursLeft(Math.floor((rem % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [end]);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ margin:"0 16px", background:"#06091888", border:"1px solid #0d1e3a",
      borderRadius:18, padding:"16px 12px 14px", backdropFilter:"blur(10px)" }}>

      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:11, color:"#00D4FF",
        letterSpacing:2, marginBottom:2, textAlign:"center" }}>
        MAVI ADVERTISING REVENUE
      </div>
      <div style={{ fontSize:10, color:"#3a5570", textAlign:"center", marginBottom:12,
        fontFamily:"'Rajdhani',sans-serif", fontWeight:700, letterSpacing:1 }}>
        Latest: 1.5B IRR — May 1405
      </div>

      {/* y-axis + bars */}
      <div style={{ display:"flex", gap:6, height:140 }}>
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between",
          paddingBottom:4, flexShrink:0 }}>
          {["1.5B","1.0B","0.5B","0"].map((l,i) => (
            <div key={i} style={{ fontSize:7, color:"#2a4060",
              fontFamily:"'Orbitron',monospace", textAlign:"right" }}>{l}</div>
          ))}
        </div>
        <div style={{ flex:1, position:"relative" }}>
          {[0,33,66,100].map(pct => (
            <div key={pct} style={{ position:"absolute", left:0, right:0,
              bottom:pct+"%", height:1, background:"#0d1e3a", zIndex:0 }}/>
          ))}
          <div style={{ display:"flex", alignItems:"flex-end", gap:3,
            height:"100%", position:"relative", zIndex:1 }}>
            {REVENUE_DATA.map((d, i) => {
              const heightPct = ((d.value - minVal) / range) * 70 + 15;
              const isLast    = i === REVENUE_DATA.length - 1;
              const isUp      = i > 0 && d.value > REVENUE_DATA[i-1].value;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column",
                  alignItems:"center", height:"100%", justifyContent:"flex-end", gap:2 }}>
                  <div style={{ fontSize:isLast?8:0, color:"#00D4FF",
                    fontFamily:"'Orbitron',monospace", fontWeight:700,
                    whiteSpace:"nowrap", opacity:animated?1:0,
                    transition:`opacity .4s ease ${i*50+300}ms`, height:10 }}>
                    {isLast?"1.5B":""}
                  </div>
                  <div style={{ width:"100%", borderRadius:"3px 3px 2px 2px",
                    background: isLast
                      ? "linear-gradient(180deg,#00D4FF,#0066cc)"
                      : isUp
                        ? "linear-gradient(180deg,#1a6aaa,#0d3a6a)"
                        : "linear-gradient(180deg,#0d2a5a,#091830)",
                    height: animated ? heightPct+"%" : "0%",
                    transition:`height .8s cubic-bezier(.4,0,.2,1) ${i*50}ms`,
                    boxShadow: isLast ? "0 0 10px #00D4FF77" : "none",
                    minHeight:4, position:"relative" }}>
                    {i > 0 && (
                      <div style={{ position:"absolute", top:-10, left:"50%",
                        transform:"translateX(-50%)", fontSize:7,
                        color: d.value >= REVENUE_DATA[i-1].value ? "#4ade80" : "#f87171" }}>
                        {d.value >= REVENUE_DATA[i-1].value ? "▲" : "▼"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* x labels */}
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, paddingLeft:28 }}>
        {REVENUE_DATA.map((d,i) => (
          <div key={i} style={{ flex:1, textAlign:"center", fontSize:6.5, color:"#2a4060",
            fontFamily:"'Orbitron',monospace", fontWeight:600,
            whiteSpace:"nowrap", overflow:"hidden" }}>
            {i===0||i===5||i===10 ? d.label : ""}
          </div>
        ))}
      </div>

      {/* ── سهام فروخته‌شده ── */}
      <div style={{ marginTop:14, borderTop:"1px solid #0d1e3a", paddingTop:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:6 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9,
            color:"#3a6080", letterSpacing:1 }}>MONTHLY SHARES SOLD</div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ fontFamily:"'Orbitron',monospace", fontSize:11,
              fontWeight:700, color: soldPct >= 100 ? "#ff4444" : "#00D4FF" }}>
              {soldPct}%
            </span>
            <span style={{ fontFamily:"'Orbitron',monospace", fontSize:9,
              color:"#3a5070" }}>/ 100%</span>
          </div>
        </div>

        <div style={{ height:12, background:"#060610", borderRadius:6,
          overflow:"hidden", border:"1px solid #0d1a30", position:"relative" }}>
          <div style={{ position:"absolute", left:0, top:0, height:"100%",
            width:soldPct+"%",
            background: soldPct >= 100
              ? "linear-gradient(90deg,#aa0000,#ff4444)"
              : "linear-gradient(90deg,#0044aa,#00D4FF)",
            borderRadius:"6px 0 0 6px",
            boxShadow: soldPct >= 100 ? "0 0 10px #ff444466" : "0 0 10px #00D4FF66",
            transition:"width 1s ease" }}/>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:7, height:7, borderRadius:2,
              background:"linear-gradient(135deg,#0044aa,#00D4FF)" }}/>
            <span style={{ fontSize:9, color:"#3a6080",
              fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>
              {soldPct}% sold
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:7, height:7, borderRadius:2,
              background:"#0a1428", border:"1px solid #1a3060" }}/>
            <span style={{ fontSize:9, color:"#3a6080",
              fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>
              {100 - soldPct}% remaining
            </span>
          </div>
        </div>

        {soldPct >= 100 && (
          <div style={{ marginTop:8, background:"#1a0000", border:"1px solid #ff444433",
            borderRadius:8, padding:"5px 12px", textAlign:"center",
            fontFamily:"'Orbitron',monospace", fontSize:9,
            color:"#ff4444", letterSpacing:1 }}>
            🔒 THIS MONTH'S SHARES ARE FULLY SOLD
          </div>
        )}

        {/* ── تایمر روز شمار ── */}
        <div style={{ marginTop:12, background:"#03080f", border:"1px solid #0d1a30",
          borderRadius:12, padding:"12px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:9, fontFamily:"'Orbitron',monospace",
              color:"#3a6080", letterSpacing:1 }}>PROFIT PAYOUT IN</span>
            <span style={{ fontSize:9, fontFamily:"'Orbitron',monospace",
              color:"#6ab0ff" }}>END OF MONTH</span>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:8 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ background:"#07091a", border:"1px solid #1a3060",
                borderRadius:8, padding:"8px 14px", minWidth:54, textAlign:"center",
                fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:700,
                color: daysLeft <= 3 ? "#f5c518" : "#00D4FF",
                boxShadow: daysLeft <= 3 ? "0 0 12px #f5c51844" : "0 0 8px #00D4FF22" }}>
                {String(daysLeft).padStart(2,"0")}
              </div>
              <span style={{ fontSize:8, color:"#2a4060",
                fontFamily:"'Orbitron',monospace" }}>DAYS</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", paddingBottom:16,
              fontFamily:"'Orbitron',monospace", fontSize:18,
              fontWeight:700, color:"#1a3060" }}>:</div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ background:"#07091a", border:"1px solid #1a3060",
                borderRadius:8, padding:"8px 14px", minWidth:54, textAlign:"center",
                fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:700,
                color:"#00D4FF", boxShadow:"0 0 8px #00D4FF22" }}>
                {String(hoursLeft).padStart(2,"0")}
              </div>
              <span style={{ fontSize:8, color:"#2a4060",
                fontFamily:"'Orbitron',monospace" }}>HOURS</span>
            </div>
          </div>
          {/* month progress */}
          <div style={{ marginTop:10 }}>
            <div style={{ height:3, background:"#0a1428", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:2,
                background:"linear-gradient(90deg,#0055cc,#00D4FF)",
                width: (((Date.now() - getCurrentMonthWindow().start) /
                  (getCurrentMonthWindow().end - getCurrentMonthWindow().start)) * 100) + "%",
                transition:"width 1s ease" }}/>
            </div>
          </div>
        </div>

        {/* ── سهام کاربر ── */}
        <div style={{ marginTop:10, background:"#03080f",
          border:"1px solid " + (userPct > 0 ? "#00D4FF33" : "#0d1a30"),
          borderRadius:12, padding:"12px 14px",
          boxShadow: userPct > 0 ? "0 0 16px #00D4FF0a" : "none" }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9,
            color:"#3a6080", letterSpacing:1, marginBottom:10 }}>YOUR SHAREHOLDING</div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ flex:1, background:"#06091a", border:"1px solid #0d1530",
              borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
              <div style={{ fontSize:9, color:"#3a5070",
                fontFamily:"'Orbitron',monospace", letterSpacing:1, marginBottom:4 }}>
                SHARE
              </div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:20,
                fontWeight:700, color: userPct > 0 ? "#00D4FF" : "#1a3050" }}>
                {userPct}%
              </div>
            </div>
            <div style={{ flex:2, background:"#06091a", border:"1px solid #0d1530",
              borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
              <div style={{ fontSize:9, color:"#3a5070",
                fontFamily:"'Orbitron',monospace", letterSpacing:1, marginBottom:4 }}>
                PROFIT THIS MONTH
              </div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:14,
                fontWeight:700, color: userProfit > 0 ? "#4ade80" : "#1a3050" }}>
                {userProfit.toLocaleString("en-US")}
              </div>
              <div style={{ fontSize:9, color: userProfit > 0 ? "#2a5a3a" : "#1a2a30",
                fontFamily:"'Rajdhani',sans-serif", marginTop:2 }}>IRR</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Countdown در پکیج ─────────────────────────────────────────
function PackageTimer({ endTime, onExpire }) {
  const [rem, setRem] = useState(Math.max(0, endTime - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      const d = Math.max(0, endTime - Date.now());
      setRem(d);
      if (d === 0) onExpire?.();
    }, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const s   = Math.floor(rem / 1000);
  const d   = Math.floor(s / 86400);
  const h   = Math.floor((s % 86400) / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2,"0");

  if (rem === 0) return (
    <div style={{ background:"#042a0a", border:"1px solid #4ade8044",
      borderRadius:10, padding:"10px 14px", textAlign:"center",
      fontFamily:"'Orbitron',monospace", fontSize:11,
      fontWeight:700, color:"#4ade80", letterSpacing:.5,
      animation:"pulseGlow 1.5s ease-in-out infinite" }}>
      🎉 PROFIT READY TO CLAIM
    </div>
  );

  return (
    <div style={{ background:"#03080f", border:"1px solid #0d2040",
      borderRadius:10, padding:"10px 12px" }}>
      <div style={{ fontSize:8, fontFamily:"'Orbitron',monospace",
        color:"#3a6080", letterSpacing:1, marginBottom:6, textAlign:"center" }}>
        TIME UNTIL PROFIT
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:5 }}>
        {[{val:pad(d),lbl:"D"},{val:pad(h),lbl:"H"},
          {val:pad(m),lbl:"M"},{val:pad(sec),lbl:"S"}].map((item,i)=>(
          <div key={i} style={{ display:"flex", flexDirection:"column",
            alignItems:"center", gap:2 }}>
            <div style={{ background:"#07091a", border:"1px solid #1a3060",
              borderRadius:6, padding:"5px 7px", minWidth:34, textAlign:"center",
              fontFamily:"'Orbitron',monospace", fontSize:13, fontWeight:700,
              color:"#00D4FF" }}>{item.val}</div>
            <span style={{ fontSize:7, color:"#2a4060",
              fontFamily:"'Orbitron',monospace" }}>{item.lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────
function WalletSuccessToast({ amount, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position:"fixed", top:70, left:"50%",
      transform:"translateX(-50%)", zIndex:9999, width:"85%", maxWidth:340 }}>
      <div style={{ background:"linear-gradient(135deg,#042a0a,#0a4a18)",
        border:"1px solid #4ade8066", borderRadius:16, padding:"14px 16px",
        boxShadow:"0 8px 32px #00000099, 0 0 24px #4ade8033",
        display:"flex", alignItems:"center", gap:12,
        animation:"slideUp .4s ease" }}>
        <div style={{ width:42, height:42, borderRadius:"50%", flexShrink:0,
          background:"linear-gradient(135deg,#1a5a1a,#4ade80)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:20 }}>💰</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10,
            fontWeight:700, color:"#4ade80", letterSpacing:.5, marginBottom:3 }}>
            سود سهام واریز شد
          </div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:15,
            fontWeight:700, color:"#fff" }}>
            +{amount.toLocaleString("en-US")} IRR
          </div>
          <div style={{ fontSize:10, color:"#4a8a5a",
            fontFamily:"'Rajdhani',sans-serif", marginTop:2 }}>
            به کیف پول درآمد اضافه شد
          </div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none",
          cursor:"pointer", color:"#4ade8088", fontSize:16, padding:4 }}>✕</button>
      </div>
    </div>
  );
}

// ── Package card ───────────────────────────────────────────────
function PackageCard({ pkg, level, coins, onBuy, onWithdraw, purchase, endTime, soldPct }) {
  const owned      = !!purchase;
  const needLvl    = level < pkg.minLevel;
  const needCoin   = !needLvl && coins < pkg.price;
  const soldOut    = !owned && soldPct >= 100;
  const canBuy     = !owned && !needLvl && !needCoin && !soldOut;
  const [expired, setExpired] = useState(owned && Date.now() >= endTime);
  const monthlyProfit = Math.floor(LAST_REVENUE * pkg.profitPct / 100);

  useEffect(() => {
  setExpired(owned && Date.now() >= endTime);
  if (!owned) return;
  const id = setInterval(() => {
    if (Date.now() >= endTime) { setExpired(true); clearInterval(id); }
  }, 1000);
  return () => clearInterval(id);
}, [owned, endTime]);

  return (
    <div style={{ margin:"0 16px 14px", background:"#06091a",
      border:"1px solid "+(owned?pkg.accent+"44":"#0d1a30"),
      borderRadius:18, overflow:"hidden",
      boxShadow:owned?`0 0 20px ${pkg.accent}18`:"none",
      transition:"all .3s" }}>

      {/* accent top */}
      <div style={{ height:3, background:owned
        ? `linear-gradient(90deg,transparent,${pkg.accent},transparent)`
        : "transparent" }}/>

      {/* package image */}
      <div style={{ width:"100%", height:120, overflow:"hidden",
        background:"linear-gradient(135deg,#07091a,#0d1a30)",
        position:"relative" }}>
        <img src={pkg.img} alt={pkg.name}
          onError={e => { e.target.style.display="none"; }}
          style={{ width:"100%", height:"100%", objectFit:"cover", opacity:.85 }}/>
        {/* gradient overlay */}
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(to bottom, transparent 40%, #06091a 100%)" }}/>
        {/* name overlay */}
        <div style={{ position:"absolute", bottom:10, left:16,
          fontFamily:"'Orbitron',monospace", fontSize:13,
          fontWeight:700, color:"#fff",
          textShadow:"0 2px 8px #000" }}>{pkg.name}</div>
        {/* % badge */}
        <div style={{ position:"absolute", top:10, right:12,
          background:"linear-gradient(135deg,#003a0a,#006620)",
          borderRadius:8, padding:"4px 10px",
          fontFamily:"'Orbitron',monospace", fontSize:11,
          fontWeight:700, color:"#4ade80",
          boxShadow:"0 2px 8px #00000066" }}>{pkg.profitPct}% / mo</div>
        {owned && (
          <div style={{ position:"absolute", top:10, left:12,
            background:pkg.accent+"cc", borderRadius:8, padding:"4px 10px",
            fontFamily:"'Orbitron',monospace", fontSize:9,
            fontWeight:700, color:"#fff",
            boxShadow:"0 2px 8px #00000066" }}>✓ ACTIVE</div>
        )}
      </div>

      <div style={{ padding:"12px 16px" }}>
        <div style={{ fontSize:13, color:"#7aaccc",
          fontFamily:"'Rajdhani',sans-serif", fontWeight:700,
          lineHeight:1.6, marginBottom:12 }}>{pkg.desc}</div>

        <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:14 }}>
          <StatRow ok={level >= pkg.minLevel}>
            Min Level:{" "}
            <span style={{ color:level>=pkg.minLevel?"#00D4FF":"#cc4444",
              fontFamily:"'Orbitron',monospace", fontSize:10 }}>{pkg.minLevel}</span>
            <span style={{ color:"#2a4060", marginLeft:6 }}>(yours: {level})</span>
          </StatRow>

          <StatRow ok={owned || coins >= pkg.price}>
            Price:{" "}
            <span style={{ color:(owned||coins>=pkg.price)?"#f5c518":"#cc4444",
              fontFamily:"'Orbitron',monospace", fontSize:10 }}>
              {pkg.price < 10000
                ? pkg.price+" coins"
                : (pkg.price/1e6).toFixed(0)+"M coins"}
            </span>
          </StatRow>

          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <GreenDot/>
            <div style={{ fontSize:11, fontFamily:"'Rajdhani',sans-serif",
              fontWeight:600, color:"#4a6a5a" }}>
              Monthly profit:{" "}
              <span style={{ color:"#4ade80",
                fontFamily:"'Orbitron',monospace", fontSize:10 }}>
                {pkg.profitPct}%
              </span>
              <span style={{ color:"#1a3a2a", marginLeft:4 }}>
                = {monthlyProfit.toLocaleString("en-US")} IRR
              </span>
            </div>
          </div>

          {owned && (
            <PackageTimer
              endTime={endTime}
              onExpire={() => setExpired(true)}
            />
          )}
        </div>

        {owned ? (
          <button onClick={() => expired && onWithdraw(pkg, monthlyProfit)}
            style={{
              width:"100%", padding:"13px", borderRadius:12, border:"none",
              cursor: expired ? "pointer" : "default",
              background: expired
                ? "linear-gradient(135deg,#004a18,#00cc44)"
                : "#0a1428",
              fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700,
              color: expired ? "#fff" : "#1a3a2a", letterSpacing:1,
              boxShadow: expired ? "0 4px 20px #00cc4433" : "none",
              transition:"all .3s",
              animation: expired ? "pulseGlow 1.5s ease-in-out infinite" : "none",
            }}>
            {expired
              ? `💰 CLAIM ${monthlyProfit.toLocaleString("en-US")} IRR`
              : "⏳ Waiting for month end..."}
          </button>
        ) : (
          <button onClick={() => canBuy && onBuy(pkg)}
            style={{
              width:"100%", padding:"13px", borderRadius:12, border:"none",
              cursor: canBuy ? "pointer" : "default",
              background: soldOut
                ? "#1a0a0a"
                : canBuy
                  ? `linear-gradient(135deg,${pkg.border},${pkg.accent})`
                  : needLvl ? "#0a0a1a" : "#0a1428",
              fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700,
              color: soldOut ? "#ff4444"
                : canBuy ? "#fff"
                : needLvl ? "#1a2a3a" : "#2a4060",
              letterSpacing:1,
              boxShadow: canBuy ? `0 4px 20px ${pkg.accent}33` : "none",
              transition:"all .2s",
            }}>
            {soldOut ? "🔒 CAPACITY FULL THIS MONTH"
              : needLvl ? `🔒 Level ${pkg.minLevel} required`
              : needCoin ? "Not enough coins"
              : "BUY SHARES"}
          </button>
        )}
      </div>
    </div>
  );
}

function StatRow({ ok, children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ width:18, height:18, borderRadius:"50%", flexShrink:0,
        background:ok?"linear-gradient(135deg,#003a88,#00D4FF)":"#0d1428",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        {ok
          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          : <svg width="10" height="10" viewBox="0 0 24 24" fill="#2a3a5a">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2z"/>
            </svg>
        }
      </div>
      <div style={{ fontSize:11, fontFamily:"'Rajdhani',sans-serif",
        fontWeight:600, color:ok?"#6ab0ff":"#3a5070" }}>{children}</div>
    </div>
  );
}

function GreenDot() {
  return (
    <div style={{ width:18, height:18, borderRadius:"50%", flexShrink:0,
      background:"linear-gradient(135deg,#002a10,#00441a)",
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="#4ade80">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
      </svg>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function IncomeScreen() {
  const { level, coins, spendCoins, addToWallet } = useApp();
  const [purchases, setPurchases] = useState({});
  const [toast,     setToast]     = useState(null);
  const [soldPct,   setSoldPct]   = useState(65);

  const userPct = Object.keys(purchases).reduce((sum, pkgId) => {
    const pkg = PACKAGES.find(p => p.id === pkgId);
    return sum + (pkg ? pkg.profitPct : 0);
  }, 0);

  const userProfit = Object.keys(purchases).reduce((sum, pkgId) => {
    const pkg = PACKAGES.find(p => p.id === pkgId);
    return sum + (pkg ? Math.floor(LAST_REVENUE * pkg.profitPct / 100) : 0);
  }, 0);

  const handleBuy = async (pkg) => {
  if (level < pkg.minLevel || coins < pkg.price || soldPct >= 100) return;
  try {
    const res = await buyPackage(pkg.id, pkg.price);
    if (res.success) {
      const now = Date.now();
      setPurchases(prev => ({
        ...prev,
        [pkg.id]: { purchaseDate:now, currentCycleStart:now, cyclesCompleted:0, totalCycles:1 },
      }));
      spendCoins(pkg.price);
      setSoldPct(p => Math.min(100, p + pkg.profitPct));
    }
  } catch (err) {
    console.error("Buy package failed:", err);
  }
};

  const handleWithdraw = async (pkg, monthlyProfit) => {
  if (!purchases[pkg.id]) return;
  try {
    const res = await withdrawProfit(pkg.id, monthlyProfit);
    if (res.success) {
      addToWallet(monthlyProfit);
      setToast(monthlyProfit);
      setSoldPct(p => Math.max(0, p - pkg.profitPct));
      setPurchases(prev => { const n={...prev}; delete n[pkg.id]; return n; });
    }
  } catch (err) {
    console.error("Withdraw failed:", err);
  }
};

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"14px 0 20px",
      zIndex:10, position:"relative" }}>

      {toast && <WalletSuccessToast amount={toast} onClose={() => setToast(null)}/>}

      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13, color:"#00D4FF",
        letterSpacing:3, textAlign:"center", marginBottom:16 }}>
        REVENUE & INVESTMENT
      </div>

      <RevenueChart soldPct={soldPct} userPct={userPct} userProfit={userProfit}/>

      <div style={{ display:"flex", alignItems:"center", gap:10, margin:"22px 16px 14px" }}>
        <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,#0d2040)" }}/>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10,
          color:"#3a6080", letterSpacing:2 }}>INVESTMENT PACKAGES</div>
        <div style={{ flex:1, height:1, background:"linear-gradient(90deg,#0d2040,transparent)" }}/>
      </div>

      {PACKAGES.map(pkg => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          level={level}
          coins={coins}
          purchase={purchases[pkg.id] || null}
          onBuy={handleBuy}
          onWithdraw={handleWithdraw}
          endTime={getCurrentMonthWindow().end}
          soldPct={soldPct}
        />
      ))}
    </div>
  );
}