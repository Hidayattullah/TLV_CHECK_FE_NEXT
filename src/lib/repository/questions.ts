import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Question } from "@/lib/api/types";

/**
 * @fileoverview Repositori untuk manajemen data Pertanyaan Jemaat.
 *
 * Repositori ini digunakan untuk aplikasi dalam mode produksi.
 * Fungsi-fungsi di dalamnya akan melakukan panggilan API sesungguhnya ke backend.
 * Pastikan backend Anda memiliki endpoint yang sesuai untuk setiap fungsi.
 */

/**
 * Mengambil semua data pertanyaan dari server.
 * Panggil endpoint GET untuk mendapatkan daftar semua pertanyaan.
 *
 * @returns {Promise<Question[]>} Daftar semua pertanyaan.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function getQuestions(): Promise<Question[]> {
  console.log("(API) Mengambil semua data pertanyaan...");
  return customFetch<Question[]>(API_ENDPOINTS.GET_QUESTIONS);
}

/**
 * Menambahkan pertanyaan baru ke server.
 * Panggil endpoint POST dengan data pertanyaan baru.
 *
 * @param {object} data - Data pertanyaan baru.
 * @param {string} data.userName - Nama pengguna yang bertanya.
 * @param {string} [data.avatarUrl] - URL avatar pengguna (opsional).
 * @param {string} data.questionText - Isi pertanyaan.
 * @returns {Promise<Question>} Pertanyaan baru yang telah dibuat.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function addQuestion(data: { userName: string, avatarUrl?: string, questionText: string }): Promise<Question> {
  console.log("(API) Menambahkan pertanyaan baru...");
  return customFetch<Question>(API_ENDPOINTS.ADD_QUESTION, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Mengirimkan jawaban ke server untuk pertanyaan tertentu.
 * Panggil endpoint POST dengan ID pertanyaan dan data jawaban.
 *
 * @param {string} questionId - ID pertanyaan yang akan dijawab.
 * @param {string} responseText - Isi jawaban.
 * @param {string} responderName - Nama admin yang menjawab.
 * @returns {Promise<Question>} Pertanyaan yang telah diperbarui dengan jawaban.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function respondToQuestion(
  questionId: string,
  responseText: string,
  responderName: string
): Promise<Question> {
  console.log(`(API) Menjawab pertanyaan ${questionId}...`);
  return customFetch<Question>(API_ENDPOINTS.RESPOND_TO_QUESTION(questionId), {
    method: 'POST',
    body: JSON.stringify({ responseText, responderName }),
  });
}

/**
 * Mengarsipkan pertanyaan di server.
 * Panggil endpoint POST atau PATCH untuk mengubah status arsip.
 *
 * @param {string} questionId - ID pertanyaan yang akan diarsipkan.
 * @returns {Promise<Question>} Pertanyaan yang telah diarsipkan.
 * @throws {Error} Jika panggilan API gagal.
 */
export async function archiveQuestion(questionId: string): Promise<Question> {
    console.log(`(API) Mengarsipkan pertanyaan ${questionId}...`);
    return customFetch<Question>(API_ENDPOINTS.ARCHIVE_QUESTION(questionId), {
        method: 'POST', // atau 'PATCH' sesuai desain API Anda
    });
}

/**
 * Menghapus satu atau lebih pertanyaan dari server.
 * Panggil endpoint DELETE dengan daftar ID yang akan dihapus.
 *
 * @param {string[]} ids - Array berisi ID pertanyaan yang akan dihapus.
 * @returns {Promise<void>}
 * @throws {Error} Jika panggilan API gagal.
 */
export async function deleteQuestions(ids: string[]): Promise<void> {
    console.log(`(API) Menghapus pertanyaan: ${ids.join(', ')}...`);
    await customFetch<void>(API_ENDPOINTS.DELETE_QUESTIONS, {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
    });
}
