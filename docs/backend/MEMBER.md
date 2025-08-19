# Panduan Pembuatan Backend - Modul Jemaat & Autentikasi

Dokumen ini berfungsi sebagai panduan teknis untuk membangun backend yang sesuai dengan aplikasi frontend yang telah kita kembangkan.

**Stack Teknologi:**
- **Framework:** Next.js (sebagai backend/API routes)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Autentikasi:** JSON Web Token (JWT)

---

## 1. Model Database (Prisma Schema)

Definisikan model `Member` dalam file `schema.prisma` Anda. Model ini akan menjadi dasar untuk semua operasi terkait jemaat.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Member {
  id            String    @id @default(cuid())
  name          String
  email         String?   @unique
  phoneNumber   String    @unique
  password      String    // Simpan password yang sudah di-hash
  address       String?
  dateOfBirth   DateTime?
  gender        String?   // "Laki-laki" atau "Perempuan"
  avatarUrl     String?
  joinedDate    DateTime  @default(now())
  isActive      Boolean   @default(true)
  isVerified    Boolean   @default(false)

  // Relasi atau kolom JSON untuk hak akses & RFID
  permissions   Json      @default("{\"members\":[],\"checkin\":[],\"prayers\":[],\"questions\":[],\"tickets\":[]}")
  rfidId        String?
  rfidType      String?   // "Card", "Tag", "Stiker"

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relasi balik
  checkIns      CheckIn[]
  questions     Question[]
  prayerRequests PrayerRequest[]
}
```

**Catatan Penting:**
- Jalankan `npx prisma migrate dev` setelah mendefinisikan model untuk membuat tabel di database Anda.
- Gunakan library seperti `bcrypt.js` untuk melakukan hashing pada password sebelum menyimpannya.

---

## 2. Endpoint API

Berikut adalah daftar endpoint API yang perlu Anda buat di dalam direktori `/pages/api` atau `/app/api` pada proyek Next.js Anda.

### a. Registrasi Jemaat Baru

- **Endpoint:** `POST /api/members`
- **Tujuan:** Mendaftarkan jemaat baru. Sesuai dengan halaman registrasi di frontend.
- **Request Body:**
  ```json
  {
    "name": "Nama Lengkap",
    "email": "email@opsional.com",
    "phoneNumber": "081234567890",
    "address": "Alamat Lengkap",
    "dateOfBirth": "YYYY-MM-DD",
    "gender": "Laki-laki",
    "password": "password_plain_text"
  }
  ```
- **Logika:**
  1. Validasi input (pastikan `phoneNumber` unik).
  2. Hash password menggunakan `bcrypt`.
  3. Buat entri baru di tabel `Member` menggunakan Prisma.
  4. Berikan hak akses default (kosong) saat pembuatan.
- **Success Response (201 Created):**
  ```json
  {
    "id": "cuid_baru",
    "name": "Nama Lengkap",
    ... // data jemaat lainnya tanpa password
  }
  ```

### b. Login Pengguna

- **Endpoint:** `POST /api/auth/login`
- **Tujuan:** Mengautentikasi pengguna dan memberikan JWT.
- **Request Body:**
  ```json
  {
    "phoneNumber": "081234567890",
    "password": "password_plain_text"
  }
  ```
- **Logika:**
  1. Cari jemaat berdasarkan `phoneNumber`.
  2. Jika ditemukan, bandingkan password yang diberikan dengan hash di database menggunakan `bcrypt.compare`.
  3. Jika cocok, buat JWT yang berisi ID jemaat di dalam *payload* (`sub: member.id`). Atur masa berlaku token (misalnya, 7 hari).
- **Success Response (200 OK):**
  ```json
  {
    "token": "jwt_token_anda",
    "member": {
      "id": "cuid_jemaat",
      "name": "Nama Jemaat",
      ... // data jemaat lainnya tanpa password
    }
  }
  ```

### c. Reset Password (Contoh Alur Sederhana)

- **Endpoint 1:** `POST /api/auth/reset-password/request`
  - **Tujuan:** Memverifikasi nomor telepon dan mengirim kode reset (via SMS/WA di aplikasi nyata).
  - **Request Body:** `{ "phoneNumber": "081234567890" }`
  - **Logika:**
    1. Cek apakah nomor telepon terdaftar.
    2. Jika ya, buat kode OTP acak, simpan sementara (misal: di cache atau tabel terpisah) dengan masa berlaku singkat.
    3. Kirim kode tersebut (simulasi di tahap awal).
  - **Success Response (200 OK):** `{ "message": "Kode reset telah dikirim." }`

- **Endpoint 2:** `POST /api/auth/reset-password/verify`
  - **Tujuan:** Memverifikasi OTP dan mengganti password.
  - **Request Body:** `{ "phoneNumber": "081234567890", "otp": "123456", "newPassword": "password_baru" }`
  - **Logika:**
    1. Verifikasi OTP yang tersimpan.
    2. Jika valid, hash `newPassword`.
    3. Update password untuk jemaat tersebut di database.
  - **Success Response (200 OK):** `{ "message": "Password berhasil direset." }`

### d. Manajemen Profil & Jemaat (Memerlukan JWT)

Untuk semua endpoint di bawah ini, Anda perlu membuat *middleware* atau *helper* untuk memverifikasi JWT yang dikirim di header `Authorization: Bearer <token>`.

- **Endpoint:** `GET /api/members/:id`
  - **Tujuan:** Mengambil detail profil jemaat (untuk halaman profil atau detail manajemen).
  - **Success Response (200 OK):** `{ ...data_jemaat }`

- **Endpoint:** `PATCH /api/members/:id`
  - **Tujuan:** Memperbarui data jemaat. Digunakan untuk "Edit Profil" oleh pengguna dan "Edit Jemaat" oleh admin.
  - **Request Body:** `{ "name": "Nama Baru", "address": "Alamat Baru", ... }`
  - **Logika:**
    1. Verifikasi JWT. Pengguna biasa hanya boleh mengedit profilnya sendiri. Admin (dengan hak akses `edit` di modul `members`) boleh mengedit profil siapa pun.
    2. Update data di database.
  - **Success Response (200 OK):** `{ ...data_jemaat_terbaru }`

- **Endpoint (Khusus Admin):** `GET /api/members`
  - **Tujuan:** Mendapatkan daftar semua jemaat untuk halaman manajemen.
  - **Logika:** Verifikasi bahwa pengguna memiliki hak akses `read` pada modul `members`.
  - **Success Response (200 OK):** `[ { ...data_jemaat_1 }, { ...data_jemaat_2 } ]`

- **Endpoint (Khusus Admin):** `POST /api/members/admin-create`
  - **Tujuan:** Menambahkan jemaat baru melalui panel admin.
  - **Logika:** Verifikasi bahwa pengguna memiliki hak akses `create` pada modul `members`.
  - **Success Response (201 Created):** `{ ...data_jemaat_baru }`

- **Endpoint (Khusus Admin):** `DELETE /api/members/:id`
  - **Tujuan:** Menghapus jemaat.
  - **Logika:** Verifikasi bahwa pengguna memiliki hak akses `delete` pada modul `members`.
  - **Success Response (204 No Content):** (Tidak ada body respons)

- **Endpoint (Khusus Admin):** `PATCH /api/members/:id/permissions`
  - **Tujuan:** Memperbarui hak akses seorang jemaat.
  - **Request Body:**
    ```json
    {
      "permissions": {
        "members": ["create", "read", "edit", "delete"],
        "checkin": ["read"],
        ...
      }
    }
    ```
  - **Logika:** Verifikasi bahwa pengguna yang melakukan permintaan adalah admin super atau memiliki izin untuk mengelola hak akses.
  - **Success Response (200 OK):** `{ ...data_jemaat_terbaru_dengan_hak_akses }`

---

## 3. Middleware Autentikasi

Buat sebuah fungsi middleware yang bisa digunakan di setiap endpoint yang memerlukan proteksi.

**Contoh Logika Middleware:**
1. Ambil token dari header `Authorization`.
2. Jika tidak ada token, kembalikan error `401 Unauthorized`.
3. Verifikasi token menggunakan `jsonwebtoken.verify()`.
4. Jika token valid, ekstrak `userId` dari payload.
5. Ambil data pengguna dari database dan lampirkan ke objek `request` (misal: `req.user`).
6. Jika token tidak valid, kembalikan error `401 Unauthorized`.
7. Lanjutkan ke handler API jika semua valid.
