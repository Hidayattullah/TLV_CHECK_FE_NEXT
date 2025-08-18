# Panduan Pengembangan Backend (NestJS & Prisma)

Dokumen ini adalah panduan teknis untuk membangun backend yang *robust*, skalabel, dan mudah di-maintain menggunakan **NestJS**. Panduan ini dirancang untuk mengikuti prinsip-prinsip pengembangan modern seperti **SOLID** dan **DRY**.

**Stack Teknologi Inti:**
- **Framework:** NestJS (berbasis TypeScript & Node.js)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Autentikasi:** JSON Web Token (JWT)
- **Validasi:** `class-validator` & `class-transformer`

---

## 1. Prinsip & Arsitektur

### a. Arsitektur Modular
NestJS secara default mendorong arsitektur modular. Setiap fitur utama (misalnya, `members`, `check-in`) harus berada di dalam modulnya sendiri. Ini sejalan dengan **Single Responsibility Principle (SRP)**, di mana setiap modul bertanggung jawab atas satu set fungsionalitas yang kohesif.

### b. Prinsip SOLID
- **Single Responsibility (SRP):**
  - **Controller:** Hanya bertanggung jawab untuk menangani request HTTP, validasi DTO, dan memanggil service. Tidak boleh ada logika bisnis di sini.
  - **Service:** Berisi semua logika bisnis. Bertanggung jawab atas satu domain (misal: `MembersService` hanya mengurus logika jemaat).
  - **Repository:** (Opsional, tapi direkomendasikan) Bertanggung jawab hanya untuk interaksi database. Ini mengisolasi Prisma dari service.
- **Open/Closed (OCP):** Gunakan DTO (Data Transfer Objects) untuk request dan response. Jika fitur baru memerlukan data tambahan, Anda bisa memperluas DTO tanpa mengubah kode yang sudah ada.
- **Liskov Substitution (LSP):** Gunakan `interface` atau `abstract class` di TypeScript jika Anda membutuhkan implementasi yang dapat dipertukarkan (misal, untuk testing).
- **Interface Segregation (ISP):** Buat DTO yang spesifik untuk setiap use case (misal: `CreateMemberDto`, `UpdateMemberDto`). Jangan gunakan satu DTO besar untuk semua operasi.
- **Dependency Inversion (DIP):** NestJS menangani ini secara otomatis melalui **Dependency Injection (DI)**. Controller bergantung pada abstraksi Service, bukan implementasi konkretnya.

### c. Prinsip DRY (Don't Repeat Yourself)
- **Helper/Utility Functions:** Buat fungsi-fungsi umum (misal, untuk hashing password) di direktori `src/common/utils`.
- **Custom Decorators:** Buat dekorator kustom untuk tugas berulang, seperti mengambil data pengguna dari request (`@CurrentUser`).
- **Base Repository/Service:** Jika ada logika CRUD yang sangat umum, Anda bisa membuat `BaseService` generik.

---

## 2. Persiapan & Instalasi

1.  **Install NestJS CLI:**
    ```bash
    npm i -g @nestjs/cli
    ```

2.  **Buat Proyek Baru:**
    ```bash
    nest new tlv-backend
    ```

3.  **Install Dependencies Utama:**
    ```bash
    # Prisma
    npm install prisma @prisma/client
    npm install -D @types/node ts-node

    # Autentikasi & Keamanan
    npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
    npm install -D @types/passport-jwt @types/bcrypt

    # Validasi & Konfigurasi
    npm install class-validator class-transformer @nestjs/config
    ```

4.  **Inisialisasi Prisma:**
    ```bash
    npx prisma init
    ```
    - Konfigurasikan file `.env` dan `prisma/schema.prisma` untuk terhubung ke database PostgreSQL Anda.

---

## 3. Struktur Proyek yang Direkomendasikan

Struktur ini memisahkan setiap concern dengan jelas dan mudah untuk dinavigasi.

