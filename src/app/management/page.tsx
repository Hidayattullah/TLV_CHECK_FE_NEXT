
import { ManagementDashboard } from "@/components/management/dashboard";

export default function ManagementPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl mb-2 text-primary">Dasbor Manajemen</h1>
        <p className="text-muted-foreground max-w-2xl">
          Kelola data jemaat, check-in, pokok doa, dan pertanyaan di satu tempat.
        </p>
      </header>
      <ManagementDashboard />
    </div>
  );
}
