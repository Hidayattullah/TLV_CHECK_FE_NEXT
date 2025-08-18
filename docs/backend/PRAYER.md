# Panduan Pembuatan Backend - Modul Pokok Doa

Dokumen ini adalah panduan teknis untuk membangun backend yang sesuai dengan fitur-fitur pokok doa pada aplikasi frontend.

**Stack Teknologi:**
- **Framework:** Next.js (sebagai backend/API routes)
- **ORM:** Prisma
- **Database:** PostgreSQL

---

## 1. Model Database (Prisma Schema)

Definisikan model `PrayerRequest` dalam file `schema.prisma`. Model ini akan menjadi dasar untuk semua operasi terkait permohonan doa dari jemaat.

```prisma
// Tambahkan model ini ke dalam file schema.prisma Anda

model PrayerRequest {
  id            String    @id @default(cuid())
  userName      String    // Nama yang ditampilkan (bisa nama asli atau "Anonim")
  requestText   String    @db.Text
  isAnonymous   Boolean

  submittedDate DateTime  @default(now())
  isResponded   Boolean   @default(false)
  
  responseText  String?   @db.Text
  lastResponseBy String?   // Nama admin yang terakhir menjawab

  isArchived    Boolean   @default(false)
  archivedDate  DateTime?

  // Relasi dengan Jemaat (Member) yang mengajukan, bahkan jika anonim
  submittedById String
  submittedBy   Member @relation(fields: [submittedById], references: [id], onDelete: Cascade)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// Anda perlu menambahkan relasi balik pada model Member
model Member {
  // ... (kolom yang sudah ada)

  // Relasi: Satu jemaat bisa mengajukan banyak pokok doa
  prayerRequests PrayerRequest[]
}
```

**Catatan Penting:**
- Jalankan `npx prisma migrate dev` setelah menambahkan model ini untuk memperbarui skema database Anda.
- Relasi `submittedBy` ke model `Member` sangat penting untuk melacak siapa pengirim asli dari permohonan doa yang bersifat anonim, tanpa menampilkannya ke publik.

---

## 2. Endpoint API

Berikut adalah daftar endpoint API yang perlu Anda buat. Semua endpoint manajemen (`GET`, `POST /respond`, `PATCH`, `DELETE`) harus diproteksi dengan *middleware* otentikasi JWT dan memerlukan hak akses khusus.

### a. Endpoint untuk Jemaat

- **Endpoint:** `POST /api/prayers`
  - **Tujuan:** Membuat permohonan doa baru dari halaman "Dukungan Doa".
  - **Request Body:** `{ "userName": "Nama Jemaat (opsional)", "requestText": "Isi permohonan doa...", "isAnonymous": true/false }`
  - **Logika:**
    1. Verifikasi JWT untuk mendapatkan `userId` dari `submittedById`.
    2. Jika `userName` kosong, pastikan `isAnonymous` bernilai `true` dan set `userName` menjadi "Anonim".
    3. Buat entri baru di tabel `PrayerRequest`.
  - **Success Response (201 Created):** `{ ...data_permohonan_doa_baru }`

### b. Endpoint Manajemen (Khusus Admin)

Endpoint berikut memerlukan verifikasi JWT dan hak akses yang sesuai pada modul `prayers`.

- **Endpoint:** `GET /api/prayers`
  - **Tujuan:** Mendapatkan daftar semua permohonan doa untuk halaman manajemen.
  - **Logika:**
    1. Verifikasi JWT dan hak akses `read` pada modul `prayers`.
    2. Ambil semua data dari tabel `PrayerRequest`, diurutkan berdasarkan `submittedDate` (terbaru lebih dulu).
  - **Success Response (200 OK):** `[ { ...doa_1 }, { ...doa_2 } ]`

- **Endpoint:** `POST /api/prayers/:id/respond`
  - **Tujuan:** Menanggapi atau memperbarui tanggapan doa.
  - **Request Body:** `{ "responseText": "Tanggapan dari admin..." }`
  - **Logika:**
    1. Verifikasi JWT dan hak akses `edit` pada modul `prayers`.
    2. Ambil nama admin dari data pengguna yang terautentikasi (`req.user.name`).
    3. Cari permohonan berdasarkan `:id`.
    4. Update kolom `responseText`, `lastResponseBy`, dan set `isResponded` menjadi `true`.
  - **Success Response (200 OK):** `{ ...permohonan_terbaru_dengan_tanggapan }`

- **Endpoint:** `PATCH /api/prayers/:id/archive`
  - **Tujuan:** Mengarsipkan sebuah permohonan doa.
  - **Logika:**
    1. Verifikasi JWT dan hak akses `edit` atau `delete`.
    2. Update kolom `isArchived` menjadi `true` dan `archivedDate` ke waktu saat ini.
  - **Success Response (200 OK):** `{ ...permohonan_dengan_status_arsip }`

- **Endpoint:** `DELETE /api/prayers`
  - **Tujuan:** Menghapus beberapa permohonan doa yang sudah diarsipkan.
  - **Request Body:** `{ "ids": ["cuid_1", "cuid_2", ...] }`
  - **Logika:**
    1. Verifikasi JWT dan hak akses `delete`.
    2. Hapus semua entri dari tabel `PrayerRequest` yang ID-nya ada di dalam array `ids`.
  - **Success Response (204 No Content):** (Tidak ada body respons)

---
