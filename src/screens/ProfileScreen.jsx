import { useState } from "react";
import { selectCharacter, buyCharacter } from "../services/api";
import { useApp } from "../context/AppContext";
import { CoinIcon } from "../components/SharedUI";
import { MOCK_REFERRALS, REFERRAL_CODE, MAX_LEVEL } from "../data/constants";
import { ALL_CHARACTERS } from "../data/characters";

const TAG_COLORS = {
  Basic:   { bg:"#1a2a4a", color:"#6ab0ff" },
  Pro:     { bg:"#1a3a1a", color:"#4ade80" },
  Elite:   { bg:"#3a1a00", color:"#f5c518" },
  Legend:  { bg:"#2a0a0a", color:"#f87171" },
  Special: { bg:"#2a1a4a", color:"#a78bfa" },
};

// ── Characters screen ──────────────────────────────────────────
function CharactersScreen({ onBack }) {
  const { level, coins, activeCharId, setActiveCharId, spendCoins } = useApp();
  const { purchasedChars, setPurchasedChars } = useApp();
  const [purchased, setPurchased] = useState(purchasedChars || []);
  const [previewId, setPreviewId] = useState(activeCharId);
  const [bigErr,    setBigErr]    = useState(false);

  const previewChar = ALL_CHARACTERS.find(c => c.id === previewId) || ALL_CHARACTERS[0];

  const isUnlocked = (ch) => {
    if (ch.special) return purchased.includes(ch.id);
    return level >= ch.unlockLevel;
  };

  const unlocked = isUnlocked(previewChar);
  const isActive = activeCharId === previewChar.id;
  const tagStyle = TAG_COLORS[previewChar.tag] || TAG_COLORS.Basic;

  const handleSelect = async () => {
  if (!isUnlocked(previewChar)) return;
  setActiveCharId(previewChar.id);
  try {
    await selectCharacter(previewChar.id);
  } catch (err) {
    console.error("Select character failed:", err);
  }
};

  const handleBuy = async () => {
  if (!previewChar.price || coins < previewChar.price) return;
  try {
    const res = await buyCharacter(previewChar.id, previewChar.price);
    if (res.success) {
      spendCoins(previewChar.price);
      setPurchased(p => [...p, previewChar.id]);
      setPurchasedChars(p => [...p, previewChar.id]);
      setActiveCharId(previewChar.id);
    }
  } catch (err) {
    console.error("Buy character failed:", err);
  }
};

  const CharItem = ({ ch }) => {
    const unl   = isUnlocked(ch);
    const isSel = previewId === ch.id;
    const isAct = activeCharId === ch.id;
    const tc    = TAG_COLORS[ch.tag] || TAG_COLORS.Basic;
    const [err, setErr] = useState(false);

    return (
      <div onClick={() => { setPreviewId(ch.id); setBigErr(false); }}
        style={{ borderRadius:14, overflow:"hidden", cursor:"pointer",
          border:"2px solid " + (isSel ? "#00D4FF" : isAct ? "#00D4FF44" : "#0d1a30"),
          background: isSel ? "#091828" : "#07091a",
          boxShadow: isSel ? "0 0 16px #00D4FF44" : "none",
          transition:"all .2s", position:"relative", aspectRatio:"1" }}>

        <div style={{ position:"absolute", top:5, left:5, zIndex:2,
          background:tc.bg, borderRadius:5, padding:"1px 5px",
          fontSize:7, fontFamily:"'Orbitron',monospace",
          fontWeight:700, color:tc.color, letterSpacing:.5 }}>
          {ch.tag}
        </div>

        {isAct && (
          <div style={{ position:"absolute", top:5, right:5, zIndex:2,
            width:8, height:8, borderRadius:"50%",
            background:"#00D4FF", boxShadow:"0 0 6px #00D4FF" }}/>
        )}

        {!err
          ? <img src={ch.bigSrc} alt={ch.name}
              onError={() => setErr(true)}
              style={{ width:"100%", height:"100%", objectFit:"cover",
                filter: unl ? "none" : "brightness(0.35) saturate(0)" }}/>
          : <div style={{ width:"100%", height:"100%", display:"flex",
              alignItems:"center", justifyContent:"center", fontSize:32 }}>
              {unl ? "🐱" : "🔒"}
            </div>
        }

        <div style={{ position:"absolute", bottom:0, left:0, right:0,
          background:"linear-gradient(transparent,#000000cc)",
          padding:"14px 6px 5px", textAlign:"center",
          fontFamily:"'Orbitron',monospace", fontSize:7,
          fontWeight:700, color: unl ? "#ddeeff" : "#3a4a6a",
          letterSpacing:.5 }}>{ch.name}</div>
      </div>
    );
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column",
      overflow:"hidden", position:"relative", zIndex:10 }}>

      {/* header */}
      <div style={{ display:"flex", alignItems:"center", gap:10,
        padding:"14px 16px 0", flexShrink:0 }}>
        <button onClick={onBack}
          style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#00D4FF">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <div style={{ flex:1, fontFamily:"'Orbitron',monospace", fontSize:13,
          color:"#ddeeff", fontWeight:700, letterSpacing:1 }}>
          {previewChar.name}
        </div>
        <div style={{ background:tagStyle.bg, borderRadius:8,
          padding:"3px 10px", fontFamily:"'Orbitron',monospace",
          fontSize:9, fontWeight:700, color:tagStyle.color,
          letterSpacing:1 }}>{previewChar.tag}</div>
      </div>

      {/* big preview */}
      <div style={{ flex:"0 0 280px", position:"relative",
        display:"flex", alignItems:"center", justifyContent:"center",
        background:"linear-gradient(180deg,#0a1a3a 0%,#03040e 100%)",
        overflow:"hidden", flexShrink:0 }}>

        {unlocked && (
          <div style={{ position:"absolute", width:260, height:260,
            borderRadius:"50%",
            background:"radial-gradient(circle,#00D4FF18 0%,transparent 70%)",
            top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            pointerEvents:"none" }}/>
        )}

        {!bigErr
          ? <img src={previewChar.bigSrc} alt={previewChar.name}
              onError={() => setBigErr(true)}
              style={{ height:240, objectFit:"contain",
                filter: unlocked
                  ? "drop-shadow(0 20px 40px #00D4FF44)"
                  : "brightness(0.35) saturate(0)",
                transition:"all .3s" }}/>
          : <div style={{ fontSize:80 }}>🐱</div>
        }

        {!unlocked && (
          <div style={{ position:"absolute", bottom:14, left:0, right:0,
            display:"flex", justifyContent:"center" }}>
            <div style={{ background:"#00000099", border:"1px solid #1a2a4a",
              borderRadius:10, padding:"5px 14px",
              fontFamily:"'Orbitron',monospace", fontSize:9,
              color:"#4a6a8a", letterSpacing:1.5 }}>
              {previewChar.special
                ? "🔒 " + previewChar.price?.toLocaleString("en-US") + " COINS"
                : "🔒 LEVEL " + previewChar.unlockLevel}
            </div>
          </div>
        )}
      </div>

      {/* action button */}
      <div style={{ padding:"10px 16px", flexShrink:0 }}>
        {unlocked ? (
          isActive ? (
            <div style={{ width:"100%", padding:"12px", borderRadius:12,
              textAlign:"center",
              background:"linear-gradient(135deg,#0055cc,#00D4FF)",
              fontFamily:"'Orbitron',monospace", fontSize:11,
              fontWeight:700, color:"#fff", letterSpacing:1 }}>
              ✓ ACTIVE
            </div>
          ) : (
            <button onClick={handleSelect} style={{ width:"100%", padding:"12px",
              borderRadius:12, border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#003a88,#00D4FF)",
              fontFamily:"'Orbitron',monospace", fontSize:11,
              fontWeight:700, color:"#fff", letterSpacing:1 }}>
              SELECT
            </button>
          )
        ) : previewChar.special ? (
          <button onClick={handleBuy} disabled={coins < previewChar.price}
            style={{ width:"100%", padding:"12px", borderRadius:12, border:"none",
              cursor: coins >= previewChar.price ? "pointer" : "default",
              background: coins >= previewChar.price
                ? "linear-gradient(135deg,#3a1a6a,#a78bfa)"
                : "#0a1428",
              fontFamily:"'Orbitron',monospace", fontSize:11,
              fontWeight:700, letterSpacing:1,
              color: coins >= previewChar.price ? "#fff" : "#2a3a5a",
              display:"flex", alignItems:"center",
              justifyContent:"center", gap:8 }}>
            <CoinIcon size={14}/>
            {coins >= previewChar.price
              ? "BUY — " + previewChar.price.toLocaleString("en-US")
              : "NOT ENOUGH COINS"}
          </button>
        ) : (
          <div style={{ width:"100%", padding:"12px", borderRadius:12,
            background:"#0a1428", fontFamily:"'Orbitron',monospace",
            fontSize:11, fontWeight:700, color:"#2a3a5a",
            textAlign:"center", letterSpacing:1 }}>
            🔒 REACH LEVEL {previewChar.unlockLevel}
          </div>
        )}
      </div>

      {/* grid */}
      <div style={{ flex:1, overflowY:"auto", padding:"4px 16px 20px" }}>

        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9,
          color:"#3a6080", letterSpacing:1.5, marginBottom:10 }}>
          LEVEL REWARDS
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)",
          gap:8, marginBottom:20 }}>
          {ALL_CHARACTERS.filter(c => !c.special).map(ch => (
            <CharItem key={ch.id} ch={ch}/>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9,
            color:"#a78bfa", letterSpacing:1.5 }}>✦ VIP CHARACTERS</div>
          <div style={{ flex:1, height:1,
            background:"linear-gradient(90deg,#a78bfa44,transparent)" }}/>
        </div>

        <div style={{ background:"#07091a", border:"1px solid #a78bfa22",
          borderRadius:12, padding:"8px 12px", marginBottom:12,
          fontSize:11, color:"#4a3a6a",
          fontFamily:"'Rajdhani',sans-serif", fontWeight:600, lineHeight:1.6 }}>
          کاراکترهای VIP رو در هر لولی میتونی با سکه خریداری کنی.
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {ALL_CHARACTERS.filter(c => c.special).map(ch => (
            <CharItem key={ch.id} ch={ch}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Wallet screen ──────────────────────────────────────────────
function WalletScreen({ onBack }) {
  const { walletBalance, walletHistory } = useApp();
  const [cardNumber, setCardNumber] = useState("");
  const [cardOwner,  setCardOwner]  = useState("");
  const [submitted,  setSubmitted]  = useState(false);

  const handleSubmit = () => {
    if (!cardNumber || !cardOwner || walletBalance === 0) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"14px 16px",
      zIndex:10, position:"relative" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
        <button onClick={onBack}
          style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#00D4FF">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13,
          color:"#00D4FF", letterSpacing:2 }}>کیف پول</div>
      </div>

      <div style={{ background:"linear-gradient(135deg,#07091a,#0d1a3a)",
        border:"1px solid #00D4FF33", borderRadius:20, padding:24,
        marginBottom:16, textAlign:"center", boxShadow:"0 0 30px #00D4FF11" }}>
        <div style={{ fontSize:11, color:"#3a5070", letterSpacing:2,
          fontFamily:"'Orbitron',monospace", marginBottom:10 }}>موجودی کیف پول</div>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:28,
          fontWeight:700, color:"#00D4FF", marginBottom:4 }}>
          {walletBalance.toLocaleString("en-US")}
        </div>
        <div style={{ fontSize:12, color:"#3a5070",
          fontFamily:"'Rajdhani',sans-serif" }}>ریال</div>
      </div>

      {walletHistory.length > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10,
            color:"#3a5070", letterSpacing:1, marginBottom:10 }}>
            تاریخچه برداشت‌ها
          </div>
          {walletHistory.slice().reverse().map(h => (
            <div key={h.id} style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", background:"#07091a",
              border:"1px solid #0d1530", borderRadius:12,
              padding:"10px 14px", marginBottom:8 }}>
              <div style={{ fontSize:11, color:"#3a5070",
                fontFamily:"'Orbitron',monospace" }}>
                {new Date(h.date).toLocaleDateString("fa-IR")}
              </div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:12,
                fontWeight:700, color:"#4ade80" }}>
                +{h.amount.toLocaleString("en-US")} ریال
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background:"#07091a", border:"1px solid #0d1530",
        borderRadius:18, padding:18 }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10,
          color:"#3a5070", letterSpacing:1, marginBottom:14 }}>
          ثبت درخواست برداشت
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, color:"#3a5070", marginBottom:6,
            fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>شماره کارت</div>
          <input type="text" placeholder="xxxx - xxxx - xxxx"
            maxLength={16} value={cardNumber}
            onChange={e => {
              let v = e.target.value.replace(/\D/g,"").slice(0,12);
              v = v.match(/.{1,4}/g)?.join(" - ") || v;
              setCardNumber(v);
            }}
            style={{ width:"100%", background:"#04050f",
              border:"1px solid #0d1a30", borderRadius:10,
              padding:"12px 14px", color:"#ddeeff",
              fontFamily:"'Orbitron',monospace", fontSize:14,
              letterSpacing:2, outline:"none", textAlign:"center",
              boxSizing:"border-box" }}/>
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:"#3a5070", marginBottom:6,
            fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>نام صاحب کارت</div>
          <input type="text" placeholder="نام و نام خانوادگی"
            value={cardOwner} onChange={e => setCardOwner(e.target.value)}
            style={{ width:"100%", background:"#04050f",
              border:"1px solid #0d1a30", borderRadius:10,
              padding:"12px 14px", color:"#ddeeff",
              fontFamily:"'Rajdhani',sans-serif", fontSize:15,
              outline:"none", textAlign:"right", direction:"rtl",
              boxSizing:"border-box" }}/>
        </div>
        <div style={{ background:"#03080f", border:"1px solid #0d2040",
          borderRadius:12, padding:"10px 14px", marginBottom:16,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:10, color:"#3a5070",
            fontFamily:"'Orbitron',monospace", letterSpacing:1 }}>مبلغ برداشت</span>
          <span style={{ fontFamily:"'Orbitron',monospace", fontSize:12,
            fontWeight:700, color:"#f5c518" }}>
            {walletBalance.toLocaleString("en-US")} ریال
          </span>
        </div>
        <button onClick={handleSubmit}
          disabled={!cardNumber || !cardOwner || walletBalance === 0}
          style={{ width:"100%", padding:"13px", borderRadius:12, border:"none",
            background:(!cardNumber || !cardOwner || walletBalance === 0)
              ? "#0a1428"
              : submitted
                ? "linear-gradient(135deg,#1a5a1a,#2ade2a)"
                : "linear-gradient(135deg,#0055cc,#00D4FF)",
            fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700,
            color:(!cardNumber || !cardOwner || walletBalance === 0) ? "#1a3a2a" : "#fff",
            letterSpacing:1,
            cursor:(!cardNumber || !cardOwner || walletBalance === 0) ? "default" : "pointer",
            transition:"all .3s" }}>
          {submitted ? "✓ درخواست ثبت شد" : "ثبت درخواست برداشت"}
        </button>
      </div>
    </div>
  );
}

