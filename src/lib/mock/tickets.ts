
import type { SupportTicket } from "@/lib/api/types";

export const mockTickets: SupportTicket[] = [
  {
    id: "TICKET-12345",
    userName: "Jane Doe",
    phoneNumber: "+6281234567891",
    description: "Akun saya tidak aktif, padahal saya sudah lama menjadi anggota. Mohon bantuannya untuk diaktifkan kembali.",
    submittedDate: "2024-08-01T10:00:00Z",
    status: "Selesai",
    response: "Halo Jane, akun Anda sudah kami aktifkan kembali. Silakan coba login kembali. Terima kasih.",
    resolvedBy: "Admin Gereja",
    resolvedDate: "2024-08-01T11:30:00Z",
  },
  {
    id: "TICKET-67890",
    userName: "Budi Santoso",
    phoneNumber: "+6287712345678",
    description: "Saya tidak bisa mereset password. Selalu muncul pesan error. Mohon bantuannya.",
    submittedDate: "2024-08-02T14:20:00Z",
    status: "Proses",
  },
  {
    id: "TICKET-11223",
    userName: "Siti Aminah",
    phoneNumber: "+6281122334455",
    description: "Data profil saya, terutama alamat, salah dan saya tidak bisa mengubahnya. Alamat yang benar adalah Jl. Merdeka No. 100.",
    submittedDate: "2024-08-03T09:00:00Z",
    status: "Proses",
  },
  {
    id: "TICKET-44556",
    userName: "John Wick",
    phoneNumber: "+6285566778899",
    description: "Saya adalah pengguna baru dan ingin tahu bagaimana cara mendaftar untuk pelayanan musik.",
    submittedDate: "2024-08-03T11:00:00Z",
    status: "Ditolak",
    response: "Halo John, pertanyaan ini lebih cocok diajukan melalui fitur 'Pertanyaan Jemaat' di aplikasi. Halaman tiket dukungan ditujukan untuk masalah teknis akun. Terima kasih.",
    resolvedBy: "Admin Gereja",
    resolvedDate: "2024-08-03T11:30:00Z",
  }
];
