# TAHAPAN SETUP AUTHENTICATION (NextAuth + Prisma v7)

Berikut adalah urutan langkah (checklist) untuk membangun sistem autentikasi multi-tenant (Admin vs Client).

## TAHAP 1: Setup Database & Model (Prisma)
1. Buka file `prisma/schema.prisma`.
2. Hapus referensi `url = env("DATABASE_URL")` jika masih ada di blok `datasource` (Karena Prisma v7 konfigurasi URL databasenya ditaruh di `prisma.config.ts`).
3. Tambahkan 3 model wajib berikut:
   - `enum Role { ADMIN, TEAM, CLIENT }`
   - `model User` (harus punya field: id, email, password, name, role, clientId)
   - `model Client` (tabel profil client yang berelasi dengan User melalui clientId).
4. Lakukan migrasi database (misalnya menggunakan command `npx prisma db push`).

## TAHAP 2: Setup Koneksi Database (Best Practice)
1. Buat folder `lib/` (jika belum ada).
2. Buat file `lib/prisma.ts`.
3. Tulis kode inisialisasi PrismaClient agar tidak membuka terlalu banyak koneksi saat development (menggunakan `globalThis`).

## TAHAP 3: Setup NextAuth API Route
1. Install bcrypt untuk hashing password (jika belum):
   `npm install bcrypt` dan `npm install -D @types/bcrypt`
2. Buka file `app/api/auth/[...nextauth]/route.ts`.
3. Tuliskan kode konfigurasi lengkap NextAuth di dalam file tersebut. Isi kodenya meliputi:
   - Pengaturan `CredentialsProvider` (Email dan Password).
   - Logika `authorize`: mencari user dari database (`prisma.user.findUnique`), memvalidasi password dengan `bcrypt.compare`, dan mengembalikan data user (id, email, name, role, clientId).
   - Logika `callbacks.jwt`: Menyimpan `role` dan `clientId` dari user ke dalam token JWT.
   - Logika `callbacks.session`: Memindahkan `role` dan `clientId` dari token agar bisa diakses di sesi Next.js.
   - Ekspor handler untuk metode GET dan POST (`export { handler as GET, handler as POST }`).
   - Ekspor juga konfigurasinya (`export const authOptions`) agar bisa di-import oleh `getServerSession`.

## TAHAP 4: TypeScript Declaration (Agar tidak error)
1. Buka/buat file `types/next-auth.d.ts`.
2. Tambahkan deklarasi module `"next-auth"`.
3. Informasikan kepada TypeScript bahwa antarmuka (interface) `Session` dan `User` sekarang memiliki properti `role: string` dan `clientId?: string | null`.

## TAHAP 5: Penerapan di Halaman & Navigasi
1. Di halaman Root (`app/page.tsx`):
   - Import `getServerSession(authOptions)`.
   - Cek `session?.user?.role`.
   - Lakukan redirect sungguhan ke `/overview`, `/portal/dashboard`, atau `/login` menggunakan `next/navigation`.
2. Di halaman Login UI (`app/(auth)/login/page.tsx`):
   - Gunakan `"use client"`.
   - Gunakan fungsi `signIn("credentials", { email, password, redirect: true, callbackUrl: "/" })` ketika tombol Submit ditekan.

=== SELESAI ===
Ikuti panduan di atas baris demi baris, jika ada error di salah satu langkah, selesaikan error tersebut sebelum lanjut ke langkah berikutnya.
