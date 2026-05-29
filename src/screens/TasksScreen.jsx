import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CoinIcon } from "../components/SharedUI";
import { INIT_TASKS } from "../data/constants";

export default function TasksScreen() {
  const { addCoins } = useApp();
  const [tasks, setTasks] = useState(INIT_TASKS);

  const complete = (id, reward) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done:true } : t));
    addCoins(reward);
  };

  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"14px 16px 8px",
      position:"relative", zIndex:10 }}>

      {/* Header with progress */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:11,
          color:"#00D4FF88", letterSpacing:2 }}>DAILY TASKS</div>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#3a5070" }}>
          {done}/{total} DONE
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:3, background:"#060610", borderRadius:2, overflow:"hidden",
        border:"1px solid #101828", marginBottom:16 }}>
        <div style={{ height:"100%", width:(done / total * 100) + "%",
          background:"linear-gradient(90deg,#0055cc,#00D4FF)",
          borderRadius:2, transition:"width .5s ease" }}/>
      </div>

      {tasks.map(t => (
        <div key={t.id} style={{
          display:"flex", alignItems:"center", gap:12,
          background:t.done ? "#08081a" : "#0a0a20",
          border:"1px solid " + (t.done ? "#111128" : "#161634"),
          borderRadius:14, padding:"12px 14px", marginBottom:10,
          opacity:t.done ? .4 : 1, transition:"all .3s",
        }}>
          <div style={{ fontSize:24, width:34, textAlign:"center" }}>{t.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600,
              color:t.done ? "#333" : "#b0c0e0" }}>{t.title}</div>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:3 }}>
              <CoinIcon size={12}/>
              <span style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#f5c518" }}>
                +{t.reward.toLocaleString()}
              </span>
            </div>
          </div>
          {t.done ? (
            <div style={{ width:27, height:27, background:"#1a3a1a", borderRadius:"50%",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#4ade80">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          ) : (
            <button onClick={() => complete(t.id, t.reward)} style={{
              background:"linear-gradient(135deg,#0055cc,#00D4FF)",
              border:"none", borderRadius:9, padding:"7px 13px",
              color:"#fff", fontFamily:"'Rajdhani',sans-serif",
              fontWeight:700, fontSize:12, cursor:"pointer",
            }}>GO</button>
          )}
        </div>
      ))}
    </div>
  );
}
