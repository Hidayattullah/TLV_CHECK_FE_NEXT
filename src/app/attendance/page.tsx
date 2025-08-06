import { AttendanceReport } from "@/components/attendance/attendance-report";

export default function AttendancePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl mb-2 text-accent">Attendance Report</h1>
        <p className="text-muted-foreground max-w-2xl">
          View member attendance records. For members with low attendance, you can generate a personalized outreach message to encourage them.
        </p>
      </header>
      <AttendanceReport />
    </div>
  );
}
