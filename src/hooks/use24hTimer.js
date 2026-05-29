import { useState, useEffect, useCallback } from "react";

const KEY   = "mavi_last_claim";
const CYCLE = 86_400_000;

export function use24hTimer() {
  const getNext = () => {
    const s = localStorage.getItem(KEY);
    return s ? +s + CYCLE : Date.now();
  };

  const [next, setNext] = useState(getNext);
  const [rem,  setRem]  = useState(0);
  const [ok,   setOk]   = useState(false);

  useEffect(() => {
    const tick = () => {
      const d = next - Date.now();
      setRem(Math.max(0, d));
      setOk(d <= 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [next]);

  const claim = useCallback(() => {
    const n = Date.now();
    localStorage.setItem(KEY, String(n));
    setNext(n + CYCLE);
  }, []);

  const fmt = (ms) => {
    const s = Math.floor(ms / 1000);
    return (
      String(Math.floor(s / 3600)).padStart(2, "0") + ":" +
      String(Math.floor((s % 3600) / 60)).padStart(2, "0") + ":" +
      String(s % 60).padStart(2, "0")
    );
  };

  return { rem, ok, claim, fmt };
}