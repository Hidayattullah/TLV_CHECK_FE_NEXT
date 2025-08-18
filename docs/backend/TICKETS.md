# Panduan Pembuatan Backend - Modul Tiket Dukungan

Dokumen ini adalah panduan teknis untuk membangun backend yang sesuai dengan fitur-fitur tiket dukungan pada aplikasi frontend.

**Stack Teknologi:**
- **Framework:** Next.js (sebagai backend/API routes)
- **ORM:** Prisma
- **Database:** PostgreSQL

---

## 1. Model Database (Prisma Schema)

Definisikan model `SupportTicket` dalam file `schema.prisma`. Model ini akan menjadi dasar untuk semua operasi terkait tiket dukungan teknis dari jemaat.

```prisma
// Tambahkan model ini ke dalam file schema.prisma Anda

model SupportTicket {
  id            String    @id @default(cuid())
  userName      String
  phoneNumber   String
  description   String    @db.Text // Gunakan tipe Text untuk deskripsi yang panjang

  submittedDate DateTime  @default(now())
  status        String    @default("Proses") // "Proses", "Selesai", "Ditolak"
  
  response      String?   @db.Text
  resolvedBy    String?   // Nama admin yang menyelesaikan tiket
  resolvedDate  DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Catatan Penting:**
- Jalankan `npx prisma migrate dev` setelah menambahkan model ini untuk memperbarui skema database Anda.
- Model ini sengaja tidak direlasikan dengan `Member` agar pengguna yang tidak bisa login (misalnya karena akun nonaktif) tetap dapat membuat tiket. Verifikasi kepemilikan bisa dilakukan melalui `phoneNumber`.

---

## 2. Endpoint API

Berikut adalah daftar endpoint API yang perlu Anda buat. Endpoint untuk manajemen (`GET /api/tickets` dan `PATCH`) harus diproteksi dengan *middleware* otentikasi JWT dan memerlukan hak akses khusus.

### a. Endpoint Publik (Tanpa Otentikasi)

- **Endpoint:** `POST /api/tickets`
  - **Tujuan:** Membuat tiket dukungan baru. Digunakan oleh jemaat dari halaman "Tiket Dukungan".
  - **Request Body:** `{ "userName": "Nama Jemaat", "phoneNumber": "+62...", "description": "Deskripsi masalah..." }`
  - **Logika:**
    1. Validasi input.
    2. Buat entri baru di tabel `SupportTicket` dengan status default "Proses".
  - **Success Response (201 Created):** `{ ...data_tiket_baru }`

- **Endpoint:** `GET /api/tickets/:id`
  - **Tujuan:** Mengambil detail satu tiket untuk memeriksa status. Digunakan di halaman "Periksa Status Tiket".
  - **Logika:** Cari tiket berdasarkan `:id` yang diberikan di URL.
  - **Success Response (200 OK):** `{ ...data_tiket }`
  - **Error Response (404 Not Found):** Jika tiket dengan ID tersebut tidak ditemukan.

### b. Endpoint Manajemen (Khusus Admin)

Endpoint berikut memerlukan verifikasi JWT dan hak akses `read` atau `edit` pada modul `tickets`.

- **Endpoint:** `GET /api/tickets`
  - **Tujuan:** Mendapatkan daftar semua tiket dukungan untuk halaman manajemen.
  - **Logika:**
    1. Verifikasi JWT dan pastikan pengguna memiliki hak akses `read` pada modul `tickets`.
    2. Ambil semua data dari tabel `SupportTicket`, diurutkan berdasarkan `submittedDate` (terbaru lebih dulu).
  - **Success Response (200 OK):** `[ { ...data_tiket_1 }, { ...data_tiket_2 } ]`

- **Endpoint:** `PATCH /api/tickets/:id`
  - **Tujuan:** Memperbarui status dan menambahkan tanggapan pada sebuah tiket.
  - **Request Body:**
    ```json
    {
      "status": "Selesai", // atau "Ditolak" / "Proses"
      "response": "Tanggapan dari admin...",
      "resolvedBy": "Nama Admin dari JWT" 
    }
    ```
  - **Logika:**
    1. Verifikasi JWT dan hak akses `edit` pada modul `tickets`.
    2. Cari tiket berdasarkan `:id`.
    3. Update kolom `status`, `response`, dan `resolvedBy`.
    4. Jika status diubah menjadi "Selesai" atau "Ditolak", set juga `resolvedDate` ke waktu saat ini.
    5. Jika status diubah kembali ke "Proses", `resolvedDate` bisa di-set ke `null`.
  - **Success Response (200 OK):** `{ ...data_tiket_terbaru }`

---
