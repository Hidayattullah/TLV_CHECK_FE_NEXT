# Panduan Integrasi API Backend - Autentikasi & Jemaat

Dokumen ini adalah panduan teknis untuk menghubungkan aplikasi frontend Next.js ini dengan backend sesungguhnya (misalnya, backend NestJS yang telah didokumentasikan). Panduan ini akan menggantikan penggunaan *mock API* (data palsu) dengan panggilan API yang sebenarnya.

---

## 1. Prasyarat

Sebelum memulai, pastikan Anda memiliki:
1.  **Backend yang Berjalan**: Sebuah server backend (NestJS, Express, dll.) yang sudah berjalan dan dapat diakses dari aplikasi frontend.
2.  **Endpoint yang Sesuai**: Backend Anda harus sudah mengimplementasikan endpoint-endpoint yang didefinisikan dalam `docs/backend/MEMBER.md`, terutama untuk registrasi dan login.
3.  **Konfigurasi CORS**: Backend Anda harus dikonfigurasi untuk menerima permintaan dari domain tempat aplikasi frontend Anda berjalan (misalnya, `http://localhost:9002` untuk pengembangan).

---

## 2. Langkah-langkah Integrasi

### a. Konfigurasi URL Backend

Cara terbaik untuk mengelola URL API adalah melalui *environment variables*.

1.  **Buat File `.env.local`**: Jika belum ada, buat file baru bernama `.env.local` di root proyek Anda. File ini tidak akan masuk ke dalam *version control* (Git).

2.  **Tambahkan Variabel**: Di dalam `.env.local`, tambahkan variabel berikut dan arahkan ke URL base backend Anda:

    ```bash
    # Contoh untuk backend yang berjalan di localhost port 3000
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
    ```

    **Penting**: Variabel harus diawali dengan `NEXT_PUBLIC_` agar dapat diakses di sisi klien (browser) oleh Next.js.

### b. Mengganti Implementasi Mock dengan API Sebenarnya

Struktur proyek ini sengaja dirancang untuk memudahkan peralihan dari *mock* ke *API live*. Anda hanya perlu mengubah impor di beberapa file.

**Contoh: Mengganti Fungsi Login**

1.  **Buka File**: Buka file yang menggunakan fungsi otentikasi, misalnya `src/app/login/page.tsx`.

2.  **Cari Impor**: Temukan baris impor yang mengarah ke `repository_mock`:

    ```typescript
    // Sebelum
    import { login as loginUser } from "@/lib/repository_mock/members";
    ```

3.  **Ubah Impor**: Ubah path impor dari `repository_mock` menjadi `repository`:

    ```typescript
    // Sesudah
    import { login as loginUser } from "@/lib/repository/members";
    ```

4.  **Lakukan Hal yang Sama**: Terapkan perubahan serupa untuk semua fungsi lain yang Anda gunakan (misalnya `addMember` di `src/app/register/page.tsx`, `getMembers` di `src/app/members-management/page.tsx`, dll.).

---

## 3. Cara Kerjanya

- **`src/lib/api/endpoints.ts`**: File ini secara dinamis membangun URL endpoint lengkap menggunakan `NEXT_PUBLIC_API_URL` yang Anda atur. Jika variabel tidak diatur, ia akan default ke `/api`, yang cocok untuk API routes Next.js.

- **`src/lib/api/client.ts`**: Ini adalah *fetch client* kustom. Setiap kali fungsi dari `src/lib/repository/*` dipanggil, `customFetch` akan:
  - Membaca `authToken` dari `localStorage`.
  - Secara otomatis menambahkan header `Authorization: Bearer <token>` ke setiap permintaan API (kecuali untuk endpoint publik seperti login/register).

- **`src/hooks/use-auth.tsx`**: Hook ini mengelola state login pengguna. Saat fungsi `login()` dipanggil dengan token dari backend, token tersebut disimpan di `localStorage` dan data pengguna diambil.

Dengan mengikuti langkah-langkah ini, aplikasi Anda akan berhenti menggunakan data palsu dan mulai berkomunikasi dengan backend Anda yang sebenarnya.