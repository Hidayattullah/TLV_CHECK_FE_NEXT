
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Pindai Kode QR</h1>
      </header>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
