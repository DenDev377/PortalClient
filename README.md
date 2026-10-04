# 🚀 Client Portal & Invoice Management SaaS

Sistem Manajemen Invoice tingkat *Enterprise* (*B2B SaaS*) dengan integrasi penuh **Midtrans Payment Gateway** dan pengamanan data isolasi bertingkat (Multi-Tenant). Proyek ini memisahkan secara ketat *dashboard* operasional agensi dari Portal eksekutif milik klien pelanggan.

---

## ✨ Fitur Utama

### 🛠️ Area Admin / Command Center
- **Agregat Dashboard Real-time:** Memantau metrik total pendapatan, invoice kadaluarsa, dan rekap sisa penagihan (*unbilled worklogs*).
- **Manajemen Klien & Proyek:** Membuat klien baru, menautkan Akun Klien (VVIP Portal), dan mengendalikan iterasi proyek harian.
- **Time Tracker / Worklogs:** Mencatat lembar waktu jam kerja tim pada setiap tugas proyek untuk nantinya ditagihkan ke klien.
- **Invoice Generator:** Fitur sekali klik (`One-Click Generation`) yang mengubah jam kerja yang belum dibayar menjadi Tagihan Pembayaran formal (Invoice).
- **Smart Settings:** Tampilan pengaturan identitas penagihan, pajak (Tax Rate default), mata uang, dan fitur pengingat klien.

### 💼 Portal Klien Eksekutif VVIP
- **Tembok Isolasi Aman:** Klien tidak dapat melihat data perusahaan/klien lain di basis data berkat penanaman `clientId` lapis ganda di `Middleware` Next.js & kueri *Prisma*.
- **Desain Khusus (Coral):** Dipercantik seluruhnya menggunakan UI Minimalist elegan dengan gaya warna korporat yang responsif.
- **Pembayaran Sekali Sentuh:** Tagihan dapat diselesaikan detik itu juga di portal berkat fitur Pop-up **Midtrans Snap Button**.

### 🤖 Sistem Otomasi di Balik Layar
- Perlindungan integritas transaksi (menghindari duplikasi pembuatan *Snap Token* ganda).
- **Silent Webhook Server-to-Server:** Ketika klien selesai mentransfer dari *M-Banking* di dunia nyata, Midtrans akan memukul endpoint Webhook yang kemudian merubah status Tagihan di Database MySQL Anda menjadi Valid (`PAID`), semuanya terjadi sekejap mata & sepenuhnya hands-free!

---

## 🛠️ Stack Teknologi

- **Frontend:** Next.js 15 (App Router), Server Components, Tailwind CSS, Lucide Icons.
- **API & Logic:** Next.js Route Handlers (`app/api/*`) & Server Actions.
- **Autentikasi:** NextAuth.js (Berbasis Role: `ADMIN`, `TEAM`, `CLIENT`), *BcryptJS*.
- **Database ORM:** Prisma Client v7+. 
- **Database Engine:** MySQL Database.
- **Payment Gateway:** Midtrans (Snap & Core API).

---

## ⚙️ Persyaratan Lingkungan (Prerequisites)

Sistem ini membutuhkan parameter di bawah untuk beroperasi. Atur di file tersembunyi `/.env`.

```env
# URL Koneksi Ke MySQL Server (Isi sesuai local / cloud env Anda)
DATABASE_URL="mysql://username:password@localhost:3306/client_portal_db"

# Otentikasi Sesi NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="RANDOM_SECRET_STRING_YANG_SULIT_DITEBAK"

# Sandi Server Rahasia Midtrans 
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxxxx"
```

---

## 🚀 Cara Menjalankan Sistem Lokal

1. **Unduh Depedensi Paket:**
   ```bash
   npm install
   ```

2. **Sinkronisasi Otot Database Prisma:**
   *Penting:* Jika Anda belum punya tabel, langkah ini akan mendirikan fondasinya di MySQL.
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Nyalakan Server Pengembangan:**
   ```bash
   npm run dev
   ```

4. Buka Browser Utama dan ketikkan alamat:
   - Akses: `http://localhost:3000`

---

## 🔄 Contoh Alur Pengujian Bisnis (Sandbox)

Untuk memvalidasi bahwa seluruh pergerakan bisnis *(Business Flow)* beroperasi matang, Anda bisa mengikuti jalan cerita fiktif berikut:

1. Buat **1 entitas Klien** di halaman Admin. 
2. Daftarkan kredensial masuk klien tersebut dan ingat kata sandinya.
3. Buat **1 Proyek** lalu catatkan beberapa buah ***Worklogs* (Jam Kerja)** ke dalam proyek tersebut.
4. Buka halaman _Invoice_ pada Admin, dan hasilkan tagihan berdasar kumpulan **Worklogs** yang belum digaji.
5. Anda lalu bisa Logout / Keluar.
6. Coba masuk (*Login*) kembali, **NAMUN**, masuklah bersandarkan email *(kredensial klien)* dari Langkah 2!
7. Anda akan dilemparkan menuju **Portal Klien**. Saksikan betapa tagihan yang tadi Anda buat langsung tercetak di depan layar klien untuk mereka lunasi menggunakan rekening Bank virtual (Midtrans Sandbox / Simulator Webhooks). 

---

### Dikembangkan Oleh
**Dendi Dev** © 2026. Hak Cipta Dilindungi.  

