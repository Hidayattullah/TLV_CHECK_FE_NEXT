
import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Member, NewMember, Permission, Module } from "@/lib/api/types";

/**
 * @fileoverview Repositori untuk manajemen data Jemaat (Members) dan Autentikasi.
 *
 * Repositori ini digunakan untuk aplikasi dalam mode produksi.
 * Fungsi-fungsi di dalamnya akan melakukan panggilan API sesungguhnya ke backend.
 */

// --- Authentication Functions ---

/**
 * Mengotentikasi pengguna dengan mengirimkan nomor telepon dan password ke server.
 * Panggil endpoint POST untuk login.
 *
 * @param {string} phoneNumber - Nomor telepon pengguna.
 * @param {string} password - Password pengguna.
 * @returns {Promise<{ access_token: string; user: Member }>} Objek yang berisi token JWT dan data member.
 * @throws {Error} Jika login gagal (misalnya, kredensial salah).
 */
export async function login(phoneNumber: string, password: string): Promise<{ access_token: string; user: Member }> {
  console.log("(API) Mencoba login...");
  return customFetch<{ access_token: string; user: Member }>(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, password }),
  });
}

/**
 * Mendaftarkan pengguna baru (registrasi publik).
 * Panggil endpoint POST untuk registrasi.
 *
 * @param {NewMember} newMemberData - Data jemaat baru yang akan didaftarkan.
 * @returns {Promise<{ access_token: string, user: Member }>} Data user dan token.
 * @throws {Error} Jika pendaftaran gagal (misalnya, nomor telepon sudah ada).
 */
export async function registerMember(newMemberData: NewMember): Promise<{ access_token: string, user: Member }> {
  console.log("(API) Menambahkan jemaat baru (registrasi)...");
  return customFetch<{ access_token: string, user: Member }>(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(newMemberData),
  });
}

/**
 * Mengambil data profil pengguna yang sedang login dari server.
 * Memerlukan token otentikasi yang valid di header.
 *
 * @returns {Promise<Member>} Data detail jemaat yang sedang login.
 * @throws {Error} Jika token tidak valid atau panggilan API gagal.
 */
export async function getProfile(): Promise<Member> {
  console.log(`(API) Mengambil data profil pengguna saat ini...`);
  return customFetch<Member>(API_ENDPOINTS.GET_PROFILE);
}

/**
 * Memperbarui data profil pengguna yang sedang login.
 * Panggil endpoint PUT dengan data yang akan diubah.
 *
 * @param {Partial<Member>} updatedData - Data yang akan diubah.
 * @returns {Promise<Member>} Data profil yang telah diperbarui.
 * @throws {Error} Jika pembaruan gagal.
 */
export async function updateProfile(updatedData: Partial<Member>): Promise<Member> {
  console.log("(API) Memperbarui profil pengguna saat ini...");
  return customFetch<Member>(API_ENDPOINTS.UPDATE_PROFILE, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
  });
}


// --- Member Management Functions (for Admins) ---

/**
 * Menambahkan jemaat baru oleh Admin.
 * Panggil endpoint POST dengan data jemaat baru.
 *
 * @param {NewMember} newMemberData - Data jemaat baru yang akan didaftarkan.
 * @returns {Promise<Member>} Data jemaat yang baru dibuat.
 * @throws {Error} Jika pendaftaran gagal.
 */
export async function addMember(newMemberData: NewMember): Promise<Member> {
  console.log("(API) Admin menambahkan jemaat baru...");
  return customFetch<Member>(API_ENDPOINTS.MEMBERS, {
    method: 'POST',
    body: JSON.stringify(newMemberData),
  });
}

/**
 * Mengambil semua data jemaat dari server dengan paginasi dan filter.
 * Panggil endpoint GET untuk mendapatkan daftar semua jemaat.
 *
 * @returns {Promise<{data: Member[], pagination: any}>} Daftar semua jemaat dan info paginasi.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function getMembers(
    page = 1,
    limit = 10,
    search = ''
): Promise<{data: Member[], pagination: any}> {
    console.log("(API) Mengambil semua data jemaat...");
    const url = new URL(API_ENDPOINTS.MEMBERS);
    url.searchParams.append('page', String(page));
    url.searchParams.append('limit', String(limit));
    if (search) {
        url.searchParams.append('search', search);
    }
    return customFetch<{data: Member[], pagination: any}>(url.toString());
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
 * Memperbarui data jemaat yang sudah ada di server. (Admin)
 * Panggil endpoint PUT dengan ID jemaat dan data yang akan diubah.
 *
 * @param {string} id - ID jemaat yang akan diperbarui.
 * @param {Partial<Member>} updatedData - Data yang akan diubah.
 * @returns {Promise<Member>} Data jemaat yang telah diperbarui.
 * @throws {Error} Jika pembaruan gagal.
 */
export async function updateMember(id: string, updatedData: Partial<Member>): Promise<Member> {
  console.log(`(API) Memperbarui jemaat ${id}...`);
  return customFetch<Member>(API_ENDPOINTS.UPDATE_MEMBER(id), {
    method: 'PUT',
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


/**
 * Mengatur hak akses lengkap untuk seorang jemaat.
 * Panggil endpoint PUT untuk mengatur permissions.
 *
 * @param {string} id - ID jemaat yang akan diubah hak aksesnya.
 * @param {Record<Module, Permission[]>} permissions - Objek hak akses yang lengkap.
 * @returns {Promise<Member>} Data jemaat yang telah diperbarui.
 * @throws {Error} Jika gagal.
 */
export async function setMemberPermissions(id: string, permissions: Record<Module, Permission[]>): Promise<Member> {
    console.log(`(API) Mengatur hak akses untuk jemaat ${id}...`);
    return customFetch<Member>(API_ENDPOINTS.SET_PERMISSIONS(id), {
        method: 'PUT',
        body: JSON.stringify({ permissions }),
    });
}
