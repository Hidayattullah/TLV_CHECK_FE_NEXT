# Panduan Pengembangan Aplikasi Mobile (Flutter)

Dokumen ini adalah panduan teknis untuk membangun versi mobile dari aplikasi ini menggunakan Flutter. Panduan ini dirancang untuk memastikan proyek yang dihasilkan bersih, terstruktur, dapat di-maintain, dan siap untuk dikembangkan lebih lanjut.

**Stack Teknologi yang Direkomendasikan:**
- **Framework:** Flutter
- **Bahasa:** Dart
- **Manajemen State:** Bloc / Riverpod (Pilih salah satu sesuai preferensi tim)
- **Navigasi:** GoRouter
- **Klien HTTP:** Dio
- **UI:** Material 3 dengan kustomisasi tema

---

## 1. Struktur Proyek

Struktur folder yang baik adalah kunci untuk proyek yang terorganisir. Berikut adalah struktur yang direkomendasikan:

```
lib/
├── main.dart                 # Entry point aplikasi
├── app/
│   ├── routes/               # Konfigurasi GoRouter (navigasi)
│   ├── theme/                # Tema aplikasi (warna, tipografi)
│   └── app.dart              # Root widget aplikasi (MaterialApp)
│
├── core/
│   ├── api/                  # Klien API (Dio), endpoint, interceptor
│   ├── constants/            # Konstanta (kunci API, nama route)
│   ├── di/                   # Dependency Injection (jika digunakan, misal: get_it)
│   ├── error/                # Exception & Failure handling
│   ├── usecases/             # Logika bisnis abstrak
│   └── utils/                # Fungsi utilitas umum (validator, formatter)
│
├── data/
│   ├── models/               # Model data (from/to JSON) untuk respons API
│   ├── repositories/         # Implementasi repository (mengambil data dari API/lokal)
│   └── datasources/          # Sumber data (remote API, local storage)
│
├── domain/
│   ├── entities/             # Entitas bisnis (objek Dart murni)
│   └── repositories/         # Kontrak/interface untuk repository
│
└── presentation/
    ├── common_widgets/       # Widget yang digunakan di banyak layar (custom button, etc)
    ├── features/             # Direktori utama untuk setiap fitur
    │   ├── auth/
    │   │   ├── cubit/          # Cubit/Bloc untuk fitur otentikasi
    │   │   ├── screens/        # Layar (Login, Register, Reset Password)
    │   │   └── widgets/        # Widget spesifik untuk fitur auth
    │   │
    │   ├── dashboard/
    │   │   ├── cubit/
    │   │   ├── screens/
    │   │   └── widgets/
    │   │
    │   ├── check_in/
    │   │   ├── cubit/
    │   │   ├── screens/
    │   │   └── widgets/
    │   │
    │   └── ... (fitur lainnya seperti prayer, question, ticket, management)
    │
    └── navigation/             # Widget navigasi (Bottom Navigation Bar)

```

---

## 2. Manajemen State

Pilih salah satu pendekatan manajemen state yang modern dan skalabel:

- **BLoC (Business Logic Component):** Sangat baik untuk memisahkan logika bisnis dari UI. Gunakan `flutter_bloc` package. Cocok untuk aplikasi yang kompleks.
- **Riverpod:** Pendekatan yang lebih modern dan fleksibel. Memberikan solusi yang lebih sederhana untuk dependency injection dan caching state.

**Prinsip Umum:**
- Setiap fitur harus memiliki **Bloc/Cubit** atau **Provider** sendiri.
- UI hanya bertugas untuk me-render state dan mengirim event/aksi ke Bloc/Provider.
- Jangan letakkan logika bisnis (validasi, pemanggilan API) di dalam widget UI.

---

## 3. Panduan Implementasi Fitur

Berikut adalah panduan untuk mengimplementasikan setiap fitur utama.

### a. Otentikasi & Jemaat (Auth & Members)
- **Model:** Buat model `MemberModel` di `data/models` yang sesuai dengan respons API dari backend.
- **Repository:** Buat `AuthRepository` untuk menangani `login`, `register`, `logout`, dan `getProfile`.
- **State Management:**
  - `AuthCubit`/`AuthProvider` akan mengelola state otentikasi global (`authenticated`, `unauthenticated`, `loading`).
  - `LoginCubit`, `RegisterCubit` akan mengelola state form di masing-masing layar.
- **UI:**
  - `login_screen.dart`, `register_screen.dart`, `reset_password_screen.dart`.
  - Gunakan `TextFormField` dengan `validator` untuk validasi input.
