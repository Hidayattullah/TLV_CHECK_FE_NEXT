import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PersonalCheckInRecord } from "@/lib/api/types";

/**
 * @fileoverview Repositori untuk data riwayat check-in pribadi.
 *
 * Repositori ini digunakan untuk aplikasi dalam mode produksi.
 * Fungsi di dalamnya akan melakukan panggilan API sesungguhnya ke backend
 * untuk mendapatkan riwayat check-in pribadi pengguna yang sedang login.
 */

/**
 * Mengambil riwayat check-in pribadi untuk pengguna tertentu dari server.
 * Fungsi ini akan memanggil endpoint API yang sesuai untuk mendapatkan data.
 *
 * @param {string} userId - ID pengguna yang riwayatnya akan diambil.
 * @returns {Promise<PersonalCheckInRecord[]>} Daftar riwayat check-in pribadi.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function getPersonalCheckInHistory(userId: string): Promise<PersonalCheckInRecord[]> {
  console.log(`(API) Mengambil riwayat check-in untuk pengguna: ${userId}...`);
  // Ganti baris di bawah ini dengan logika panggilan API Anda yang sesungguhnya.
  return customFetch<PersonalCheckInRecord[]>(API_ENDPOINTS.GET_PERSONAL_CHECK_IN_HISTORY(userId));
}
