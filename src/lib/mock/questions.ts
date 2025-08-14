
import type { Question } from "@/lib/api/types";

// Helper function to get a date string from days ago
const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};


export const mockQuestions: Question[] = [
  { id: "q1", userName: "Budi S.", questionText: "Bagaimana cara mendaftar untuk pelayanan musik di gereja? Apakah ada audisi atau persyaratan khusus yang harus dipenuhi?", submittedDate: getDateString(1), isResponded: true, responseBy: "Admin Gereja", responseText: "Halo Budi, terima kasih atas minatnya. Anda bisa mengisi formulir pendaftaran pelayanan di link berikut: [link]. Nanti tim musik akan menghubungi Anda untuk jadwal audisi. Tuhan memberkati." },
  { id: "q2", userName: "Rina A.", questionText: "Saya ingin bertanya mengenai jadwal ibadah anak (Sekolah Minggu). Apakah ada kelas untuk anak usia di bawah 5 tahun?", submittedDate: getDateString(2), isResponded: false },
  { id: "q3", userName: "Joko P.", avatarUrl: "/avatars/joko.png", questionText: "Apakah gereja menyediakan layanan konseling pranikah? Kami berencana menikah tahun depan dan ingin mendapatkan bimbingan.", submittedDate: getDateString(3), isResponded: true, responseBy: "Tubagus Rifan", responseText: "Puji Tuhan untuk rencananya, Joko. Ya, kami menyediakan kelas bimbingan pranikah. Silakan hubungi sekretariat gereja untuk informasi jadwal dan pendaftaran." },
  { id: "q4", userName: "Lia K.", questionText: "Di mana saya bisa mendapatkan materi atau rekaman khotbah dari ibadah hari Minggu yang lalu?", submittedDate: getDateString(5), isResponded: true, responseBy: "Admin Gereja", responseText: "Tentu, semua rekaman khotbah tersedia di kanal YouTube resmi gereja kita. Anda bisa mencarinya dengan judul 'The Lord's Vineyard Official'." },
  { id: "q5", userName: "David T.", questionText: "Saya adalah anggota baru, bagaimana cara saya bisa bergabung dengan kelompok sel (komsel)?", submittedDate: getDateString(6), isResponded: false },
  // Archived questions (older than 7 days)
  { id: "q6", userName: "Siti H.", questionText: "Apakah ada program baptisan dalam waktu dekat?", submittedDate: getDateString(8), isResponded: true, responseBy: "Admin Gereja", responseText: "Ya, pendaftaran untuk baptisan air akan dibuka pada minggu pertama bulan September. Pantau terus warta jemaat untuk informasi lebih lanjut.", isArchived: true, archivedDate: getDateString(1) },
  { id: "q7", userName: "Agus W.", questionText: "Saya kesulitan mengakses aplikasi versi lama, apakah ada pembaruan?", submittedDate: getDateString(9), isResponded: false, isArchived: true, archivedDate: getDateString(2) },
  // This one is old enough to be auto-deleted in the simulation
  { id: "q8", userName: "Old User", questionText: "Pertanyaan yang sangat lama sekali.", submittedDate: getDateString(20), isResponded: true, responseBy: "Admin", responseText: "Sudah dijawab.", isArchived: true, archivedDate: getDateString(10) },
];
