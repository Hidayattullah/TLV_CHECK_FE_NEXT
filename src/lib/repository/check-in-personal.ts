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
 * Mengambil riwayat check-in pribadi untuk pengguna yang sedang login dari server.
 * Fungsi ini akan memanggil endpoint API yang sesuai untuk mendapatkan data.
 *
 * @returns {Promise<{data: PersonalCheckInRecord[], pagination: any}>} Daftar riwayat check-in pribadi dan info paginasi.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function getPersonalCheckInHistory(page = 1, limit = 10, search = ''): Promise<{data: PersonalCheckInRecord[], pagination: any}> {
  console.log(`(API) Mengambil riwayat check-in pribadi...`);
  const url = new URL(API_ENDPOINTS.GET_PERSONAL_CHECK_IN_HISTORY);
  url.searchParams.append('page', String(page));
  url.searchParams.append('limit', String(limit));
  if (search) {
      url.searchParams.append('search', search);
  }
  return customFetch<{data: PersonalCheckInRecord[], pagination: any}>(url.toString());
}