```
src/
├── app.module.ts             # Modul root aplikasi
├── main.ts                   # Entry point aplikasi
│
├── common/                   # Kode yang digunakan bersama di banyak modul
│   ├── decorators/           # Dekorator kustom (misal: CurrentUser)
│   ├── dto/                  # DTO umum (misal: PaginationDto)
│   ├── guards/               # Guard kustom (misal: RolesGuard)
│   └── utils/                # Fungsi utilitas (misal: hashPassword)
│
├── config/                   # Konfigurasi aplikasi (database, JWT)
│
├── prisma/                   # Dihasilkan oleh Prisma CLI
│   ├── migrations/
│   └── schema.prisma         # Skema database Anda
│
├── modules/                  # Direktori utama untuk semua fitur
│   ├── auth/                 # Modul Autentikasi
│   │   ├── dto/              # LoginDto, RegisterDto, etc.
│   │   ├── strategies/       # JwtStrategy
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   │
│   ├── members/              # Modul Jemaat
│   │   ├── dto/              # CreateMemberDto, UpdateMemberDto
│   │   ├── entities/         # Member.entity.ts (representasi objek)
│   │   ├── members.controller.ts
│   │   ├── members.module.ts
│   │   └── members.service.ts
│   │
│   ├── check-in/             # Modul Check-in
│   │   └── ... (struktur yang sama)
│   │
│   └── ... (modul lainnya: prayers, questions, tickets)
│
└── prisma.service.ts         # Service untuk koneksi Prisma
```

---

## 4. Panduan Implementasi

### a. Koneksi Database (PrismaService)
Buat `src/prisma.service.ts` yang meng-handle koneksi Prisma dan siklus hidup aplikasi.

```typescript
// src/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```
- Daftarkan `PrismaService` sebagai provider global di `app.module.ts`.

### b. Modul Autentikasi (`auth`)
- **Controller (`auth.controller.ts`):** Endpoint untuk `/auth/login`, `/auth/register`.
- **Service (`auth.service.ts`):**
  - `validateUser(phoneNumber, password)`: Memvalidasi kredensial pengguna.
  - `login(user)`: Membuat dan me-return JWT jika validasi berhasil.
  - `register(registerDto)`: Mendaftarkan pengguna baru.
- **Strategy (`jwt.strategy.ts`):**
  - Implementasikan `passport-jwt` strategy.
  - Bertugas memvalidasi token JWT dari header `Authorization` pada setiap request yang terproteksi.
  - Jika valid, ia akan melampirkan data pengguna ke objek `request`.

### c. Global JWT Guard
Aktifkan `JwtAuthGuard` secara global di `main.ts` agar semua endpoint terproteksi secara default. Gunakan decorator `@Public()` untuk endpoint yang tidak memerlukan otentikasi (seperti login, register).

```typescript
// main.ts
const app = await NestFactory.create(AppModule);
const reflector = app.get(Reflector);
app.useGlobalGuards(new JwtAuthGuard(reflector)); // Terapkan guard secara global
// ...
```

### d. Validasi DTO
Gunakan `class-validator` di dalam file DTO Anda. Aktifkan `ValidationPipe` secara global di `main.ts`.

```typescript
// src/modules/auth/dto/login.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// src/main.ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

### e. Penanganan Error (Error Handling)
- **Gunakan Exception Bawaan NestJS:** `NotFoundException`, `BadRequestException`, `UnauthorizedException`, dll. NestJS akan secara otomatis mengubahnya menjadi respons HTTP yang sesuai.
- **Buat Custom Exception Filter:** Jika Anda memerlukan format error yang seragam di seluruh aplikasi, buat `HttpExceptionFilter` untuk menangkap semua error dan memformatnya.

```typescript
// Contoh di dalam service
import { NotFoundException } from '@nestjs/common';

async findOne(id: string): Promise<Member> {
  const member = await this.prisma.member.findUnique({ where: { id } });
  if (!member) {
    throw new NotFoundException(`Member with ID "${id}" not found`);
  }
  return member;
}
```

### f. Contoh Alur Modul (`members`)
1.  **Request Masuk:** `PATCH /api/members/:id`
2.  **Guard:** `JwtAuthGuard` memverifikasi token.
3.  **Controller (`members.controller.ts`):**
    - Method `update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto, @CurrentUser() user: UserPayload)` dipanggil.
    - DTO divalidasi oleh `ValidationPipe`.
    - Controller memanggil `this.membersService.update(id, updateMemberDto, user)`.
4.  **Service (`members.service.ts`):**
    - Menerima data dan melakukan logika bisnis.
    - Cek hak akses: "Apakah `user` boleh mengedit profil dengan `id` ini?"
    - Memanggil `PrismaService` untuk memperbarui data di database.
    - Mengembalikan data yang sudah diperbarui.
5.  **Response:** Controller mengembalikan data dari service sebagai respons HTTP 200 OK.

---

Dengan mengikuti panduan ini, backend Anda akan terstruktur dengan baik, aman, dan siap untuk dikembangkan lebih lanjut seiring dengan pertumbuhan aplikasi.