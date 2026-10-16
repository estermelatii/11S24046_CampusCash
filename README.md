# CampusCash — Student Finance Tracker

Aplikasi web pencatatan keuangan mahasiswa (Tugas I 11S3133 PABWE). Dibuat dengan bantuan AI generatif (Claude); semua kode wajib dievaluasi dan diuji sendiri.

## Fitur
Dashboard, Transaksi (tambah/edit/hapus), Anggaran bulanan, Statistik (Chart.js), Target Tabungan, batas pengeluaran harian.

## Teknologi
HTML5, CSS3, JavaScript vanilla (ES Modules), LocalStorage, Chart.js via CDN (**butuh internet** untuk grafik).

## Cara menjalankan
Karena memakai ES Modules, jalankan lewat local server (bukan klik dua kali):
```
cd campuscash
python -m http.server 8000
```
Buka http://localhost:8000 (atau pakai ekstensi Live Server di VS Code).

## Struktur
`index.html` (kerangka + navigasi), `css/style.css`, `js/` (app, storage, utils, transactions, budgets, statistics, savings), `tests/test-cases.md`.

## Keterbatasan
- Data hanya di LocalStorage browser: hilang jika data browser dibersihkan, tidak sinkron antar perangkat.
- Jika data LocalStorage rusak, aplikasi memakai data kosong dan data rusak akan tertimpa saat penyimpanan berikutnya.
- Saldo = seluruh transaksi tercatat; target tabungan tidak mengurangi saldo.
- Bukan untuk data keuangan sensitif dan belum siap produksi.

## Pengujian & penggunaan AI
Isi hasil pengujian aktual dan bukti prompt AI Anda sendiri di proposal/README. Jangan diisi sebelum benar-benar dijalankan.