- **Penyimpanan Token:** Setelah login berhasil, simpan JWT menggunakan package `flutter_secure_storage`.
- **Klien HTTP (Dio):** Buat *interceptor* untuk Dio yang secara otomatis menambahkan `Authorization: Bearer <token>` pada setiap request.

### b. Check-in
- **Model:** `CheckInEventModel`, `AttendeeModel`.
- **Repository:** `CheckInRepository` dengan fungsi `getEvents`, `getEventById`, `createEvent`, `updateEventStatus`, `addAttendee`.
- **State Management:** `CheckInCubit` untuk mengelola daftar acara dan `CheckInDetailCubit` untuk detail acara (termasuk daftar hadir).
- **UI:**
  - **Layar Pengguna:** `check_in_history_screen.dart` untuk menampilkan riwayat.
  - **Layar Manajemen:** `check_in_creation_screen.dart` untuk mengelola acara (CRUD).
  - **QR Scanner:** Gunakan package `mobile_scanner` untuk memindai QR code. Logika pemindaian akan memanggil `addAttendee`.
  - **QR Display:** Gunakan package `qr_flutter` untuk menampilkan QR code di `display_screen.dart`. Gunakan `StreamBuilder` atau `Timer.periodic` untuk auto-refresh data kehadiran.

### c. Dukungan Doa (Prayer Support)
- **Model:** `PrayerRequestModel`.
- **Repository:** `PrayerRepository` dengan fungsi `getPrayers`, `submitPrayer`, `respondToPrayer`.
- **State Management:** `PrayerCubit` untuk mengelola daftar permohonan doa (baik untuk pengguna maupun admin).
- **UI:**
  - **Layar Pengguna:** `prayer_support_screen.dart` dengan form untuk mengirim doa dan daftar riwayat doa.
  - **Layar Manajemen:** `prayers_management_screen.dart` untuk melihat semua permohonan dan memberikan tanggapan.

### d. Pertanyaan & Jawaban (Questions)
- **Model:** `QuestionModel`.
- **Repository:** `QuestionRepository` dengan fungsi `getQuestions`, `submitQuestion`, `respondToQuestion`.
- **State Management:** `QuestionCubit` untuk mengelola daftar pertanyaan (baik untuk pengguna maupun admin).
- **UI:** Implementasi mirip dengan modul Dukungan Doa.

### e. Tiket Dukungan (Support Tickets)
- **Model:** `SupportTicketModel`.
- **Repository:** `TicketRepository` dengan fungsi `createTicket`, `getTicketById`, `getAllTickets`, `updateTicketStatus`.
- **State Management:** `TicketCubit` untuk mengelola daftar tiket di sisi admin.
- **UI:**
  - **Layar Pengguna:** `support_ticket_screen.dart` dengan form pembuatan tiket dan form pencarian status tiket.
  - **Layar Manajemen:** `tickets_management_screen.dart` dengan `TabView` untuk memisahkan tiket berdasarkan status ("Proses", "Selesai", "Ditolak").

---

## 4. Rekomendasi Package (pub.dev)

- `flutter_bloc` atau `flutter_riverpod`: Untuk manajemen state.
- `go_router`: Untuk navigasi berbasis URL yang kuat.
- `dio`: Untuk networking (HTTP client).
- `flutter_secure_storage`: Untuk menyimpan JWT dengan aman.
- `freezed`: Untuk membuat model data yang immutable.
- `json_serializable`: Untuk konversi JSON.
- `get_it` & `injectable`: Untuk dependency injection.
- `mobile_scanner`: Untuk pemindai QR code.
- `qr_flutter`: Untuk menampilkan QR code.
- `intl`: Untuk format tanggal dan waktu.

---

## 5. Tips Tambahan

- **Pemisahan UI & Logika:** Pastikan widget hanya berisi kode UI. Semua logika (validasi, kalkulasi, pemanggilan API) harus berada di dalam Bloc/Cubit/Provider.
- **Error Handling:** Implementasikan sistem error handling yang solid. Setiap panggilan API harus memiliki penanganan `try-catch` yang mengubah *exception* menjadi *state* error di UI.
- **Penamaan File:** Gunakan `snake_case` untuk nama file (e.g., `login_screen.dart`, `custom_button.dart`).
- **Penamaan Class:** Gunakan `PascalCase` untuk nama class (e.g., `LoginScreen`, `AuthRepository`).
- **Styling:** Definisikan tema sentral di `app/theme`. Gunakan `Theme.of(context)` untuk mengakses warna dan style di seluruh aplikasi untuk konsistensi.
