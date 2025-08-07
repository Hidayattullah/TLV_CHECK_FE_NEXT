
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Tentang Kami</h1>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="w-full p-4 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Tubagus Rifan, All Rights Reserved
      </footer>
    </div>
  );
}
