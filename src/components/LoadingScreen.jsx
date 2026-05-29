import { useState, useEffect } from "react";

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const steps = [
      { target:20,  delay:100  },
      { target:45,  delay:500  },
      { target:68,  delay:900  },
      { target:85,  delay:1400 },
      { target:100, delay:1900 },
    ];
    const timers = steps.map(({ target, delay }) =>
      setTimeout(() => setProgress(target), delay)
    );
    const finish = setTimeout(() => {
      setDone(true);
      setTimeout(onDone, 500);
    }, 2500);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, []);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      display:"flex", alignItems:"center", justifyContent:"center",
      backgroundColor:"#020208",
    }}>
      <div style={{
        width:390, height:844,
        borderRadius:44,
        overflow:"hidden",
        position:"relative",
        backgroundImage:"url('/loading-bg.jpg')",
        backgroundSize:"cover",
        backgroundPosition:"center",
        backgroundColor:"#03040e",
        display:"flex",
        flexDirection:"column",
        justifyContent:"flex-end",
        border:"1px solid #0e1a30",
        boxShadow:"0 0 80px #00D4FF0f, 0 60px 160px #00000099",
        transition:"opacity .5s ease",
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "all",
      }}>
        {/* dark overlay */}
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to top, #000000dd 0%, #000000aa 30%, transparent 60%)",
          borderRadius:"inherit",
        }}/>

        {/* bottom content */}
        <div style={{ position:"relative", zIndex:2, padding:"0 32px 64px" }}>
          {/* logo / title */}
          <div style={{
            textAlign:"center", marginBottom:32,
            fontFamily:"'Orbitron',monospace", fontWeight:900,
            fontSize:36, letterSpacing:6,
            background:"linear-gradient(130deg,#fff 20%,#00D4FF 85%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>MAVI</div>

          {/* progress bar */}
          <div style={{
            height:4, background:"#ffffff18", borderRadius:99,
            overflow:"hidden", boxShadow:"0 0 0 1px #ffffff0a",
          }}>
            <div style={{
              height:"100%", borderRadius:99,
              background:"linear-gradient(90deg,#0055cc,#00aaff,#66e0ff)",
              width: progress + "%",
              transition:"width .45s cubic-bezier(.4,0,.2,1)",
              boxShadow:"0 0 14px #00aaffaa, 0 0 4px #00D4FFcc",
            }}/>
          </div>

          {/* percent */}
          <div style={{
            marginTop:10, textAlign:"center",
            fontFamily:"'Orbitron',monospace", fontSize:11,
            fontWeight:600, color:"#ffffff55", letterSpacing:3,
          }}>{progress}%</div>
        </div>
      </div>
    </div>
  );
}