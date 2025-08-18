# Panduan Pembuatan Backend - Modul Pertanyaan Jemaat

Dokumen ini adalah panduan teknis untuk membangun backend yang sesuai dengan fitur-fitur pertanyaan jemaat pada aplikasi frontend.

**Stack Teknologi:**
- **Framework:** Next.js (sebagai backend/API routes)
- **ORM:** Prisma
- **Database:** PostgreSQL

---

## 1. Model Database (Prisma Schema)

Definisikan model `Question` dalam file `schema.prisma`. Model ini akan menjadi dasar untuk semua operasi terkait pertanyaan dari jemaat.

```prisma
// Tambahkan model ini ke dalam file schema.prisma Anda

model Question {
  id            String    @id @default(cuid())
  userName      String    // Nama yang ditampilkan (bisa jadi nama asli atau "Anonim")
  questionText  String    @db.Text

  submittedDate DateTime  @default(now())
  isResponded   Boolean   @default(false)
  
  responseText  String?   @db.Text
  responseBy    String?   // Nama admin yang menjawab
  respondedDate DateTime?

  isArchived    Boolean   @default(false)
  archivedDate  DateTime?

  // Relasi dengan Jemaat (Member) yang mengajukan pertanyaan
  submittedById String
  submittedBy   Member @relation(fields: [submittedById], references: [id], onDelete: Cascade)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// Anda perlu menambahkan relasi balik pada model Member
model Member {
  // ... (kolom yang sudah ada)

  // Relasi: Satu jemaat bisa mengajukan banyak pertanyaan
  questions Question[]
}
```

**Catatan Penting:**
- Jalankan `npx prisma migrate dev` setelah menambahkan model ini untuk memperbarui skema database Anda.
- Relasi `submittedBy` ke model `Member` memastikan integritas data dan memungkinkan admin melihat siapa pengirim pertanyaan meskipun pertanyaan tersebut ditampilkan secara anonim.

---

## 2. Endpoint API

Berikut adalah daftar endpoint API yang perlu Anda buat. Semua endpoint manajemen (`GET`, `POST /respond`, `PATCH`, `DELETE`) harus diproteksi dengan *middleware* otentikasi JWT dan memerlukan hak akses khusus.

### a. Endpoint untuk Jemaat

- **Endpoint:** `POST /api/questions`
  - **Tujuan:** Membuat pertanyaan baru dari halaman "Pertanyaan & Jawaban".
  - **Request Body:** `{ "questionText": "Isi pertanyaan..." }`
  - **Logika:**
    1. Verifikasi JWT untuk mendapatkan `userId` dari `submittedById`.
    2. Ambil `name` dari data pengguna yang terautentikasi.
    3. Buat entri baru di tabel `Question` dengan data tersebut.
  - **Success Response (201 Created):** `{ ...data_pertanyaan_baru }`

### b. Endpoint Manajemen (Khusus Admin)

Endpoint berikut memerlukan verifikasi JWT dan hak akses yang sesuai pada modul `questions`.

- **Endpoint:** `GET /api/questions`
  - **Tujuan:** Mendapatkan daftar semua pertanyaan untuk halaman manajemen.
  - **Logika:**
    1. Verifikasi JWT dan hak akses `read` pada modul `questions`.
    2. Ambil semua data dari tabel `Question`, diurutkan berdasarkan `submittedDate` (terbaru lebih dulu).
  - **Success Response (200 OK):** `[ { ...pertanyaan_1 }, { ...pertanyaan_2 } ]`

- **Endpoint:** `POST /api/questions/:id/respond`
  - **Tujuan:** Menjawab atau memperbarui jawaban sebuah pertanyaan.
  - **Request Body:** `{ "responseText": "Jawaban dari admin..." }`
  - **Logika:**
    1. Verifikasi JWT dan hak akses `edit` pada modul `questions`.
    2. Ambil nama admin dari data pengguna yang terautentikasi.
    3. Cari pertanyaan berdasarkan `:id`.
    4. Update kolom `responseText`, `responseBy`, `isResponded` (set ke `true`), dan `respondedDate` ke waktu saat ini.
  - **Success Response (200 OK):** `{ ...pertanyaan_terbaru_dengan_jawaban }`

- **Endpoint:** `PATCH /api/questions/:id/archive`
  - **Tujuan:** Mengarsipkan sebuah pertanyaan.
  - **Logika:**
    1. Verifikasi JWT dan hak akses `edit` atau `delete` pada modul `questions`.
    2. Update kolom `isArchived` menjadi `true` dan `archivedDate` ke waktu saat ini.
  - **Success Response (200 OK):** `{ ...pertanyaan_dengan_status_arsip }`

- **Endpoint:** `DELETE /api/questions`
  - **Tujuan:** Menghapus beberapa pertanyaan yang sudah diarsipkan secara permanen.
  - **Request Body:** `{ "ids": ["cuid_1", "cuid_2", ...] }`
  - **Logika:**
    1. Verifikasi JWT dan hak akses `delete`.
    2. Hapus semua entri dari tabel `Question` yang ID-nya ada di dalam array `ids`.
  - **Success Response (204 No Content):** (Tidak ada body respons)

---
