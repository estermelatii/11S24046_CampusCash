import { h, rupiah, fmtDate, uid, validateSaving } from './utils.js';

export function renderSavings(root, ctx) {
  const { state } = ctx;
  let editing = null;
  const errBox = h('div', { class: 'errors', role: 'alert' });
  const f = { name: h('input', { required: '', maxlength: '80' }), target: h('input', { type: 'number', min: '1', required: '' }), saved: h('input', { type: 'number', min: '0', value: '0' }), date: h('input', { type: 'date' }) };
  const submit = h('button', { type: 'submit' }, 'Simpan target');
  const form = h('form', { novalidate: '' }, h('label', {}, 'Nama target', f.name), h('label', {}, 'Target (Rp)', f.target), h('label', {}, 'Terkumpul (Rp)', f.saved), h('label', {}, 'Target tanggal (opsional)', f.date), submit);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const s = { id: editing ?? uid(), name: f.name.value, target: Number(f.target.value), saved: Number(f.saved.value || 0), deadline: f.date.value || '' };
    const errs = validateSaving(s);
    errBox.replaceChildren(...errs.map(x => h('div', {}, x)));
    if (errs.length) return;
    const old = state.savings.find(x => x.id === s.id);
    if (old) Object.assign(old, s); else state.savings.push(s); // tidak mengubah saldo transaksi
    ctx.commit('Target tabungan disimpan.');
  });
  const rows = state.savings.map(s => {
    const pct = Math.round((s.saved / s.target) * 100);
    return h('div', { class: 'item', style: 'display:block' },
      h('div', { class: 'row', style: 'justify-content:space-between' }, h('strong', {}, s.name),
        h('div', { class: 'row' }, h('button', { class: 'ghost', onclick: () => { editing = s.id; f.name.value = s.name; f.target.value = s.target; f.saved.value = s.saved; f.date.value = s.deadline; submit.textContent = 'Perbarui target'; f.saved.focus(); } }, 'Edit'),
          h('button', { class: 'danger', onclick: async () => { if (await ctx.confirm(`Hapus target "${s.name}"?`)) { state.savings = state.savings.filter(x => x.id !== s.id); ctx.commit('Target dihapus.'); } } }, 'Hapus'))),
      h('div', { class: 'muted' }, `${rupiah(s.saved)} dari ${rupiah(s.target)} (${pct}%) · Kurang ${rupiah(s.target - s.saved)}` + (s.deadline ? ` · Target ${fmtDate(s.deadline)}` : '')),
      h('div', { class: 'bar' }, h('i', { style: `width:${Math.min(pct, 100)}%` })));
  });
  root.append(h('h2', {}, 'Target Tabungan'), h('p', { class: 'muted' }, 'Catatan: target tabungan dicatat terpisah dan tidak mengubah saldo transaksi.'), h('div', { class: 'card' }, errBox, form),
    h('div', { class: 'card' }, ...(rows.length ? rows : [h('div', { class: 'empty' }, 'Belum ada target tabungan.')])));
}
