// FILE INI SUDAH TIDAK DIGUNAKAN LAGI DAN DAPAT DIHAPUS.
// Fungsionalitas telah dipindahkan ke /src/app/scanner-duplicate/layout.tsx

"use client";

import { AuthGuard } from "@/components/common/auth-guard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ScannerResultLayout({
  children,
  title
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <AuthGuard>
      <div className="bg-background min-h-screen flex flex-col">
        <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
          <Link href="/dashboard" passHref>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{title}</h1>
        </header>
        <main className="flex-grow flex items-center justify-center">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
