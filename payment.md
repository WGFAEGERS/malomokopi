# Rencana Implementasi Fitur Pembayaran (Payment Flow)

Berikut adalah detail rencana dan langkah-langkah implementasi fitur pembayaran/pemesanan untuk pengunjung, sesuai dengan alur yang telah ditentukan:

## Alur Pembayaran Pengunjung (Customer Payment Flow)

1. **Checkout Pesanan**
   - Pemesan/pengunjung menekan tombol **"Place Order" (Bayar)** pada keranjang (cart) setelah selesai memilih menu yang ingin dibeli.

2. **Pengisian Data Pemesan**
   - Setelah menekan tombol bayar, sistem akan menampilkan form pengisian data diri.
   - Pemesan diwajibkan memasukkan informasi berikut:
     - **Nama Lengkap**
     - **Nomor Telepon / WhatsApp**
     - **Nomor Meja**

3. **Tampilan Barcode Pembayaran**
   - Setelah data pemesan disubmit, sistem akan menampilkan halaman/modal berisi kode QR / Barcode pembayaran dari toko (mengacu pada aset `@barcode`).
   - Terdapat juga informasi "Total Tagihan" yang harus dibayar.

4. **Proses Pembayaran**
   - Pemesan melakukan *scan* pada barcode pembayaran tersebut.
   - Pemesan menyelesaikan pembayaran melalui aplikasi e-wallet atau m-banking masing-masing (contoh: QRIS, GoPay, OVO, Dana, BCA, dll).

5. **Unggah Bukti Pembayaran**
   - Di halaman yang sama dengan barcode, sistem menyediakan form untuk *upload* gambar.
   - Pemesan harus melakukan *screenshot* bukti transfer/pembayaran yang berhasil dari aplikasi mereka.
   - Pemesan mengunggah (*upload*) foto screenshot tersebut ke dalam sistem lalu menekan tombol "Konfirmasi Pembayaran Selesai".
   - Pesanan kemudian akan tersimpan ke dalam sistem dengan status **"Menunggu Verifikasi" (Awaiting Verification)**.

## Alur Verifikasi Admin (Admin Verification Flow)

6. **Verifikasi dan Konfirmasi oleh Admin**
   - Di dashboard kasir/admin, akan muncul daftar pesanan baru dengan status "Menunggu Verifikasi".
   - Admin dapat melihat detail pesanan termasuk **foto bukti pembayaran** yang telah diunggah pelanggan.
   - Jika pembayaran valid dan sesuai dengan total tagihan: Admin menekan tombol **"Verifikasi Pembayaran"**.
   - Setelah diverifikasi, pesanan resmi dikonfirmasi, otomatis masuk ke dapur, dan status berubah menjadi **"Diproses" (Preparing)**.


---

### Kebutuhan Teknis (Technical Requirements) untuk Tahap Selanjutnya:

- **Database:** Memperbarui tabel `orders` untuk menyimpan kolom `customer_name`, `customer_phone`, `table_number`, `payment_proof_url`, dan status order yang lebih rinci (`pending`, `awaiting_verification`, `verified`, etc.).
- **Storage:** Menyiapkan bucket storage (misal menggunakan Supabase Storage) untuk menyimpan file gambar screenshot bukti pembayaran.
- **Frontend Customer:**
  - Membuat UI form data pemesan (Checkout Form).
  - Membuat UI halaman QR/Barcode pembayaran.
  - Mengintegrasikan input upload file untuk gambar konfirmasi.
- **Frontend Admin:**
  - Menyesuaikan tampilan daftar pesanan untuk memuat status "Menunggu Verifikasi".
  - Membuat modal/view bagi admin untuk memperbesar dan mengecek gambar bukti pembayaran.
