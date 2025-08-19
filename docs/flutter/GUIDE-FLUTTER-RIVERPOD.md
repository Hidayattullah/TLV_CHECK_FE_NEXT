# Panduan Pengembangan Aplikasi Flutter (Arsitektur MVVM dengan Riverpod)

Dokumen ini adalah panduan teknis lanjutan untuk membangun aplikasi mobile menggunakan Flutter dengan fokus pada arsitektur **MVVM (Model-View-ViewModel)**, manajemen state **Riverpod**, dan prinsip-prinsip pengembangan perangkat lunak modern seperti **SOLID** dan **DRY**.

---

## 1. Prinsip & Arsitektur Inti

### a. Arsitektur MVVM (Model-View-ViewModel)
- **Model**: Merepresentasikan data dan logika bisnis (misalnya, `Member`, `Event`). Ini adalah *Plain Old Dart Objects* (PODOs) dan tidak boleh berisi logika platform apa pun.
- **View**: Layer UI (Widget) yang bertugas menampilkan data dari ViewModel dan meneruskan aksi pengguna (misalnya, klik tombol) ke ViewModel. **View harus "bodoh"**—tidak berisi logika bisnis.
- **ViewModel**: Jembatan antara Model dan View. ViewModel mengambil data dari `Repository`, mengolahnya sesuai kebutuhan UI, dan mengekspos `state` yang bisa di-listen oleh View. Ini juga berisi fungsi yang dipanggil oleh View untuk menjalankan aksi (misalnya, `login()`, `fetchEvents()`).

### b. Prinsip SOLID
- **Single Responsibility**: Setiap kelas (ViewModel, Repository, Service) hanya memiliki satu tanggung jawab.
- **Open/Closed**: Kelas harus terbuka untuk ekstensi tetapi tertutup untuk modifikasi. Kita capai ini dengan menggunakan `abstract class` (kontrak) untuk repository.
- **Liskov Substitution**: Turunan kelas harus bisa menggantikan kelas induknya.
- **Interface Segregation**: Kontrak (interface) harus spesifik. Jangan paksa kelas mengimplementasikan metode yang tidak dibutuhkannya.
- **Dependency Inversion**: Modul level tinggi (ViewModel) tidak boleh bergantung pada modul level rendah (sumber data konkret), melainkan pada abstraksi (Repository). Riverpod sangat membantu dalam hal ini melalui *Dependency Injection*.

### c. Prinsip DRY (Don't Repeat Yourself)
Hindari duplikasi kode dengan membuat widget, fungsi, atau kelas yang dapat digunakan kembali. Contoh: `CustomButton`, `FormFieldValidator`, `ApiClient`.

---

## 2. Struktur Proyek

Struktur ini dirancang untuk memisahkan setiap layer dengan jelas sesuai dengan arsitektur MVVM.

```
lib/
├── main.dart                 # Entry point aplikasi
│
├── core/                     # Kode inti yang tidak terkait fitur
│   ├── api/                  # Konfigurasi Dio, interceptor, konstanta endpoint
│   ├── config/               # Tema (styling), router (GoRouter)
│   ├── constants/            # String, path aset, dll.
│   ├── providers/            # Provider Riverpod global (misal: Dio, SharedPreferences)
│   └── utils/                # Fungsi utilitas (formatter, validator)
│
├── data/                     # Layer data: model dan sumber data
│   ├── models/               # Model data dari JSON (dengan `fromJson`/`toJson`)
│   └── repositories/         # Implementasi Repository (mengambil data dari API)
│
├── domain/                   # Layer domain: entitas bisnis dan kontrak repository
│   ├── entities/             # Entitas Dart murni (PODOs)
│   └── repositories/         # Kontrak/Interface (abstract class) untuk repository
│
└── presentation/             # Layer UI (View & ViewModel)
    ├── common_widgets/       # Widget reusable (CustomButton, LoadingIndicator)
    ├── features/             # Direktori untuk setiap fitur aplikasi
    │   ├── auth/
    │   │   ├── view/           # Layar/Widget (LoginScreen, RegisterScreen)
    │   │   └── viewmodel/      # ViewModel (LoginViewModel, AuthStateNotifier)
    │   │
    │   ├── check_in/
    │   │   ├── view/
    │   │   └── viewmodel/
    │   │
    │   └── ... (fitur lainnya)
    │
    └── viewmodels/             # ViewModel global/bersama (jika ada)

```