// ── Referrals screen ───────────────────────────────────────────
function ReferralsScreen({ onBack }) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText(REFERRAL_CODE).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };
  const totalEarned = MOCK_REFERRALS.reduce((s, r) => s + r.earned, 0);

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"14px 16px",
      zIndex:10, position:"relative" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
        <button onClick={onBack}
          style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#00D4FF">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13,
          color:"#00D4FF", letterSpacing:2 }}>REFERRALS</div>
      </div>

      <div style={{ background:"#07091a", border:"1px solid #0d2040",
        borderRadius:16, padding:18, marginBottom:14 }}>
        <div style={{ fontSize:10, color:"#3a5070", letterSpacing:1, marginBottom:8 }}>
          YOUR REFERRAL CODE
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ flex:1, background:"#04050f",
            border:"1px solid #0d1a30", borderRadius:10,
            padding:"10px 14px", fontFamily:"'Orbitron',monospace",
            fontSize:16, fontWeight:700, color:"#00D4FF",
            letterSpacing:3 }}>{REFERRAL_CODE}</div>
          <button onClick={copyCode} style={{
            background:copied
              ? "linear-gradient(135deg,#1a5a1a,#2ade2a)"
              : "linear-gradient(135deg,#0055cc,#00D4FF)",
            border:"none", borderRadius:10, padding:"10px 16px",
            cursor:"pointer", color:"#fff",
            fontFamily:"'Rajdhani',sans-serif", fontWeight:700,
            fontSize:13, whiteSpace:"nowrap", transition:"all .3s" }}>
            {copied ? "COPIED ✓" : "COPY"}
          </button>
        </div>
        <div style={{ fontSize:11, color:"#3a5070", marginTop:10, lineHeight:1.6 }}>
          Each referral earns you{" "}
          <span style={{ color:"#f5c518", fontFamily:"'Orbitron',monospace",
            fontSize:10 }}>+5,000</span>{" "}coins when they join.
        </div>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <div style={{ flex:1, background:"#07091a",
          border:"1px solid #0d1530", borderRadius:12, padding:"12px 14px" }}>
          <div style={{ fontSize:10, color:"#3a5070", letterSpacing:.5 }}>TOTAL REFS</div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:20,
            fontWeight:700, color:"#00D4FF", marginTop:3 }}>
            {MOCK_REFERRALS.length}
          </div>
        </div>
        <div style={{ flex:1, background:"#07091a",
          border:"1px solid #0d1530", borderRadius:12, padding:"12px 14px" }}>
          <div style={{ fontSize:10, color:"#3a5070", letterSpacing:.5 }}>TOTAL EARNED</div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:14,
            fontWeight:700, color:"#f5c518", marginTop:3 }}>
            {totalEarned.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10,
        color:"#3a5070", letterSpacing:1, marginBottom:10 }}>REFERRED USERS</div>
      {MOCK_REFERRALS.map(r => (
        <div key={r.id} style={{ display:"flex", alignItems:"center", gap:12,
          background:"#07091a", border:"1px solid #0d1530",
          borderRadius:14, padding:"11px 14px", marginBottom:9 }}>
          <div style={{ width:38, height:38, borderRadius:"50%",
            background:"linear-gradient(135deg,#0d1a3a,#1a2a5a)",
            border:"1.5px solid #00D4FF33",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"'Orbitron',monospace", fontSize:10,
            fontWeight:700, color:"#00D4FF", flexShrink:0 }}>{r.level}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:13, color:"#b0c8e8" }}>{r.name}</div>
            <div style={{ fontSize:11, color:"#3a5070", marginTop:2 }}>{r.joined}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <CoinIcon size={12}/>
            <span style={{ fontFamily:"'Orbitron',monospace", fontSize:11,
              color:"#f5c518" }}>{r.earned.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main profile ───────────────────────────────────────────────
export default function ProfileScreen() {
  const { level, xpInLevel, xpNeeded, coins, activeCharId, walletBalance } = useApp();
  const [section, setSection] = useState("main");
  const [imgErr,  setImgErr]  = useState(false);

  const activeChar = ALL_CHARACTERS.find(c => c.id === activeCharId) || ALL_CHARACTERS[0];
  const isMaxLevel = level >= MAX_LEVEL;

  if (section === "characters") return <CharactersScreen onBack={() => setSection("main")}/>;
  if (section === "referrals")  return <ReferralsScreen  onBack={() => setSection("main")}/>;
  if (section === "wallet")     return <WalletScreen     onBack={() => setSection("main")}/>;

  return (
    <div style={{ flex:1, overflowY:"auto", zIndex:10, position:"relative" }}>
      <div style={{ display:"flex", flexDirection:"column",
        alignItems:"center", padding:"20px 16px 18px" }}>

        {/* avatar — بزرگ از profileSrc */}
        <div style={{ width:110, height:110, borderRadius:"50%", overflow:"hidden",
          border:"2.5px solid #00D4FF55",
          background:"linear-gradient(135deg,#0d1a3a,#1a2a5a)",
          boxShadow:"0 0 30px #00D4FF22, 0 8px 24px #00000080",
          marginBottom:12 }}>
          {!imgErr
            ? <img
                src={activeChar?.profileSrc || activeChar?.bigSrc}
                alt="avatar"
                style={{ width:"100%", height:"100%", objectFit:"cover" }}
                onError={() => setImgErr(true)}/>
            : <div style={{ width:"100%", height:"100%", display:"flex",
                alignItems:"center", justifyContent:"center", fontSize:52 }}>🐱</div>
          }
        </div>

        <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700,
          fontSize:20, color:"#ddeeff", letterSpacing:1, marginBottom:4 }}>ERFAN</div>

        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ background:"linear-gradient(135deg,#0066cc,#00D4FF)",
            borderRadius:10, padding:"3px 12px",
            fontFamily:"'Orbitron',monospace", fontSize:11,
            fontWeight:700, color:"#fff", letterSpacing:1 }}>
            {isMaxLevel ? "MAX" : "LV"} {level}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <CoinIcon size={14}/>
            <span style={{ fontFamily:"'Orbitron',monospace", fontSize:11,
              color:"#f5c518" }}>{coins.toLocaleString("en-US")}</span>
          </div>
        </div>

        {/* xp bar */}
        <div style={{ width:"100%", maxWidth:280, marginBottom:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontFamily:"'Orbitron',monospace", fontSize:9,
              color:"#3a5070", letterSpacing:1 }}>
              XP • LV {level}{isMaxLevel ? " (MAX)" : ""}
            </span>
            <span style={{ fontFamily:"'Orbitron',monospace", fontSize:9,
              color:"#00D4FF" }}>
              {isMaxLevel ? "MAX LEVEL"
                : `${xpInLevel.toLocaleString()} / ${xpNeeded.toLocaleString()}`}
            </span>
          </div>
          <div style={{ height:8, background:"#060610", borderRadius:5,
            overflow:"hidden", border:"1px solid #0d1530" }}>
            <div style={{ height:"100%",
              width: isMaxLevel ? "100%" : (xpInLevel / xpNeeded * 100) + "%",
              background: isMaxLevel
                ? "linear-gradient(90deg,#f5c518,#ffdd66)"
                : "linear-gradient(90deg,#0055cc,#00D4FF,#66eeff)",
              borderRadius:5, transition:"width .6s ease",
              boxShadow: isMaxLevel ? "0 0 10px #f5c51866" : "0 0 10px #00D4FF66" }}/>
          </div>
          <div style={{ textAlign:"center", marginTop:5,
            fontFamily:"'Orbitron',monospace", fontSize:9,
            color:"#3a5070", letterSpacing:.5 }}>
            {isMaxLevel ? "✦ MAXIMUM LEVEL REACHED"
              : `${(xpNeeded - xpInLevel).toLocaleString()} XP TO NEXT LEVEL`}
          </div>
        </div>
      </div>

      {/* menu */}
      <div style={{ padding:"0 16px" }}>
        {[
          { key:"wallet",     icon:"👛", label:"کیف پول",
            sub: walletBalance.toLocaleString("en-US") + " ریال" },
          { key:"characters", icon:"🎭", label:"My Characters",
            sub: ALL_CHARACTERS.filter(c => !c.special && level >= c.unlockLevel).length + " unlocked" },
          { key:"referrals",  icon:"👥", label:"Referrals",
            sub: MOCK_REFERRALS.length + " friends joined" },
        ].map(item => (
          <button key={item.key} onClick={() => setSection(item.key)} style={{
            width:"100%", display:"flex", alignItems:"center", gap:14,
            background:"#07091a", border:"1px solid #0d1530",
            borderRadius:16, padding:"14px 16px", marginBottom:10,
            cursor:"pointer", transition:"all .2s", textAlign:"left" }}>
            <div style={{ width:44, height:44, borderRadius:12,
              background:"linear-gradient(135deg,#0a1228,#0d2040)",
              border:"1px solid #1a3060", display:"flex",
              alignItems:"center", justifyContent:"center",
              fontSize:22, flexShrink:0 }}>{item.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14,
                color:"#b0c8e8" }}>{item.label}</div>
              <div style={{ fontSize:11, color:"#3a5070",
                marginTop:2 }}>{item.sub}</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#3a5070">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}