# Langkah-Langkah Implementasi Algoritma Greedy

Algoritma **Greedy** adalah pendekatan pemecahan masalah yang membuat pilihan yang tampaknya terbaik pada setiap langkah saat ini, dengan harapan bahwa serangkaian pilihan lokal ini akan mengarah pada solusi optimal secara global.

Berikut adalah panduan lengkap langkah-langkah untuk mengimplementasikan algoritma Greedy secara efektif.

---

## 1. Identifikasi Struktur Masalah

Sebelum menulis kode, Anda harus memastikan bahwa masalah tersebut dapat diselesaikan dengan pendekatan Greedy. Ada dua syarat utama yang harus dipenuhi:

- **Greedy Choice Property**: Solusi optimal global dapat dicapai dengan membuat pilihan optimal lokal (pilihan terbaik saat ini).
- **Optimal Substructure**: Solusi optimal untuk masalah besar mengandung solusi optimal untuk sub-masalahnya.

## 2. Tentukan Komponen Utama

Setiap implementasi Greedy biasanya melibatkan komponen-komponen berikut:

1.  **Himpunan Kandidat (Candidate Set)**: Kumpulan elemen yang bisa digunakan untuk membangun solusi.
2.  **Fungsi Seleksi (Selection Function)**: Logika untuk memilih kandidat terbaik pada setiap langkah (misalnya: pilih nilai terbesar, jarak terpendek, atau biaya terkecil).
3.  **Fungsi Kelayakan (Feasibility Function)**: Memeriksa apakah kandidat yang dipilih dapat ditambahkan ke solusi tanpa melanggar batasan masalah.
4.  **Fungsi Objektif (Objective Function)**: Menentukan nilai dari solusi yang sedang dibangun (apakah kita memaksimalkan atau meminimalkan sesuatu).
5.  **Fungsi Solusi (Solution Function)**: Menentukan kapan kita telah mencapai solusi lengkap.

## 3. Alur Implementasi (Langkah demi Langkah)

### Langkah A: Inisialisasi
Siapkan variabel untuk menampung hasil akhir (solusi) dan urutkan data input jika diperlukan (seringkali Greedy memerlukan data yang terurut).

### Langkah B: Iterasi (Perulangan)
Lakukan perulangan selama himpunan kandidat belum kosong dan solusi belum lengkap.

### Langkah C: Seleksi (Greedy Choice)
Pilih elemen terbaik dari himpunan kandidat berdasarkan kriteria tertentu (misal: nilai tertinggi).

### Langkah D: Cek Kelayakan
Jika elemen yang dipilih layak (tidak melanggar aturan), masukkan ke dalam himpunan solusi.

### Langkah E: Update Status
Hapus elemen yang sudah diproses dari daftar kandidat dan ulangi prosesnya.

---

## 4. Contoh Kasus: Penukaran Uang (Coin Change)

Dalam konteks sistem POS, masalah ini sering muncul saat menghitung kembalian uang dengan jumlah koin/lembaran sesedikit mungkin.

### Logika Algoritma:
1.  Urutkan pecahan uang dari yang terbesar ke terkecil.
2.  Ambil pecahan terbesar yang nilainya kurang dari atau sama dengan jumlah kembalian.
3.  Kurangi jumlah kembalian dengan pecahan tersebut.
4.  Ulangi hingga jumlah kembalian menjadi nol.

### Implementasi Kode (TypeScript):

```typescript
function getChange(amount: number, denominations: number[]): number[] {
  // 1. Urutkan pecahan dari yang terbesar (Greedy Choice Preparation)
  const sortedCoins = [...denominations].sort((a, b) => b - a);
  const result: number[] = [];
  let remaining = amount;

  // 2. Iterasi melalui setiap pecahan
  for (const coin of sortedCoins) {
    // 3. Seleksi & Kelayakan: Ambil koin sebanyak mungkin selama tidak melebihi sisa
    while (remaining >= coin) {
      result.push(coin);
      remaining -= coin;
    }
  }

  return result;
}

// Contoh Penggunaan
const coins = [1000, 500, 200, 100];
const target = 2800;
console.log(getChange(target, coins)); // Output: [1000, 1000, 500, 200, 100]
```

---

## 5. Kelebihan dan Kekurangan

| Kelebihan | Kekurangan |
| :--- | :--- |
| **Sederhana**: Mudah dipahami dan diimplementasikan. | **Tidak Selalu Optimal**: Terkadang gagal menemukan solusi global terbaik. |
| **Efisien**: Biasanya memiliki kompleksitas waktu yang rendah (seringkali O(n log n) karena pengurutan). | **Kaku**: Sekali pilihan dibuat, tidak bisa dibatalkan (tidak ada backtracking). |
| **Cepat**: Sangat baik untuk masalah real-time yang membutuhkan respon instan. | **Sangat Bergantung pada Kriteria**: Pemilihan kriteria yang salah akan merusak hasil. |

## 6. Tips Sukses Implementasi

- **Urutkan Data Dahulu**: Sebagian besar algoritma Greedy bekerja lebih baik setelah data diurutkan.
- **Validasi Kecocokan**: Jika solusi Greedy tidak memberikan hasil optimal, pertimbangkan menggunakan **Dynamic Programming**.
- **Dokumentasikan Kriteria Utama**: Berikan komentar pada kode Anda mengapa kriteria tertentu dipilih sebagai "Pilihan Greedy".
