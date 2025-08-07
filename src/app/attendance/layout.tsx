import { MainLayout } from "@/components/main-layout";

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
