
import type { PrayerRequest } from "@/lib/api/types";

// Helper function to get a date string from days ago
const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const mockPrayers: PrayerRequest[] = [
  { id: "p1", userName: "Maria S.", requestText: "Mohon doakan untuk kesembuhan ibu saya yang sedang sakit keras. Kiranya Tuhan memberikan kekuatan dan pemulihan.", submittedDate: getDateString(1), isAnonymous: false, isResponded: true, lastResponseBy: "Tubagus Rifan", responseText: "Kami berdoa untuk ibu Maria, agar Tuhan Yesus memberikan kekuatan dan jamahan kesembuhan. Tetap kuat dalam iman. Tuhan memberkati.", isArchived: false },
  { id: "p2", userName: "Anonim", requestText: "Pergumulan dalam pekerjaan. Saya merasa tidak memiliki harapan dan stres. Mohon dukungan doa agar saya menemukan jalan keluar.", submittedDate: getDateString(1), isAnonymous: true, submittedBy: "Tubagus Rifan", isResponded: true, lastResponseBy: "Tubagus Rifan", responseText: "Tuhan adalah sumber kekuatan dan pengharapan. Kami berdoa agar Anda diberikan hikmat dan jalan keluar dalam setiap tantangan pekerjaan. Jangan pernah menyerah. Filipi 4:13.", isArchived: false },
  { id: "p3", userName: "Yohanes P.", avatarUrl: "/avatars/yohanes.png", requestText: "Doakan untuk kelancaran studi anak saya yang akan menghadapi ujian akhir. Semoga diberikan hikmat dan ketenangan.", submittedDate: getDateString(2), isAnonymous: false, isResponded: false, isArchived: false },
  { id: "p4", userName: "Keluarga Smith", requestText: "Kami sekeluarga sedang mengalami kesulitan finansial. Mohon doakan agar Tuhan membuka jalan dan mencukupkan segala kebutuhan kami.", submittedDate: getDateString(3), isAnonymous: false, isResponded: true, lastResponseBy: "Admin Gereja", responseText: "Tuhan Yesus adalah sumber segala berkat. Kami berdoa agar jalan-jalan baru dibukakan untuk keluarga Smith. Percayalah pada pemeliharaan-Nya.", isArchived: false },
  { id: "p5", userName: "Anonim", requestText: "Saya sedang berjuang melawan kecanduan. Mohon doa agar saya diberikan kekuatan untuk lepas dari jerat ini.", submittedDate: getDateString(4), isAnonymous: true, isResponded: false, isArchived: false },
  { id: "p6", userName: "Grace L.", avatarUrl: "/avatars/grace.png", requestText: "Mengucap syukur atas pekerjaan baru yang Tuhan berikan. Mohon doakan agar saya bisa menjadi berkat di tempat kerja yang baru.", submittedDate: getDateString(5), isAnonymous: false, isResponded: true, lastResponseBy: "Tubagus Rifan", responseText: "Puji Tuhan untuk berkat pekerjaan baru! Kami doakan agar Grace dapat menjadi garam dan terang di lingkungan kerjanya.", isArchived: false },
  { id: "p7", userName: "David K.", requestText: "Mohon doakan untuk pelayanan kaum muda di gereja kami, agar semakin bertumbuh dan berdampak bagi banyak orang.", submittedDate: getDateString(6), isResponded: false, isArchived: false },
  { id: "p8", userName: "Anonim", requestText: "Pergumulan dalam hubungan rumah tangga. Kiranya Tuhan memulihkan dan memberikan kedamaian.", submittedDate: getDateString(7), isAnonymous: true, isResponded: false, isArchived: false },
  { id: 'prayer-1722886586016', userName: 'Tubagus Rifan', requestText: 'Mohon doakan untuk kelancaran proyek pekerjaan yang sedang saya kerjakan. Kiranya Tuhan memberikan hikmat dan jalan keluar.', submittedDate: getDateString(8), isAnonymous: false, isResponded: true, lastResponseBy: 'Admin Gereja', responseText: 'Tuhan menyertai setiap langkahmu, Tubagus. Kami berdoa agar hikmat dan kekuatan dari-Nya senantiasa menyertaimu dalam menyelesaikan proyek ini. Tetap andalkan Tuhan. Tuhan memberkati.', isArchived: true, archivedDate: getDateString(1) }
];
