import { load, save } from './storage.js';
import { h, rupiah, fmtDate, sum, balance, daysLeft, dailyLimit, spentIn, uid, today } from './utils.js';
import { renderTransactions } from './transactions.js';
import { renderBudgets, budgetRow } from './budgets.js';
import { renderStatistics, categoryChart } from './statistics.js';
import { renderSavings } from './savings.js';

const state = load();
const main = document.getElementById('main'), monthInput = document.getElementById('month');
monthInput.value = today().slice(0, 7);
const pages = { dashboard: renderDashboard, transaksi: renderTransactions, anggaran: renderBudgets, statistik: renderStatistics, tabungan: renderSavings };

const ctx = {
  state,
  get month() { return monthInput.value || today().slice(0, 7); },
  commit(msg) { toast(save(state) ? msg : 'Gagal menyimpan ke LocalStorage.'); render(); },
  confirm(text) {
    const d = document.getElementById('confirm'); document.getElementById('confirm-text').textContent = text;
    return new Promise(res => { d.addEventListener('close', () => res(d.returnValue === 'yes'), { once: true }); d.returnValue = 'no'; d.showModal(); });
  },
};
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); }

function renderDashboard(root) {
  const m = ctx.month, tx = state.transactions;
  const inc = sum(tx, 'income', m), exp = sum(tx, 'expense', m);
  const budgets = state.budgets.filter(b => b.month === m);
  const totalBudget = budgets.reduce((a, b) => a + b.limit, 0), spentBudget = budgets.reduce((a, b) => a + spentIn(tx, m, b.category), 0);
  const days = daysLeft(m), limit = dailyLimit(totalBudget - spentBudget, days);
  const card = (t, v, cls = '', n = null, wrap = '') => h('div', { class: 'card ' + wrap }, h('div', { class: 'muted' }, t), h('div', { class: 'big ' + cls, ...(n !== null ? { 'data-n': String(n) } : {}) }, v));
  let daily;
  if (!budgets.length) daily = 'Belum ada anggaran bulan ini.';
  else if (days === 0) daily = 'Bulan ini sudah berakhir.';
  else if (limit === null) daily = 'Sisa anggaran habis atau minus.';
  else daily = rupiah(limit) + ' / hari';
  const chart = h('div', { class: 'card' }, h('h3', {}, 'Pengeluaran per kategori'));
  const recent = [...tx].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  root.append(h('h2', {}, 'Dashboard'),
    h('div', { class: 'grid' }, card('Saldo (seluruh transaksi tercatat)', rupiah(balance(tx)), '', balance(tx), 'hero'), card('Pemasukan bulan ' + m, rupiah(inc), 'inc', inc), card('Pengeluaran bulan ' + m, rupiah(exp), 'exp', exp), card('Batas pengeluaran harian', daily)),
    h('p', { class: 'muted' }, `Asumsi: (total anggaran − pengeluaran pada kategori beranggaran) ÷ ${days} hari tersisa. Ini rumus biasa, bukan prediksi AI.`),
    chart, h('div', { class: 'card' }, h('h3', {}, 'Penggunaan anggaran'), ...(budgets.length ? budgets.map(b => budgetRow(b, spentIn(tx, m, b.category))) : [h('div', { class: 'empty' }, 'Belum ada anggaran.')])),
    h('div', { class: 'card' }, h('h3', {}, 'Transaksi terbaru'),
      ...(recent.length ? recent.map(t => h('div', { class: 'item' }, h('div', {}, t.name, h('div', { class: 'muted' }, fmtDate(t.date) + ' · ' + t.category)), h('strong', { class: t.type === 'income' ? 'inc' : 'exp' }, (t.type === 'income' ? '+' : '-') + rupiah(t.amount))))
        : [h('div', { class: 'empty' }, 'Belum ada transaksi. ', h('button', { class: 'ghost', onclick: loadDemo }, 'Muat data contoh'))]),
      state.transactions.some(t => t.demo) ? h('button', { class: 'ghost', onclick: () => { state.transactions = state.transactions.filter(t => !t.demo); ctx.commit('Data contoh dihapus.'); } }, 'Hapus data contoh') : null));
  categoryChart(chart, state, m, 'dash');
}
function loadDemo() {
  const m = ctx.month, d = n => `${m}-${String(n).padStart(2, '0')}`, mk = (name, type, amount, category, n) => ({ id: uid(), name, type, amount, category, date: d(n), note: '', demo: true });
  state.transactions.push(mk('Uang saku bulanan', 'income', 1500000, 'Uang saku', 1), mk('Makan siang', 'expense', 25000, 'Makanan dan minuman', 2), mk('Ojek online', 'expense', 18000, 'Transportasi', 3), mk('Fotokopi modul', 'expense', 12000, 'Pendidikan', 4));
  ctx.commit('Data contoh dimuat (ditandai "contoh").');
}
function render() {
  const key = location.hash.slice(1) in pages ? location.hash.slice(1) : 'dashboard';
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', a.hash === '#' + key));
  main.replaceChildren(); pages[key](main, ctx);
  document.querySelectorAll('[data-n]').forEach(el => { // angka menghitung naik
    const n = Number(el.dataset.n), t0 = performance.now();
    const step = t => { const p = Math.min((t - t0) / 700, 1); el.textContent = rupiah(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}
window.addEventListener('hashchange', () => { render(); main.focus(); });
monthInput.addEventListener('change', render);
render();
