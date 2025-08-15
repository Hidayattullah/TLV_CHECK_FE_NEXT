# Panduan Pembuatan Backend - Modul Check-in

Dokumen ini adalah panduan teknis untuk membangun backend yang sesuai dengan fitur-fitur check-in pada aplikasi frontend.

**Stack Teknologi:**
- **Framework:** Next.js (sebagai backend/API routes)
- **ORM:** Prisma
- **Database:** PostgreSQL

---

## 1. Model Database (Prisma Schema)

Definisikan model `Event` dan `CheckIn` dalam file `schema.prisma`. Model ini akan menjadi dasar untuk semua operasi terkait acara dan kehadiran.

```prisma
// Tambahkan model ini ke dalam file schema.prisma Anda

// Model untuk menyimpan setiap acara atau ibadah
model Event {
  id        String   @id @default(cuid())
  eventName String
  eventDate DateTime
  isActive  Boolean  @default(true) // Menandakan apakah acara sedang berlangsung

  // Relasi: Satu acara bisa memiliki banyak check-in
  checkIns  CheckIn[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Model untuk mencatat setiap kehadiran (check-in)
model CheckIn {
  id        String   @id @default(cuid())
  checkinTime DateTime @default(now())
  checkinMethod String // "Barcode" atau "RFID"

  // Relasi dengan Jemaat (Member)
  memberId  String
  member    Member   @relation(fields: [memberId], references: [id], onDelete: Cascade)

  // Relasi dengan Acara (Event)
  eventId   String
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@unique([memberId, eventId]) // Pastikan satu jemaat hanya bisa check-in sekali per acara
}

// Anda perlu menambahkan relasi balik pada model Member
model Member {
  // ... (kolom yang sudah ada)

  // Relasi: Satu jemaat bisa memiliki banyak catatan check-in
  checkIns CheckIn[]
}
```

**Catatan Penting:**
- Jalankan `npx prisma migrate dev` setelah menambahkan model ini untuk memperbarui skema database Anda.
- Atribut `onDelete: Cascade` pada relasi memastikan bahwa jika sebuah `Event` atau `Member` dihapus, semua catatan `CheckIn` yang terkait juga akan terhapus.

---

## 2. Endpoint API

Berikut adalah daftar endpoint API yang perlu Anda buat di dalam direktori `/pages/api` atau `/app/api`. Semua endpoint ini harus diproteksi dengan *middleware* otentikasi JWT (kecuali `GET /api/check-in/events/:id` untuk layar display).

### a. Manajemen Acara (Event)

- **Endpoint:** `GET /api/check-in/events`
  - **Tujuan:** Mendapatkan daftar semua acara. Digunakan di halaman "Kelola Check-in" dan "Layar Check-in".
  - **Logika:** Verifikasi hak akses `read` pada modul `checkin`. Ambil semua data dari tabel `Event` beserta jumlah `checkIns`.
  - **Success Response (200 OK):** `[ { id, eventName, eventDate, isActive, _count: { checkIns: 5 } }, ... ]`

- **Endpoint:** `POST /api/check-in/events`
  - **Tujuan:** Membuat acara check-in baru.
  - **Request Body:** `{ "eventName": "Ibadah Raya Pagi", "eventDate": "YYYY-MM-DD" }`
  - **Logika:** Verifikasi hak akses `edit` pada modul `checkin`. Buat entri baru di tabel `Event`. `isActive` default-nya `true`.
  - **Success Response (201 Created):** `{ ...data_event_baru }`

- **Endpoint:** `PATCH /api/check-in/events/:id`
  - **Tujuan:** Memperbarui detail acara (nama dan tanggal).
  - **Request Body:** `{ "eventName": "Nama Acara Baru", "eventDate": "YYYY-MM-DD" }`
  - **Logika:** Verifikasi hak akses `edit` pada modul `checkin`. Update data di tabel `Event`.
  - **Success Response (200 OK):** `{ ...data_event_terbaru }`

