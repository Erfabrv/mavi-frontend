import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MAX_ENERGY, MAX_LEVEL, getPlayerLevel, xpForNextLevel, totalXpForLevel, getUnlocked } from "../data/constants";
import { ALL_CHARACTERS } from "../data/characters";
import { loginUser } from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [coins, setCoins]                       = useState(5000000);
  const [xp, setXp]                             = useState(0);
  const [energy, setEnergy]                     = useState(MAX_ENERGY);
  const [baseDailyIncome]                       = useState(0);
  const [cityIncome, setCityIncome]             = useState(0);
  const [walletBalance, setWalletBalance]       = useState(0);
  const [walletHistory, setWalletHistory]       = useState([]);
  const [activeCharId, setActiveCharId]         = useState("lv1");
  const [purchasedChars, setPurchasedChars]     = useState([]);
  const [initialBusinesses, setInitialBusinesses] = useState([]);
  const [loading, setLoading]                   = useState(true);

  const level       = getPlayerLevel(xp);
  const xpInLevel   = xp - totalXpForLevel(level);
  const xpNeeded    = xpForNextLevel(level);
  const totalIncome = baseDailyIncome + cityIncome;
  const isMaxLevel  = level >= MAX_LEVEL;

  // لود از بک‌اند
  useEffect(() => {
    loginUser()
      .then(data => {
        if (data.user) {
          setCoins(data.user.coins);
          setXp(data.user.xp);
          setEnergy(data.user.energy);
          setActiveCharId(data.user.activeCharId || "lv1");
          setWalletBalance(data.user.walletBalance || 0);
          setWalletHistory(data.user.walletHistory || []);
          setPurchasedChars(data.user.purchasedChars || []);
          setInitialBusinesses(data.user.businesses || []);
        }
      })
      .catch(err => console.error("Login failed:", err))
      .finally(() => setLoading(false));
  }, []);

  // auto select character
  useEffect(() => {
    const unlocked = getUnlocked(level);
    if (!unlocked.length) return;
    const stillValid = unlocked.find(c => c.id === activeCharId);
    if (!stillValid) setActiveCharId(unlocked[unlocked.length - 1].id);
  }, [level]);

  // energy recharge
  useEffect(() => {
    const t = setInterval(() => setEnergy(en => Math.min(MAX_ENERGY, en + 1)), 10000);
    return () => clearInterval(t);
  }, []);

  const addCoins   = useCallback((n) => setCoins(c => c + n), []);
  const spendCoins = useCallback((n) => setCoins(c => Math.max(0, c - n)), []);
  const addXP      = useCallback((n) => setXp(x => x + n), []);
  const useEnergy  = useCallback(() => setEnergy(en => Math.max(0, en - 1)), []);

  const addToWallet = useCallback((amount) => {
    setWalletBalance(b => b + amount);
    setWalletHistory(h => [...h, {
      amount,
      date: Date.now(),
      id: Math.random().toString(36).slice(2),
    }]);
  }, []);

  const activeChar = ALL_CHARACTERS.find(c => c.id === activeCharId) || ALL_CHARACTERS[0];

  return (
    <AppContext.Provider value={{
      coins, xp, level, xpInLevel, xpNeeded, isMaxLevel,
      energy, activeCharId, activeChar,
      totalIncome, cityIncome, setCityIncome,
      walletBalance, walletHistory, addToWallet,
      addCoins, spendCoins, addXP, useEnergy,
      setActiveCharId,
      purchasedChars, setPurchasedChars,
      initialBusinesses,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};