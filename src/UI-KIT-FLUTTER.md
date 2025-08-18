# Panduan UI Kit & Design System untuk Flutter

Dokumen ini adalah panduan referensi untuk membangun UI Kit di Flutter berdasarkan desain yang sudah ada di aplikasi web. Tujuannya adalah untuk memastikan konsistensi visual dan mempercepat pengembangan.

---

## 1. Skema Warna (Color Palette)

Warna-warna ini harus didefinisikan sebagai konstanta di dalam kelas `AppColors` di Flutter untuk penggunaan yang konsisten di seluruh aplikasi.

| Nama Variabel         | Kode Hex    | Kode HSL                     | Penggunaan Utama                               |
| --------------------- | ----------- | ---------------------------- | ---------------------------------------------- |
| `primary`             | `#8B2671`   | `hsl(324, 69%, 34%)`         | Tombol utama, header, ikon aktif, aksen kuat   |
| `primaryForeground`   | `#FFFFFF`   | `hsl(0, 0%, 100%)`           | Teks & ikon di atas warna `primary`            |
| `background`          | `#FAF9F6`   | `hsl(42, 33%, 96%)`          | Latar belakang utama semua layar (scaffold)    |
| `foreground`          | `#2E2E2E`   | `hsl(0, 0%, 18%)`            | Warna teks utama                               |
| `card`                | `#FFFFFF`   | `hsl(0, 0%, 100%)`           | Latar belakang untuk semua komponen Card       |
| `secondary`           | `#EBEAE1`   | `hsl(42, 33%, 92%)`          | Latar belakang Input Fields, area non-fokus    |
| `mutedForeground`     | `#666666`   | `hsl(0, 0%, 40%)`            | Teks hint, deskripsi, teks non-fokus           |
| `accent`              | `#931c58`   | `hsl(324, 69%, 34%)`         | Aksen hover atau elemen UI sekunder (jika perlu) |
| `border`              | `#DAD8CE`   | `hsl(42, 30%, 85%)`          | Warna border untuk `Card`, `Separator`, dll.   |
| `destructive`         | `#F44336`   | `hsl(0, 84.2%, 60.2%)`       | Tombol hapus, teks error, ikon peringatan      |

---

## 2. Tipografi (Typography)

- **Font Family Utama:** `Roboto`
- Implementasikan sebagai `TextTheme` di dalam `ThemeData` Flutter.

### Skala Tipografi
| Nama Style        | `fontWeight`    | `fontSize` | Penggunaan                                             |
| ----------------- | --------------- | ---------- | ------------------------------------------------------ |
| `headlineLarge`   | `FontWeight.bold` | `36.0`     | Judul utama halaman (misal: "Dasbor Manajemen")        |
| `headlineMedium`  | `FontWeight.bold` | `28.0`     | Judul Card, Judul Dialog                               |
| `headlineSmall`   | `FontWeight.bold` | `24.0`     | Judul di header AppBar                                 |
| `titleLarge`      | `FontWeight.semibold` | `20.0`     | Judul item dalam daftar, sub-judul penting             |
| `titleMedium`     | `FontWeight.semibold` | `16.0`     | Teks pada tombol, label form yang lebih tebal          |
| `bodyLarge`       | `FontWeight.normal` | `16.0`     | Teks isi utama, deskripsi panjang                      |
| `bodyMedium`      | `FontWeight.normal` | `14.0`     | Teks sekunder, item di dalam tabel, deskripsi singkat  |
| `bodySmall`       | `FontWeight.normal` | `12.0`     | Teks hint, keterangan waktu, teks di bawah ikon        |

---

## 3. Spacing & Radius

- **Standard Padding:** `16.0` (digunakan untuk padding konten halaman dan `Card`).
- **Standard Margin/Gutter:** `16.0` (jarak antar elemen utama).
- **Small Padding/Margin:** `8.0` (jarak antar elemen yang lebih kecil, seperti ikon dan teks).
- **Corner Radius:** `12.0` (digunakan untuk `Card`, `Button`, `Input Field`). Gunakan `BorderRadius.circular(12.0)`.

---

## 4. Spesifikasi Komponen (Component Kit)

Berikut adalah panduan untuk membuat widget kustom yang dapat digunakan kembali.

### a. Tombol (`ElevatedButton`)
- **Varian `Primary`:**
  - `backgroundColor`: `AppColors.primary`
  - `foregroundColor`: `AppColors.primaryForeground`
  - `shape`: `RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0))`
  - `minimumSize`: `Size(double.infinity, 52)` (untuk tombol lebar penuh)
  - `textStyle`: `titleMedium`

- **Varian `Outline`:**
  - `side`: `BorderSide(color: AppColors.primary)`
  - `foregroundColor`: `AppColors.primary`
  - `backgroundColor`: `Colors.transparent`
  - `shape`: `RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0))`

- **Varian `Ghost` (Gunakan `TextButton`):**
  - `foregroundColor`: `AppColors.mutedForeground`
  - `overlayColor`: `AppColors.primary.withOpacity(0.1)`

### b. Kartu (`Card`)
- `backgroundColor`: `AppColors.card`
- `shape`: `RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0))`
- `elevation`: `2.0` (untuk memberikan sedikit bayangan)
- `margin`: `EdgeInsets.zero` (biarkan `margin` diatur oleh layout parent)
- `clipBehavior`: `Clip.antiAlias` (untuk memastikan konten di dalamnya mengikuti `borderRadius`)

### c. Input Field (`TextFormField`)
- **`InputDecoration` Style:**
  - `filled`: `true`
  - `fillColor`: `AppColors.secondary`
  - `border`: `OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: BorderSide.none)`
  - `hintStyle`: `bodyMedium` dengan warna `AppColors.mutedForeground`
  - `contentPadding`: `EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0)`

### d. Avatar
- **`CircleAvatar` Widget:**
  - `radius`: Bervariasi (misal: `24.0` untuk kecil, `48.0` untuk besar)
- **Fallback (Jika tidak ada gambar):**
  - `backgroundColor`: `AppColors.primary.withOpacity(0.2)`
  - `child`: `Text` dengan inisial nama, `fontWeight.bold`, dan warna `AppColors.primary`

### e. Badge
- **Varian `Default` (Aktif):**
  - `backgroundColor`: `AppColors.primary`
  - `textColor`: `AppColors.primaryForeground`
- **Varian `Secondary` (Selesai/Netral):**
  - `backgroundColor`: `AppColors.secondary`
  - `textColor`: `AppColors.mutedForeground`
- **Varian `Destructive` (Nonaktif):**
  - `backgroundColor`: `AppColors.destructive.withOpacity(0.1)`
  - `textColor`: `AppColors.destructive`
- **Properties:**
  - `borderRadius`: `BorderRadius.circular(20.0)`
  - `padding`: `EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.0)`
  - `textStyle`: `bodySmall` dengan `fontWeight.semibold`

### f. Dialog & Alert Dialog
- `shape`: `RoundedRectangleBorder(borderRadius: BorderRadius.circular(16.0))`
- `backgroundColor`: `AppColors.background`
- `titleTextStyle`: `headlineMedium`
- `contentTextStyle`: `bodyLarge` dengan warna `AppColors.mutedForeground`
