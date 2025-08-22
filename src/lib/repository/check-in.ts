import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CheckInEvent, Attendee } from "@/lib/api/types";

/**
 * @fileoverview Repositori untuk manajemen data Acara Check-in.
 *
 * Repositori ini digunakan untuk aplikasi dalam mode produksi.
 * Fungsi-fungsi di dalamnya akan melakukan panggilan API sesungguhnya ke backend.
 * Pastikan backend Anda memiliki endpoint yang sesuai untuk setiap fungsi.
 */

/**
 * Mengambil semua data acara check-in dari server dengan paginasi.
 * Panggil endpoint GET untuk mendapatkan daftar semua acara.
 *
 * @returns {Promise<{data: CheckInEvent[], meta: any}>} Daftar semua acara check-in.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function getCheckInEvents(page = 1, limit = 10, search = ''): Promise<{data: CheckInEvent[], meta: any}> {
  console.log("(API) Mengambil semua data acara check-in...");
  const url = new URL(API_ENDPOINTS.CHECK_IN_EVENTS);
  url.searchParams.append('page', String(page));
  url.searchParams.append('limit', String(limit));
  if (search) {
      url.searchParams.append('search', search);
  }
  return customFetch<{data: CheckInEvent[], meta: any}>(url.toString());
}

/**
 * Mengambil detail satu acara check-in berdasarkan ID-nya.
 * Panggil endpoint GET dengan parameter ID acara.
 *
 * @param {string} id - ID unik dari acara yang akan diambil.
 * @returns {Promise<CheckInEvent | null>} Detail acara check-in, atau null jika tidak ditemukan.
 */
export async function getCheckInEventById(id: string): Promise<CheckInEvent | null> {
  console.log(`(API) Mengambil data acara dengan ID: ${id}...`);
  try {
    return await customFetch<CheckInEvent>(API_ENDPOINTS.GET_CHECK_IN_EVENT_BY_ID(id));
  } catch (error) {
    console.error(`(API) Acara dengan ID ${id} tidak ditemukan:`, error);
    return null;
  }
}

/**
 * Menambahkan jemaat ke dalam daftar kehadiran sebuah acara.
 * Panggil endpoint POST dengan ID acara dan data jemaat.
 *
 * @param {string} eventId - ID acara check-in.
 * @param {Omit<Attendee, 'checkinTime' | 'checkinMethod' | 'name' | 'id'> & { memberId: string, checkinMethod: string }} attendeeData - Data jemaat.
 * @returns {Promise<CheckInEvent>} Data acara yang telah diperbarui.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function addAttendee(eventId: string, attendeeData: { memberId: string; checkinMethod: string }): Promise<any> {
  console.log(`(API) Menambahkan jemaat ke acara ${eventId}...`);
  return customFetch<any>(API_ENDPOINTS.ADD_ATTENDEE_TO_EVENT(eventId), {
    method: 'POST',
    body: JSON.stringify(attendeeData),
  });
}

/**
 * Menambahkan acara check-in baru ke server.
 * Panggil endpoint POST dengan data acara baru.
 *
 * @param {Pick<CheckInEvent, "eventName" | "eventDate">} data - Data acara baru.
 * @returns {Promise<CheckInEvent>} Acara baru yang telah dibuat.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function addCheckInEvent(data: Pick<CheckInEvent, "eventName" | "eventDate">): Promise<CheckInEvent> {
  console.log("(API) Menambahkan acara check-in baru...");
  return customFetch<CheckInEvent>(API_ENDPOINTS.CHECK_IN_EVENTS, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Memperbarui detail acara check-in yang sudah ada.
 * Panggil endpoint PATCH atau PUT dengan ID acara dan data baru.
 *
 * @param {string} id - ID acara yang akan diperbarui.
 * @param {Pick<CheckInEvent, "eventName" | "eventDate">} data - Data baru untuk acara.
 * @returns {Promise<CheckInEvent>} Acara yang telah diperbarui.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function updateCheckInEvent(id: string, data: Pick<CheckInEvent, "eventName" | "eventDate">): Promise<CheckInEvent> {
  console.log(`(API) Memperbarui acara ${id}...`);
  return customFetch<CheckInEvent>(`${API_ENDPOINTS.CHECK_IN_EVENTS}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Menghapus acara check-in dari server.
 * Panggil endpoint DELETE dengan ID acara.
 *
 * @param {string} id - ID acara yang akan dihapus.
 * @returns {Promise<void>}
 * @throws {Error} Jika panggilan API gagal.
 */
export async function deleteCheckInEvent(id: string): Promise<void> {
  console.log(`(API) Menghapus acara ${id}...`);
  await customFetch<void>(`${API_ENDPOINTS.CHECK_IN_EVENTS}/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Mengubah status keaktifan sebuah acara (aktif/selesai).
 * Panggil endpoint PATCH dengan ID acara dan status baru.
 *
 * @param {string} id - ID acara yang statusnya akan diubah.
 * @param {boolean} isActive - Status baru (true untuk aktif, false untuk selesai).
 * @returns {Promise<CheckInEvent>} Acara yang telah diperbarui statusnya.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function updateCheckInEventStatus(id: string, isActive: boolean): Promise<CheckInEvent> {
  console.log(`(API) Memperbarui status acara ${id}...`);
  return customFetch<CheckInEvent>(`${API_ENDPOINTS.CHECK_IN_EVENTS}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

/**
 * Mengatur timer untuk menonaktifkan acara secara otomatis.
 * Panggil endpoint POST dengan ID acara dan durasi timer.
 *
 * @param {string} id - ID acara yang akan diatur timernya.
 * @param {number} hours - Durasi timer dalam jam.
 * @returns {Promise<CheckInEvent>} Acara yang telah diatur timernya.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function setCheckInEventTimer(id: string, hours: number): Promise<CheckInEvent> {
    console.log(`(API) Mengatur timer untuk acara ${id}...`);
    // Backend akan menangani logika timer. Frontend hanya mengirim permintaan.
    return customFetch<CheckInEvent>(`${API_ENDPOINTS.CHECK_IN_EVENTS}/${id}/timer`, {
        method: 'POST',
        body: JSON.stringify({ hours }),
    });
}

/**
 * Melakukan check-in mandiri melalui pemindaian QR.
 *
 * @param {string} eventId - ID acara yang di-scan.
 * @param {string} checkinMethod - Metode check-in.
 * @returns {Promise<any>} Hasil dari proses check-in.
 */
export async function selfCheckIn(eventId: string, checkinMethod: string): Promise<any> {
    console.log(`(API) Melakukan self check-in untuk event ${eventId}...`);
    return customFetch<any>(API_ENDPOINTS.SELF_CHECK_IN_SCAN, {
        method: 'POST',
        body: JSON.stringify({ eventId, checkinMethod }),
    });
}
