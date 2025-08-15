import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Member, NewMember } from "@/lib/api/types";

/**
 * @fileoverview Repositori untuk manajemen data Jemaat (Members).
 *
 * Repositori ini digunakan untuk aplikasi dalam mode produksi.
 * Fungsi-fungsi di dalamnya akan melakukan panggilan API sesungguhnya ke backend.
 * Pastikan backend Anda memiliki endpoint yang sesuai untuk setiap fungsi.
 */

/**
 * Mengotentikasi pengguna dengan mengirimkan nomor telepon dan password ke server.
 * Panggil endpoint POST untuk login.
 *
 * @param {string} phoneNumber - Nomor telepon pengguna.
 * @param {string} password - Password pengguna.
 * @returns {Promise<{ token: string; member: Member }>} Objek yang berisi token JWT dan data member.
 * @throws {Error} Jika login gagal (misalnya, kredensial salah).
 */
export async function login(phoneNumber: string, password: string): Promise<{ token: string; member: Member }> {
  console.log("(API) Mencoba login...");
  return customFetch<{ token: string; member: Member }>(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, password }),
  });
}

/**
 * Mengambil semua data jemaat dari server.
 * Panggil endpoint GET untuk mendapatkan daftar semua jemaat.
 *
 * @returns {Promise<Member[]>} Daftar semua jemaat.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function getMembers(): Promise<Member[]> {
  console.log("(API) Mengambil semua data jemaat...");
  return customFetch<Member[]>(API_ENDPOINTS.GET_MEMBERS);
}

/**
 * Mengambil data satu jemaat berdasarkan ID-nya.
 * Panggil endpoint GET dengan parameter ID jemaat.
 *
 * @param {string} id - ID unik jemaat.
 * @returns {Promise<Member>} Data detail jemaat.
 * @throws {Error} Jika jemaat tidak ditemukan atau panggilan API gagal.
 */
export async function getMemberById(id: string): Promise<Member> {
  console.log(`(API) Mengambil data jemaat dengan ID: ${id}...`);
  return customFetch<Member>(API_ENDPOINTS.GET_MEMBER_BY_ID(id));
}

/**
 * Mengambil data satu jemaat berdasarkan nomor teleponnya.
 * Panggil endpoint GET dengan parameter nomor telepon.
 *
 * @param {string} phoneNumber - Nomor telepon jemaat.
 * @returns {Promise<Member | null>} Data detail jemaat atau null jika tidak ditemukan.
 */
export async function getMemberByPhoneNumber(phoneNumber: string): Promise<Member | null> {
  console.log(`(API) Mengambil data jemaat dengan nomor telepon: ${phoneNumber}...`);
  try {
    return await customFetch<Member>(API_ENDPOINTS.GET_MEMBER_BY_PHONE(phoneNumber));
  } catch (error) {
    console.error(`(API) Jemaat dengan nomor ${phoneNumber} tidak ditemukan:`, error);
    return null;
  }
}

/**
 * Menambahkan jemaat baru ke server.
 * Panggil endpoint POST dengan data jemaat baru.
 *
 * @param {NewMember} newMemberData - Data jemaat baru yang akan didaftarkan.
 * @returns {Promise<Member>} Data jemaat yang baru dibuat.
 * @throws {Error} Jika pendaftaran gagal (misalnya, nomor telepon sudah ada).
 */
export async function addMember(newMemberData: NewMember): Promise<Member> {
  console.log("(API) Menambahkan jemaat baru...");
  return customFetch<Member>(API_ENDPOINTS.ADD_MEMBER, {
    method: 'POST',
    body: JSON.stringify(newMemberData),
  });
}

/**
 * Memperbarui data jemaat yang sudah ada di server.
 * Panggil endpoint PATCH atau PUT dengan ID jemaat dan data yang akan diubah.
 *
 * @param {string} id - ID jemaat yang akan diperbarui.
 * @param {Partial<Member>} updatedData - Data yang akan diubah.
 * @returns {Promise<Member>} Data jemaat yang telah diperbarui.
 * @throws {Error} Jika pembaruan gagal.
 */
export async function updateMember(id: string, updatedData: Partial<Member>): Promise<Member> {
  console.log(`(API) Memperbarui jemaat ${id}...`);
  return customFetch<Member>(API_ENDPOINTS.UPDATE_MEMBER(id), {
    method: 'PATCH',
    body: JSON.stringify(updatedData),
  });
}

/**
 * Menghapus data jemaat dari server.
 * Panggil endpoint DELETE dengan ID jemaat.
 *
 * @param {string} id - ID jemaat yang akan dihapus.
 * @returns {Promise<void>}
 * @throws {Error} Jika penghapusan gagal.
 */
export async function deleteMember(id: string): Promise<void> {
  console.log(`(API) Menghapus jemaat ${id}...`);
  await customFetch<void>(API_ENDPOINTS.DELETE_MEMBER(id), {
    method: 'DELETE',
  });
}
