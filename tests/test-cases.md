# Skenario Pengujian CampusCash

Kolom "Hasil aktual" HARUS diisi sendiri setelah benar-benar dijalankan di browser.

| ID | Skenario | Langkah | Hasil diharapkan | Hasil aktual |
|----|----------|---------|------------------|--------------|
| T01 | Tambah pemasukan valid | Transaksi > isi semua > Simpan | Muncul di daftar, dashboard terupdate | |
| T02 | Nominal 0 | Isi nominal 0 > Simpan | Pesan error, data tidak tersimpan | |
| T03 | Nominal negatif | Isi -5000 | Pesan error | |
| T04 | Nama kosong | Kosongkan nama | Pesan error | |
| T05 | Edit transaksi | Klik Edit, ubah nominal > Perbarui | Jumlah transaksi tetap, total tidak dihitung ganda | |
| T06 | Hapus transaksi | Hapus > Batal, lalu Ya | Batal: tetap ada; Ya: terhapus + ringkasan berubah | |
| T07 | Data kosong | Buka pertama kali | Empty state di dashboard, transaksi, statistik | |
| T08 | Saldo | Pemasukan 1.500.000, pengeluaran 55.000 | Saldo Rp1.445.000 | |
| T09 | Anggaran 100% | Anggaran 100.000, pengeluaran 100.000 | Peringatan "habis (100%)" | |
| T10 | Anggaran >100% | Pengeluaran 130.000 | Tampil kelebihan Rp30.000 | |
| T11 | Anggaran 0/negatif | Isi 0 | Pesan error | |
| T12 | Batas harian, sisa <= 0 | Pengeluaran >= anggaran | Pesan khusus, tanpa pembagian nol | |
| T13 | Tabungan > target | Terkumpul > target | Pesan error | |
| T14 | LocalStorage rusak | Console: localStorage.setItem('campuscash:v1','{rusak') lalu refresh | Aplikasi tetap terbuka dengan data kosong | |
| T15 | Input HTML | Nama: `<b>x</b>` | Tampil sebagai teks biasa | |
| T16 | Filter bulan | Ganti bulan | Semua halaman memakai bulan yang sama | |
| T17 | Chart.js offline | Matikan internet | Pesan informatif, aplikasi tetap jalan | |
