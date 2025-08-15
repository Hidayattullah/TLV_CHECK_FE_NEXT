import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CheckInEvent, Attendee } from "@/lib/api/types";

// Repositori ini digunakan untuk aplikasi production.
// Fungsi-fungsi di dalamnya akan melakukan panggilan API sesungguhnya ke backend.

/**
 * Mengambil semua data acara check-in dari server.
 * @returns {Promise<CheckInEvent[]>} Daftar semua acara check-in.
 */
export async function getCheckInEvents(): Promise<CheckInEvent[]> {
  console.log("Fetching real check-in events data...");
  return customFetch<CheckInEvent[]>(API_ENDPOINTS.GET_CHECK_IN_EVENTS);
}

/**
 * Mengambil detail satu acara check-in berdasarkan ID-nya.
 * @param {string} id - ID unik dari acara yang akan diambil.
 * @returns {Promise<CheckInEvent>} Detail acara check-in.
 */
export async function getCheckInEventById(id: string): Promise<CheckInEvent | null> {
  console.log(`Fetching real check-in event data for id: ${id}...`);
  try {
    return await customFetch<CheckInEvent>(API_ENDPOINTS.GET_CHECK_IN_EVENT_BY_ID(id));
  } catch (error) {
    // API akan mengembalikan 404 jika tidak ditemukan, customFetch akan melempar error.
    // Kita tangkap error tersebut dan kembalikan null agar aplikasi bisa menanganinya.
    console.error(`Event with id ${id} not found:`, error);
    return null;
  }
}

/**
 * Menambahkan jemaat ke dalam daftar kehadiran sebuah acara.
 * @param {string} eventId - ID acara check-in.
 * @param {Attendee} attendee - Objek data jemaat yang akan ditambahkan.
 * @returns {Promise<CheckInEvent>} Data acara yang telah diperbarui.
 */
export async function addAttendee(eventId: string, attendee: Attendee): Promise<CheckInEvent> {
  console.log(`Adding attendee to event ${eventId} via API...`);
  return customFetch<CheckInEvent>(API_ENDPOINTS.ADD_ATTENDEE_TO_EVENT(eventId), {
    method: 'POST',
    body: JSON.stringify(attendee),
  });
}

/**
 * Menambahkan acara check-in baru ke server.
 * @param {Pick<CheckInEvent, "eventName" | "eventDate">} data - Data acara baru.
 * @returns {Promise<CheckInEvent>} Acara baru yang telah dibuat.
 */
export async function addCheckInEvent(data: Pick<CheckInEvent, "eventName" | "eventDate">): Promise<CheckInEvent> {
  console.log("Adding new check-in event via API...");
  return customFetch<CheckInEvent>(API_ENDPOINTS.ADD_CHECK_IN_EVENT, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Memperbarui detail acara check-in yang sudah ada.
 * @param {string} id - ID acara yang akan diperbarui.
 * @param {Pick<CheckInEvent, "eventName" | "eventDate">} data - Data baru untuk acara.
 * @returns {Promise<CheckInEvent>} Acara yang telah diperbarui.
 */
export async function updateCheckInEvent(id: string, data: Pick<CheckInEvent, "eventName" | "eventDate">): Promise<CheckInEvent> {
  console.log(`Updating check-in event ${id} via API...`);
  return customFetch<CheckInEvent>(API_ENDPOINTS.UPDATE_CHECK_IN_EVENT(id), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Menghapus acara check-in dari server.
 * @param {string} id - ID acara yang akan dihapus.
 * @returns {Promise<void>}
 */
export async function deleteCheckInEvent(id: string): Promise<void> {
  console.log(`Deleting check-in event ${id} via API...`);
  await customFetch<void>(API_ENDPOINTS.DELETE_CHECK_IN_EVENT(id), {
    method: 'DELETE',
  });
}

/**
 * Mengubah status keaktifan sebuah acara (aktif/selesai).
 * @param {string} id - ID acara yang statusnya akan diubah.
 * @param {boolean} isActive - Status baru (true untuk aktif, false untuk selesai).
 * @returns {Promise<CheckInEvent>} Acara yang telah diperbarui statusnya.
 */
export async function updateCheckInEventStatus(id: string, isActive: boolean): Promise<CheckInEvent> {
  console.log(`Updating check-in event status ${id} via API...`);
  return customFetch<CheckInEvent>(API_ENDPOINTS.UPDATE_CHECK_IN_EVENT_STATUS(id), {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

/**
 * Mengatur timer untuk menonaktifkan acara secara otomatis.
 * @param {string} id - ID acara yang akan diatur timernya.
 * @param {number} hours - Durasi timer dalam jam.
 * @returns {Promise<CheckInEvent>} Acara yang telah diatur timernya.
 */
export async function setCheckInEventTimer(id: string, hours: number): Promise<CheckInEvent> {
    console.log(`Setting timer for check-in event ${id} via API...`);
    return customFetch<CheckInEvent>(API_ENDPOINTS.SET_CHECK_IN_EVENT_TIMER(id), {
        method: 'POST',
        body: JSON.stringify({ hours }),
    });
}
