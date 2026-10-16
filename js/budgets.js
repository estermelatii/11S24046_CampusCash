import { h, EXPENSE, rupiah, spentIn, uid, validateBudget } from './utils.js';

export function renderBudgets(root, ctx) {
  const { state, month } = ctx;
  const errBox = h('div', { class: 'errors', role: 'alert' });
  const cat = h('select', {}, ...EXPENSE.map(c => h('option', { value: c }, c)));
  const limit = h('input', { type: 'number', min: '1', step: '1', required: '' });
  const form = h('form', { novalidate: '' }, h('label', {}, 'Kategori', cat), h('label', {}, 'Batas anggaran (Rp)', limit), h('button', { type: 'submit' }, 'Simpan anggaran'));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const b = { id: uid(), month, category: cat.value, limit: Number(limit.value) };
    const errs = validateBudget(b);
    errBox.replaceChildren(...errs.map(x => h('div', {}, x)));
    if (errs.length) return;
    const old = state.budgets.find(x => x.month === month && x.category === b.category);
    if (old) old.limit = b.limit; else state.budgets.push(b); // satu anggaran per kategori per bulan
    ctx.commit('Anggaran disimpan.');
  });
  const rows = state.budgets.filter(b => b.month === month).map(b => budgetRow(b, spentIn(state.transactions, month, b.category), ctx));
  root.append(h('h2', {}, 'Anggaran Bulanan'), h('div', { class: 'card' }, errBox, form),
    h('div', { class: 'card' }, ...(rows.length ? rows : [h('div', { class: 'empty' }, 'Belum ada anggaran untuk bulan ini.')])));
}

export function budgetRow(b, spent, ctx) {
  const pct = Math.round((spent / b.limit) * 100), left = b.limit - spent;
  const msg = pct > 100 ? `Melebihi anggaran sebesar ${rupiah(-left)}!` : pct === 100 ? 'Anggaran sudah habis (100%).' : `Sisa ${rupiah(left)}`;
  return h('div', { class: 'item', style: 'display:block' },
    h('div', { class: 'row', style: 'justify-content:space-between' }, h('strong', {}, b.category),
      ctx ? h('button', { class: 'danger', onclick: async () => { if (await ctx.confirm(`Hapus anggaran ${b.category}?`)) { ctx.state.budgets = ctx.state.budgets.filter(x => x.id !== b.id); ctx.commit('Anggaran dihapus.'); } } }, 'Hapus') : null),
    h('div', { class: 'muted' }, `Batas ${rupiah(b.limit)} · Terpakai ${rupiah(spent)} (${pct}%)`),
    h('div', { class: 'bar', role: 'progressbar', 'aria-valuenow': String(Math.min(pct, 100)), 'aria-valuemin': '0', 'aria-valuemax': '100' }, h('i', { class: pct > 100 ? 'over' : pct >= 80 ? 'warn' : '', style: `width:${Math.min(pct, 100)}%` })),
    h('div', { class: pct >= 100 ? 'exp' : '' }, msg));
}
