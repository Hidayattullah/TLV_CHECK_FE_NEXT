/**
 * @fileoverview Klien API kustom untuk melakukan panggilan ke backend.
 *
 * File ini menyediakan wrapper di sekitar `fetch` bawaan untuk
 * menyederhanakan panggilan API dan secara otomatis melampirkan
 * JSON Web Token (JWT) untuk otentikasi.
 */

/**
 * Mengambil token otentikasi (JWT) dari localStorage.
 * Token ini disimpan saat pengguna berhasil login.
 *
 * @returns {string | null} JWT yang tersimpan, atau null jika tidak ada.
 */
function getAuthToken(): string | null {
  // Pastikan kode ini hanya berjalan di sisi klien (browser)
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
}

/**
 * Fungsi fetch kustom yang secara otomatis menambahkan header yang diperlukan,
 * termasuk header 'Content-Type' dan 'Authorization' dengan Bearer Token (JWT).
 *
 * @template T - Tipe data yang diharapkan dari respons API.
 * @param {string} url - URL endpoint API yang akan dipanggil.
 * @param {RequestInit} [options={}] - Opsi tambahan untuk permintaan fetch (misalnya, method, body).
 * @returns {Promise<T>} Promise yang akan resolve dengan data JSON dari respons.
 * @throws {Error} Jika panggilan API gagal atau respons tidak OK.
 */
async function customFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Jika token ada, tambahkan ke header Authorization.
  // Backend Anda akan menggunakan token ini untuk memverifikasi siapa pengguna yang membuat permintaan.
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Penanganan error yang lebih baik: coba parse body error dari JSON.
    const errorBody = await response.json().catch(() => ({ message: 'Terjadi kesalahan yang tidak diketahui' }));
    throw new Error(errorBody.message || 'Permintaan API gagal');
  }

  // Jika respons berhasil tetapi tidak memiliki konten (misalnya, untuk permintaan DELETE),
  // kembalikan null atau objek kosong untuk menghindari error parsing JSON.
  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
    return {} as Promise<T>;
  }

  return response.json() as Promise<T>;
}

export default customFetch;
