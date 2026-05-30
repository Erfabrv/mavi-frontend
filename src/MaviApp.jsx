import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import LoadingScreen from "./components/LoadingScreen";
import { Particles, ProfileAvatar, LogoCenter } from "./components/SharedUI";
import HomeScreen    from "./screens/HomeScreen";
import CityScreen    from "./screens/CityScreen";
import IncomeScreen  from "./screens/IncomeScreen";
import TasksScreen   from "./screens/TasksScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { CSS } from "./styles";

const IC = {
  home:   (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a?"#00D4FF":"#3a4a6a"}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  city:   (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a?"#00D4FF":"#3a4a6a"}><path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/></svg>,
  tasks:  (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a?"#00D4FF":"#3a4a6a"}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  income: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a?"#00D4FF":"#3a4a6a"}><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>,
  profile:(a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a?"#00D4FF":"#3a4a6a"}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>,
};

const TABS = [
  { id:"home",    label:"Home",    ic:IC.home    },
  { id:"city",    label:"Business",ic:IC.city    },
  { id:"income",  label:"Revenue", ic:IC.income  },
  { id:"tasks",   label:"Tasks",   ic:IC.tasks   },
  { id:"profile", label:"Profile", ic:IC.profile },
];

function InnerApp() {
  const { level, activeChar } = useApp();
  const [loaded,    setLoaded]    = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  return (
    <>
      <style>{CSS}</style>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)}/>}

      <div className="shell" style={{ opacity:loaded ? 1 : 0, transition:"opacity .4s ease .1s" }}>
        <div style={{
          position:"absolute", width:340, height:340, borderRadius:"50%",
          background:"radial-gradient(circle,#003a8833 0%,transparent 65%)",
          top:"42%", left:"50%", transform:"translate(-50%,-50%)",
          animation:"glowOrb 5s ease-in-out infinite", pointerEvents:"none", zIndex:1,
        }}/>

        <Particles/>

        <div className="header">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <ProfileAvatar
              character={activeChar}
              level={level}
              onClick={() => setActiveTab("profile")}
            />
            <div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700,
                fontSize:15, color:"#ddeeff", letterSpacing:.5 }}>ERFAN</div>
            </div>
          </div>
          <div className="logo-wrap"><LogoCenter/></div>
          <button className="faq-btn">FAQ</button>
        </div>

       <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
  {activeTab === "home"    && <HomeScreen/>}
  {activeTab === "city"    && <CityScreen/>}
  {activeTab === "income"  && <IncomeScreen/>}
  {activeTab === "tasks"   && <TasksScreen/>}
  {activeTab === "profile" && <ProfileScreen/>}
</div>

        <div className="bottom-nav">
          {TABS.map(({ id, label, ic }) => {
            const a = activeTab === id;
            return (
              <button
                key={id}
                className={"nav-btn" + (a ? " active" : "")}
                onClick={() => setActiveTab(id)}
              >
                {ic(a)}
                <span className="nav-label" style={{ color:a ? "#00D4FF" : "#3a4a6a" }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function MaviApp() {
  return (
    <AppProvider>
      <InnerApp/>
    </AppProvider>
  );
}