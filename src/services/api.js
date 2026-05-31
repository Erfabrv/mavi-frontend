const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:3001/api";

const getInitData = () => {
  if (window.Telegram?.WebApp?.initData) {
    return window.Telegram.WebApp.initData;
  }
  return "test_mode";
};

const headers = () => ({
  "Content-Type": "application/json",
  "x-telegram-init-data": getInitData(),
});

export const loginUser = () =>
  fetch(`${BASE_URL}/auth/login`, { method:"POST", headers:headers() })
    .then(r => r.json());

export const getMe = () =>
  fetch(`${BASE_URL}/user/me`, { headers:headers() })
    .then(r => r.json());

export const claimDaily = (totalIncome) =>
  fetch(`${BASE_URL}/user/claim`, {
    method:"POST", headers:headers(),
    body: JSON.stringify({ totalIncome }),
  }).then(r => r.json());

export const selectCharacter = (charId) =>
  fetch(`${BASE_URL}/user/character`, {
    method:"POST", headers:headers(),
    body: JSON.stringify({ charId }),
  }).then(r => r.json());

export const buyCharacter = (charId, price) =>
  fetch(`${BASE_URL}/user/character/buy`, {
    method:"POST", headers:headers(),
    body: JSON.stringify({ charId, price }),
  }).then(r => r.json());

export const upgradeBusiness = (bizId, cost, xpGain) =>
  fetch(`${BASE_URL}/business/upgrade`, {
    method:"POST", headers:headers(),
    body: JSON.stringify({ bizId, cost, xpGain }),
  }).then(r => r.json());

export const buyPackage = (pkgId, price) =>
  fetch(`${BASE_URL}/investment/buy`, {
    method:"POST", headers:headers(),
    body: JSON.stringify({ pkgId, price }),
  }).then(r => r.json());

export const withdrawProfit = (pkgId, profit) =>
  fetch(`${BASE_URL}/investment/withdraw`, {
    method:"POST", headers:headers(),
    body: JSON.stringify({ pkgId, profit }),
  }).then(r => r.json());