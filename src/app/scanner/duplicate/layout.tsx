
import ScannerResultLayout from "../success/layout";

export default function DuplicateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScannerResultLayout title="Sudah Check-in">
        {children}
    </ScannerResultLayout>
  )
}
