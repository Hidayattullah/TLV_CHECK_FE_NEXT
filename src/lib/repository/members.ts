import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Member, NewMember } from "@/lib/api/types";

// Repositori ini digunakan untuk aplikasi production.
// Fungsi-fungsi di dalamnya akan melakukan panggilan API sesungguhnya ke backend.

/**
 * Fungsi untuk proses login pengguna.
 * @param {string} phoneNumber - Nomor telepon pengguna.
 * @param {string} password - Password pengguna.
 * @returns {Promise<{ token: string; member: Member }>} Token JWT dan data member jika berhasil.
 */
export async function login(phoneNumber: string, password: string): Promise<{ token: string; member: Member }> {
  console.log("Attempting real login via API...");
  return customFetch<{ token: string; member: Member }>(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, password }),
  });
}

/**
 * Mengambil semua data jemaat dari server.
 * @returns {Promise<Member[]>} Daftar semua jemaat.
 */
export async function getMembers(): Promise<Member[]> {
  console.log("Fetching real members data...");
  return customFetch<Member[]>(API_ENDPOINTS.GET_MEMBERS);
}

/**
 * Mengambil data satu jemaat berdasarkan ID-nya.
 * @param {string} id - ID unik jemaat.
 * @returns {Promise<Member>} Data detail jemaat.
 */
export async function getMemberById(id: string): Promise<Member> {
  console.log(`Fetching real member data for id: ${id}...`);
  return customFetch<Member>(API_ENDPOINTS.GET_MEMBER_BY_ID(id));
}

/**
 * Mengambil data satu jemaat berdasarkan nomor teleponnya.
 * @param {string} phoneNumber - Nomor telepon jemaat.
 * @returns {Promise<Member | null>} Data detail jemaat atau null jika tidak ditemukan.
 */
export async function getMemberByPhoneNumber(phoneNumber: string): Promise<Member | null> {
  console.log(`Fetching real member data for phone: ${phoneNumber}...`);
  try {
    return await customFetch<Member>(API_ENDPOINTS.GET_MEMBER_BY_PHONE(phoneNumber));
  } catch (error) {
    console.error(`Member with phone ${phoneNumber} not found:`, error);
    return null;
  }
}

/**
 * Menambahkan jemaat baru ke server.
 * @param {NewMember} newMemberData - Data jemaat baru yang akan didaftarkan.
 * @returns {Promise<Member>} Data jemaat yang baru dibuat.
 */
export async function addMember(newMemberData: NewMember): Promise<Member> {
  console.log("Adding new member via API...");
  return customFetch<Member>(API_ENDPOINTS.ADD_MEMBER, {
    method: 'POST',
    body: JSON.stringify(newMemberData),
  });
}

/**
 * Memperbarui data jemaat yang sudah ada di server.
 * @param {string} id - ID jemaat yang akan diperbarui.
 * @param {Partial<Member>} updatedData - Data yang akan diubah.
 * @returns {Promise<Member>} Data jemaat yang telah diperbarui.
 */
export async function updateMember(id: string, updatedData: Partial<Member>): Promise<Member> {
  console.log(`Updating member ${id} via API...`);
  return customFetch<Member>(API_ENDPOINTS.UPDATE_MEMBER(id), {
    method: 'PATCH',
    body: JSON.stringify(updatedData),
  });
}

/**
 * Menghapus data jemaat dari server.
 * @param {string} id - ID jemaat yang akan dihapus.
 * @returns {Promise<void>}
 */
export async function deleteMember(id: string): Promise<void> {
  console.log(`Deleting member ${id} via API...`);
  await customFetch<void>(API_ENDPOINTS.DELETE_MEMBER(id), {
    method: 'DELETE',
  });
}
