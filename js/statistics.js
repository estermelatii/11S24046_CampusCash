import { h, sum, rupiah, monthOf, EXPENSE } from './utils.js';
const charts = {};
function draw(key, canvas, cfg) { charts[key]?.destroy(); charts[key] = new Chart(canvas, cfg); }

export function categoryChart(card, state, month, key = 'cat') {
  const data = EXPENSE.map(c => state.transactions.filter(t => t.type === 'expense' && t.category === c && monthOf(t.date) === month).reduce((a, t) => a + t.amount, 0));
  if (!data.some(v => v > 0)) return card.append(h('div', { class: 'empty' }, 'Belum ada pengeluaran pada bulan ini, grafik belum bisa ditampilkan.'));
  if (typeof Chart === 'undefined') return card.append(h('div', { class: 'errors', style: 'display:block' }, 'Chart.js gagal dimuat. Periksa koneksi internet.'));
  const cv = h('canvas', { 'aria-label': 'Grafik pengeluaran per kategori', role: 'img' }); card.append(cv);
  draw(key, cv, { type: 'doughnut', data: { labels: EXPENSE, datasets: [{ data, backgroundColor: ['#a9cdf2', '#7fb3e8', '#1f2f56', '#fff4cf', '#cfe3f8', '#5b8ccf', '#f3d98a', '#9fb4d6'] }] }, options: { plugins: { tooltip: { callbacks: { label: c => `${c.label}: ${rupiah(c.raw)}` } } } } });
}
export function renderStatistics(root, ctx) {
  const { state, month } = ctx, year = month.slice(0, 4);
  const c1 = h('div', { class: 'card' }, h('h3', {}, 'Pengeluaran per kategori — ' + month));
  const c2 = h('div', { class: 'card' }, h('h3', {}, 'Pemasukan vs pengeluaran — tahun ' + year));
  const ms = Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
  const inc = ms.map(m => sum(state.transactions, 'income', m)), exp = ms.map(m => sum(state.transactions, 'expense', m));
  root.append(h('h2', {}, 'Statistik'), c1, c2);
  categoryChart(c1, state, month, 'stat');
  if (![...inc, ...exp].some(v => v > 0)) c2.append(h('div', { class: 'empty' }, 'Belum ada transaksi pada tahun ini.'));
  else if (typeof Chart !== 'undefined') {
    const cv = h('canvas', { role: 'img', 'aria-label': 'Grafik pemasukan dan pengeluaran per bulan' }); c2.append(cv);
    draw('time', cv, { type: 'bar', data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'], datasets: [{ label: 'Pemasukan', data: inc, backgroundColor: '#a9cdf2' }, { label: 'Pengeluaran', data: exp, backgroundColor: '#1f2f56' }] } });
  }
}
