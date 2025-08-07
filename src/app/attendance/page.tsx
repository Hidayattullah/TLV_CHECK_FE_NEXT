import { AttendanceReport } from "@/components/attendance/attendance-report";

export default function AttendancePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl mb-2 text-primary">Laporan Absensi</h1>
        <p className="text-muted-foreground max-w-2xl">
          Lihat catatan absensi untuk setiap ibadah. Anda dapat melihat detail kehadiran anda di sini.
        </p>
      </header>
      <AttendanceReport />
    </div>
  );
}
