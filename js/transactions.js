import { h, INCOME, EXPENSE, rupiah, fmtDate, uid, today, monthOf, validateTx } from './utils.js';

export function renderTransactions(root, ctx) {
  const { state, month } = ctx;
  let editing = null;
  const errBox = h('div', { class: 'errors', role: 'alert' });
  const f = {
    type: h('select', {}, h('option', { value: 'expense' }, 'Pengeluaran'), h('option', { value: 'income' }, 'Pemasukan')),
    name: h('input', { required: '', maxlength: '80' }),
    amount: h('input', { type: 'number', step: '1', min: '1', required: '' }),
    category: h('select'), date: h('input', { type: 'date', value: today() }), note: h('input', { maxlength: '200' }),
  };
  const fillCats = () => { f.category.replaceChildren(...(f.type.value === 'income' ? INCOME : EXPENSE).map(c => h('option', { value: c }, c))); };
  f.type.addEventListener('change', fillCats); fillCats();
  const submit = h('button', { type: 'submit' }, 'Simpan');
  const form = h('form', { novalidate: '' },
    h('label', {}, 'Jenis', f.type), h('label', {}, 'Nama / deskripsi', f.name), h('label', {}, 'Nominal (Rp)', f.amount),
    h('label', {}, 'Kategori', f.category), h('label', {}, 'Tanggal', f.date), h('label', {}, 'Catatan (opsional)', f.note), submit);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const t = { id: editing ?? uid(), name: f.name.value, type: f.type.value, amount: Number(f.amount.value), category: f.category.value, date: f.date.value, note: f.note.value };
    const errs = validateTx(t);
    errBox.replaceChildren(...errs.map(x => h('div', {}, x)));
    if (errs.length) return;
    const old = state.transactions.find(x => x.id === t.id);
    if (old) Object.assign(old, t); else state.transactions.push(t); // edit mengganti, bukan menambah
    ctx.commit(old ? 'Transaksi diperbarui.' : 'Transaksi ditambahkan.');
  });

  const list = state.transactions.filter(t => monthOf(t.date) === month).sort((a, b) => b.date.localeCompare(a.date));
  const items = list.length ? list.map(t => h('div', { class: 'item' },
    h('div', {}, h('strong', {}, t.name), ' ', h('span', { class: 'tag' }, t.category), t.demo ? h('span', { class: 'tag' }, 'contoh') : null,
      h('div', { class: 'muted' }, fmtDate(t.date) + (t.note ? ' — ' + t.note : ''))),
    h('div', { class: 'row' }, h('strong', { class: t.type === 'income' ? 'inc' : 'exp' }, (t.type === 'income' ? '+' : '-') + rupiah(t.amount)),
      h('button', { class: 'ghost', onclick: () => {
        editing = t.id; f.type.value = t.type; fillCats(); f.name.value = t.name; f.amount.value = t.amount; f.category.value = t.category; f.date.value = t.date; f.note.value = t.note || '';
        submit.textContent = 'Perbarui'; f.name.focus();
      } }, 'Edit'),
      h('button', { class: 'danger', onclick: async () => {
        if (await ctx.confirm(`Hapus transaksi "${t.name}"?`)) { state.transactions = state.transactions.filter(x => x.id !== t.id); ctx.commit('Transaksi dihapus.'); }
      } }, 'Hapus'))))
    : [h('div', { class: 'empty' }, 'Belum ada transaksi pada bulan ini. Tambahkan lewat formulir di atas.')];
  root.append(h('h2', {}, 'Transaksi'), h('div', { class: 'card' }, errBox, form), h('div', { class: 'card' }, ...items));
}
