
import type { SupportTicket } from "@/lib/api/types";

export const mockTickets: SupportTicket[] = [
  {
    id: "TICKET-12345",
    userName: "Jane Doe",
    phoneNumber: "+6281234567891",
    description: "Akun saya tidak aktif, padahal saya sudah lama menjadi anggota. Mohon bantuannya untuk diaktifkan kembali.",
    submittedDate: "2024-08-01T10:00:00Z",
    isResolved: true,
    response: "Halo Jane, akun Anda sudah kami aktifkan kembali. Silakan coba login kembali. Terima kasih.",
    resolvedBy: "Admin Gereja",
    resolvedDate: "2024-08-01T11:30:00Z",
  },
];
