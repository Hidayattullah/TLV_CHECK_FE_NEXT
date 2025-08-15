import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PrayerRequest } from "@/lib/api/types";

/**
 * @fileoverview Repositori untuk manajemen data Pokok Doa.
 *
 * Repositori ini digunakan untuk aplikasi dalam mode produksi.
 * Fungsi-fungsi di dalamnya akan melakukan panggilan API sesungguhnya ke backend.
 * Pastikan backend Anda memiliki endpoint yang sesuai untuk setiap fungsi.
 */

/**
 * Mengambil semua data pokok doa dari server.
 * Panggil endpoint GET untuk mendapatkan daftar semua pokok doa.
 *
 * @returns {Promise<PrayerRequest[]>} Daftar semua pokok doa.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function getPrayerRequests(): Promise<PrayerRequest[]> {
  console.log("(API) Mengambil semua data pokok doa...");
  return customFetch<PrayerRequest[]>(API_ENDPOINTS.GET_PRAYER_REQUESTS);
}

/**
 * Menambahkan pokok doa baru ke server.
 * Panggil endpoint POST dengan data pokok doa baru.
 *
 * @param {object} data - Data pokok doa baru.
 * @param {string} data.userName - Nama pengguna (bisa "Anonim").
 * @param {string} data.requestText - Isi pokok doa.
 * @param {boolean} data.isAnonymous - Status anonim.
 * @param {string} data.submittedBy - ID pengguna yang mengirim (untuk internal).
 * @param {string} [data.avatarUrl] - URL avatar pengguna (opsional).
 * @returns {Promise<PrayerRequest>} Pokok doa baru yang telah dibuat.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function addPrayerRequest(data: { userName: string; requestText: string; isAnonymous: boolean, submittedBy: string, avatarUrl?: string }): Promise<PrayerRequest> {
    console.log("(API) Menambahkan pokok doa baru...");
    return customFetch<PrayerRequest>(API_ENDPOINTS.ADD_PRAYER_REQUEST, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Mengirimkan tanggapan doa ke server untuk pokok doa tertentu.
 * Panggil endpoint POST dengan ID pokok doa dan data tanggapan.
 *
 * @param {string} prayerId - ID pokok doa yang akan ditanggapi.
 * @param {string} responseText - Isi tanggapan atau doa.
 * @param {string} responderName - Nama admin atau pendoa yang menanggapi.
 * @returns {Promise<PrayerRequest>} Pokok doa yang telah diperbarui dengan tanggapan.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function respondToPrayerRequest(
  prayerId: string,
  responseText: string,
  responderName: string
): Promise<PrayerRequest> {
  console.log(`(API) Menanggapi pokok doa ${prayerId}...`);
  return customFetch<PrayerRequest>(API_ENDPOINTS.RESPOND_TO_PRAYER_REQUEST(prayerId), {
    method: 'POST',
    body: JSON.stringify({ responseText, responderName }),
  });
}

/**
 * Mengarsipkan pokok doa di server.
 * Panggil endpoint POST atau PATCH untuk mengubah status arsip.
 *
 * @param {string} prayerId - ID pokok doa yang akan diarsipkan.
 * @returns {Promise<PrayerRequest>} Pokok doa yang telah diarsipkan.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function archivePrayer(prayerId: string): Promise<PrayerRequest> {
    console.log(`(API) Mengarsipkan pokok doa ${prayerId}...`);
    return customFetch<PrayerRequest>(API_ENDPOINTS.ARCHIVE_PRAYER(prayerId), {
        method: 'POST', // atau 'PATCH' sesuai desain API Anda
    });
}

/**
 * Menghapus satu atau lebih pokok doa dari server.
 * Panggil endpoint DELETE dengan daftar ID yang akan dihapus.
 *
 * @param {string[]} ids - Array berisi ID pokok doa yang akan dihapus.
 * @returns {Promise<void>}
 * @throws {Error} Jika panggilan API gagal.
 */
export async function deletePrayers(ids: string[]): Promise<void> {
    console.log(`(API) Menghapus pokok doa: ${ids.join(', ')}...`);
    await customFetch<void>(API_ENDPOINTS.DELETE_PRAYERS, {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
    });
}
