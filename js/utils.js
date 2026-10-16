export const INCOME = ['Uang saku', 'Beasiswa', 'Gaji / kerja paruh waktu', 'Hadiah', 'Lainnya'];
export const EXPENSE = ['Makanan dan minuman', 'Transportasi', 'Pendidikan', 'Tempat tinggal', 'Kebutuhan pribadi', 'Hiburan', 'Kesehatan', 'Lainnya'];
export const rupiah = n => (n < 0 ? '-' : '') + 'Rp' + Math.abs(Math.round(n)).toLocaleString('id-ID');
export const fmtDate = s => new Date(s + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
export const monthOf = d => d.slice(0, 7);
export const today = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };

// Membuat elemen DOM; string anak dijadikan text node (aman dari XSS).
export function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'class') e.className = v;
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null) e.append(c);
  return e;
}

// ---- Perhitungan (satu tempat, dipakai semua halaman) ----
export const sum = (list, type, month) => list.filter(t => t.type === type && (!month || monthOf(t.date) === month)).reduce((a, t) => a + t.amount, 0);
export const balance = list => sum(list, 'income') - sum(list, 'expense'); // sepanjang periode pencatatan
export const spentIn = (list, month, cat) => list.filter(t => t.type === 'expense' && monthOf(t.date) === month && t.category === cat).reduce((a, t) => a + t.amount, 0);
export function daysLeft(month, now = new Date()) {
  const [y, m] = month.split('-').map(Number);
  const last = new Date(y, m, 0).getDate();
  const cur = now.getFullYear() * 12 + now.getMonth(), sel = y * 12 + (m - 1);
  if (sel < cur) return 0;
  return sel > cur ? last : last - now.getDate() + 1; // termasuk hari ini
}
export const dailyLimit = (remaining, days) => (days > 0 && remaining > 0 ? remaining / days : null);

// ---- Validasi ----
export function validateTx(t) {
  const e = [];
  if (!t.name.trim()) e.push('Nama transaksi wajib diisi.');
  if (!Number.isFinite(t.amount) || t.amount <= 0) e.push('Nominal harus angka lebih besar dari nol.');
  if (!(t.type === 'income' ? INCOME : EXPENSE).includes(t.category)) e.push('Kategori tidak valid.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.date) || isNaN(new Date(t.date))) e.push('Tanggal tidak valid.');
  return e;
}
export const validateBudget = b => (Number.isFinite(b.limit) && b.limit > 0 ? [] : ['Anggaran harus lebih besar dari nol.']);
export function validateSaving(s) {
  const e = [];
  if (!s.name.trim()) e.push('Nama target wajib diisi.');
  if (!Number.isFinite(s.target) || s.target <= 0) e.push('Jumlah target harus lebih besar dari nol.');
  if (!Number.isFinite(s.saved) || s.saved < 0) e.push('Tabungan terkumpul tidak boleh negatif.');
  if (s.saved > s.target) e.push('Tabungan terkumpul melebihi target. Naikkan target atau kurangi jumlah terkumpul.');
  return e;
}
