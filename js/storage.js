const KEY = 'campuscash:v1';
const empty = () => ({ transactions: [], budgets: [], savings: [] });
export function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && ['transactions', 'budgets', 'savings'].every(k => Array.isArray(d[k]))) return d;
  } catch { /* data rusak: pakai data kosong */ }
  return empty();
}
export function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch { return false; }
}
