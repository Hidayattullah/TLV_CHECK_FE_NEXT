import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PersonalCheckInRecord } from "@/lib/api/types";

// Repositori ini digunakan untuk aplikasi production.
// Fungsi di dalamnya akan melakukan panggilan API sesungguhnya ke backend
// untuk mendapatkan riwayat check-in pribadi pengguna yang sedang login.

/**
 * Mengambil riwayat check-in pribadi untuk pengguna tertentu dari server.
 * @param {string} userId - ID pengguna yang riwayatnya akan diambil.
 * @returns {Promise<PersonalCheckInRecord[]>} Daftar riwayat check-in pribadi.
 */
export async function getPersonalCheckInHistory(userId: string): Promise<PersonalCheckInRecord[]> {
  console.log(`Fetching real personal check-in history for user ${userId}...`);
  return customFetch<PersonalCheckInRecord[]>(API_ENDPOINTS.GET_PERSONAL_CHECK_IN_HISTORY(userId));
}
