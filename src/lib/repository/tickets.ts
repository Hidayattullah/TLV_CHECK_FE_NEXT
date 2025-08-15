import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { SupportTicket, TicketStatus } from "@/lib/api/types";

/**
 * @fileoverview Repositori untuk manajemen Tiket Dukungan (Support Tickets).
 *
 * Repositori ini digunakan untuk aplikasi dalam mode produksi.
 * Fungsi-fungsi di dalamnya akan melakukan panggilan API sesungguhnya ke backend.
 * Pastikan backend Anda memiliki endpoint yang sesuai untuk setiap fungsi.
 */

/**
 * Membuat tiket dukungan baru di server.
 * Panggil endpoint POST dengan data tiket baru.
 *
 * @param {object} data - Data tiket baru.
 * @param {string} data.userName - Nama pengguna.
 * @param {string} data.phoneNumber - Nomor telepon pengguna.
 * @param {string} data.description - Deskripsi masalah.
 * @returns {Promise<SupportTicket>} Tiket baru yang telah dibuat.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function createSupportTicket(data: { userName: string; phoneNumber: string; description: string }): Promise<SupportTicket> {
  console.log("(API) Membuat tiket dukungan baru...");
  return customFetch<SupportTicket>(API_ENDPOINTS.CREATE_SUPPORT_TICKET, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Mengambil semua data tiket dukungan dari server.
 * Panggil endpoint GET untuk mendapatkan daftar semua tiket.
 *
 * @returns {Promise<SupportTicket[]>} Daftar semua tiket dukungan.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function getAllSupportTickets(): Promise<SupportTicket[]> {
  console.log("(API) Mengambil semua tiket dukungan...");
  return customFetch<SupportTicket[]>(API_ENDPOINTS.GET_ALL_SUPPORT_TICKETS);
}

/**
 * Mengambil detail satu tiket dukungan berdasarkan ID-nya.
 * Panggil endpoint GET dengan parameter ID tiket.
 *
 * @param {string} ticketId - ID unik dari tiket yang akan diambil.
 * @returns {Promise<SupportTicket | null>} Detail tiket, atau null jika tidak ditemukan.
 */
export async function getSupportTicketById(ticketId: string): Promise<SupportTicket | null> {
  console.log(`(API) Mengambil tiket ${ticketId}...`);
  try {
    return await customFetch<SupportTicket>(API_ENDPOINTS.GET_SUPPORT_TICKET_BY_ID(ticketId));
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
      return null;
    }
    throw error;
  }
}

/**
 * Memperbarui status dan tanggapan dari sebuah tiket dukungan.
 * Panggil endpoint PATCH atau PUT dengan ID tiket dan data pembaruan.
 *
 * @param {string} ticketId - ID tiket yang akan diperbarui.
 * @param {object} updateData - Data yang akan diubah.
 * @param {TicketStatus} updateData.status - Status baru tiket.
 * @param {string} [updateData.response] - Tanggapan dari admin (opsional).
 * @param {string} [updateData.resolvedBy] - Nama admin yang menyelesaikan (opsional).
 * @returns {Promise<SupportTicket>} Tiket yang telah diperbarui.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function updateSupportTicket(
  ticketId: string,
  updateData: { status: TicketStatus; response?: string; resolvedBy?: string }
): Promise<SupportTicket> {
  console.log(`(API) Memperbarui tiket ${ticketId}...`);
  return customFetch<SupportTicket>(API_ENDPOINTS.UPDATE_SUPPORT_TICKET(ticketId), {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
}