---

## 3. Styling & Tema

Konsistensi UI adalah kunci. Definisikan semua properti visual di satu tempat.

**Lokasi**: `lib/core/config/theme.dart`

```dart
import 'package:flutter/material.dart';

class AppTheme {
  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: AppColors.background, // Latar belakang utama
    primaryColor: AppColors.primary, // Ungu
    
    // Tema AppBar
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.primary,
      foregroundColor: AppColors.primaryForeground, // Teks & ikon di AppBar
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
    ),

    // Tema Card
    cardTheme: const CardTheme(
      color: AppColors.card, // Putih
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(16)),
      ),
    ),

    // Tema Button
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.primaryForeground,
        minimumSize: const Size(double.infinity, 52),
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(12)),
        ),
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
    
    // Tema Input
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.secondary, // Abu-abu muda
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      hintStyle: TextStyle(color: AppColors.mutedForeground),
    ),
    
    // Skema Warna
    colorScheme: const ColorScheme.light(
      primary: AppColors.primary,
      secondary: AppColors.secondary,
      background: AppColors.background,
      surface: AppColors.card,
      error: Colors.red,
    ),
  );
}

// Penamaan warna yang mudah dipahami
class AppColors {
  // Warna Primer
  static const Color primary = Color(0xFF8B2671); // Ungu untuk header, tombol
  static const Color primaryForeground = Colors.white; // Teks di atas warna primer

  // Warna Background
  static const Color background = Color(0xFFFAF9F6); // Latar belakang utama aplikasi
  static const Color card = Colors.white; // Background untuk Card

  // Warna Sekunder & Aksen
  static const Color secondary = Color(0xFFF0F0F0); // Background input
  static const Color accent = Color(0xFF931c58); // Magenta gelap untuk aksen

  // Warna Teks
  static const Color foreground = Color(0xFF2E2E2E); // Teks utama
  static const Color mutedForeground = Color(0xFF666666); // Teks non-fokus/hint
}
```

---

## 4. Manajemen State dengan Riverpod

Riverpod digunakan untuk *Dependency Injection* dan manajemen state.

- **Provider**: Untuk menyediakan instance yang *read-only* (misal: `Dio`, `AuthRepository`).
  ```dart
  // lib/core/providers/dio_provider.dart
  final dioProvider = Provider<Dio>((ref) => Dio());
  
  // lib/data/repositories/auth_repository_impl.dart
  final authRepositoryProvider = Provider<AuthRepository>((ref) {
    return AuthRepositoryImpl(ref.watch(dioProvider));
  });
  ```

- **StateNotifierProvider**: Untuk state yang bisa berubah dan perlu di-listen oleh UI. ViewModel kita akan menggunakan ini.
  ```dart
  // lib/presentation/features/auth/viewmodel/login_viewmodel.dart
  final loginViewModelProvider = StateNotifierProvider<LoginViewModel, LoginState>((ref) {
    return LoginViewModel(ref.watch(authRepositoryProvider));
  });
  ```

- **ConsumerWidget / Consumer**: Gunakan `ConsumerWidget` untuk me-rebuild seluruh widget atau `Consumer` untuk me-rebuild sebagian kecil dari UI saat state berubah.

---

## 5. Panduan Implementasi Fitur (Contoh: Otentikasi)

### a. Domain Layer
- **Entitas**: `lib/domain/entities/member.dart` (PODO murni).
- **Kontrak Repository**: `lib/domain/repositories/auth_repository.dart`
  ```dart
  abstract class AuthRepository {
    Future<void> login(String phoneNumber, String password);
    Future<Member> getProfile();
    // ... metode lainnya
  }
  ```

### b. Data Layer
- **Model**: `lib/data/models/member_model.dart` (extends `Member` entity, dengan `fromJson`/`toJson`). Model ini juga harus mencakup `permissions`.
  ```dart
  // Contoh struktur permissions di dalam model
  class Permissions {
      final List<String> members;
      final List<String> checkin;
      // ...modul lainnya
  }
  ```