- **Endpoint:** `DELETE /api/check-in/events/:id`
  - **Tujuan:** Menghapus sebuah acara.
  - **Logika:** Verifikasi hak akses `delete` pada modul `checkin`. Hapus entri dari tabel `Event`.
  - **Success Response (204 No Content):** (Tidak ada body respons)

### b. Manajemen Status Acara & Kehadiran

- **Endpoint:** `GET /api/check-in/events/:id`
  - **Tujuan:** Mengambil detail satu acara beserta daftar jemaat yang hadir. Digunakan untuk layar display QR dan dialog daftar hadir.
  - **Logika:** Endpoint ini mungkin perlu publik (tanpa JWT) untuk layar display. Ambil data `Event` dan relasi `checkIns` beserta data `member` yang terkait.
  - **Success Response (200 OK):**
    ```json
    {
      "id": "cuid_event",
      "eventName": "Ibadah Raya 1",
      "eventDate": "...",
      "isActive": true,
      "attendees": [
        { "id": "cuid_member", "name": "Nama Jemaat", "checkinTime": "...", "checkinMethod": "Barcode" },
        ...
      ]
    }
    ```

- **Endpoint:** `PATCH /api/check-in/events/:id/status`
  - **Tujuan:** Mengubah status acara menjadi "Aktif" atau "Selesai".
  - **Request Body:** `{ "isActive": true }` atau `{ "isActive": false }`
  - **Logika:** Verifikasi hak akses `edit` pada modul `checkin`. Update kolom `isActive` pada tabel `Event`. Hapus logika timer jika ada.
  - **Success Response (200 OK):** `{ ...data_event_dengan_status_baru }`

- **Endpoint:** `POST /api/check-in/events/:id/timer`
  - **Tujuan:** Mengaktifkan acara dan mengatur timer untuk menonaktifkannya secara otomatis.
  - **Request Body:** `{ "hours": 2 }`
  - **Logika:** Verifikasi hak akses `edit`. Set `isActive` menjadi `true`. Simpan `timerEndsAt` (waktu sekarang + `hours`). Gunakan *scheduler* atau *cron job* di backend (misalnya dengan `node-cron`) untuk menjalankan fungsi yang mengubah `isActive` menjadi `false` saat waktunya tiba.
  - **Success Response (200 OK):** `{ ...data_event_dengan_timer }`

- **Endpoint:** `POST /api/check-in/events/:id/attendees`
  - **Tujuan:** Menambahkan jemaat ke daftar hadir (simulasi scan QR).
  - **Request Body:** `{ "memberId": "cuid_jemaat", "checkinMethod": "Barcode" }`
  - **Logika:**
    1. Verifikasi JWT untuk mendapatkan `memberId` (atau terima dari body jika discan oleh admin).
    2. Cek apakah `event` dengan `:id` ada dan `isActive`.
    3. Cek apakah jemaat sudah pernah check-in untuk acara ini (query `CheckIn` dengan `memberId` dan `eventId`).
    4. Jika belum, buat entri baru di tabel `CheckIn`.
  - **Success Response (201 Created):** `{ ...data_event_terbaru_dengan_kehadiran_baru }`

### c. Riwayat Personal

- **Endpoint:** `GET /api/members/:userId/check-in-history`
  - **Tujuan:** Mendapatkan riwayat check-in pribadi untuk seorang jemaat.
  - **Logika:** Verifikasi JWT dan pastikan `:userId` cocok dengan ID pengguna di token (atau pengguna adalah admin). Ambil semua data `CheckIn` untuk `userId` tersebut, beserta relasi ke `Event`.
  - **Success Response (200 OK):**
    ```json
    [
      {
        "id": "cuid_checkin",
        "service": "Ibadah Raya 1", // Diambil dari event.eventName
        "checkinDate": "...", // Diambil dari checkIn.checkinTime
        "checkinMethod": "Barcode"
      },
      ...
    ]
    ```
---