- **Implementasi Repository**: `lib/data/repositories/auth_repository_impl.dart`
  ```dart
  class AuthRepositoryImpl implements AuthRepository {
    final Dio _dio;
    AuthRepositoryImpl(this._dio);

    @override
    Future<void> login(String phoneNumber, String password) async {
      // Logika memanggil API login dengan Dio
    }
    // ... implementasi metode lainnya
  }
  ```

### c. Presentation Layer
- **ViewModel**: `lib/presentation/features/auth/viewmodel/login_viewmodel.dart`
  ```dart
  // Definisikan State (misal: initial, loading, success, error)
  @freezed
  class LoginState with _$LoginState {
    const factory LoginState.initial() = _Initial;
    const factory LoginState.loading() = _Loading;
    const factory LoginState.success(Member member) = _Success; // Kirim data member
    const factory LoginState.error(String message) = _Error;
  }
  
  class LoginViewModel extends StateNotifier<LoginState> {
    final AuthRepository _authRepository;
    
    LoginViewModel(this._authRepository) : super(const LoginState.initial());
    
    Future<void> login(String phoneNumber, String password) async {
      state = const LoginState.loading();
      try {
        // Asumsi API login me-return data member
        final member = await _authRepository.login(phoneNumber, password);
        state = LoginState.success(member);
      } catch (e) {
        state = LoginState.error(e.toString());
      }
    }
  }
  ```
- **View**: `lib/presentation/features/auth/view/login_screen.dart`
  ```dart
  class LoginScreen extends ConsumerWidget {
    const LoginScreen({super.key});

    @override
    Widget build(BuildContext context, WidgetRef ref) {
      // Listen ke perubahan state dari ViewModel
      ref.listen<LoginState>(loginViewModelProvider, (previous, next) {
        next.maybeWhen(
          success: (member) {
            // Simpan data user ke provider lain jika perlu diakses global
            ref.read(userProvider.notifier).state = member;
            context.go('/dashboard');
          },
          error: (message) => ScaffoldMessenger.of(context).showSnackBar(...),
          orElse: () {},
        );
      });
      
      final state = ref.watch(loginViewModelProvider);
      final viewModel = ref.read(loginViewModelProvider.notifier);
      
      return Scaffold(
        body: Column(
          children: [
            // ... Form input
            ElevatedButton(
              onPressed: state.maybeWhen(
                loading: () => null, // Disable tombol saat loading
                orElse: () => viewModel.login(phone, password),
              ),
              child: state.maybeWhen(
                loading: () => const CircularProgressIndicator(),
                orElse: () => const Text('Login'),
              ),
            ),
          ],
        ),
      );
    }
  }
  ```

### d. Logika Berbasis Hak Akses (Permissions)
- Simpan data `Member` yang didapat setelah login ke dalam `Provider` global.
  ```dart
  // lib/core/providers/user_provider.dart
  final userProvider = StateProvider<Member?>((ref) => null);
  ```
- Di dalam UI, periksa hak akses sebelum menampilkan widget tertentu.
  ```dart
  // Contoh di halaman manajemen
  class MemberManagementScreen extends ConsumerWidget {
    @override
    Widget build(BuildContext context, WidgetRef ref) {
      final user = ref.watch(userProvider);
      final canCreate = user?.permissions.members.contains('create') ?? false;

      return Scaffold(
        floatingActionButton: canCreate
          ? FloatingActionButton(
              onPressed: () { /* Buka halaman tambah member */ },
              child: const Icon(Icons.add),
            )
          : null,
        body: // ... daftar member
      );
    }
  }
  ```

---

## 6. Rekomendasi Library

- `flutter_riverpod`: Manajemen state dan dependency injection.
- `go_router`: Navigasi yang kuat dan berbasis URL.
- `dio`: HTTP client yang powerful dengan interceptor.
- `flutter_secure_storage`: Penyimpanan token JWT yang aman.
- `freezed`: Untuk membuat state dan model yang immutable.
- `json_serializable`: Untuk serialisasi/deserialisasi JSON.
- `mobile_scanner`: Pemindai QR code.
- `qr_flutter`: Menampilkan QR code.
- `intl`: Format tanggal, angka, dan waktu.
- `get_it` & `injectable`: (Alternatif/tambahan untuk DI jika diperlukan).
