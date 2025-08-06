import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BappendaLogo } from "@/components/bappenda-logo";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-8 bg-primary text-primary-foreground">
      <BappendaLogo className="h-32 w-auto" />
      <div className="text-center">
        <h1 className="text-4xl font-bold">Selamat Datang</h1>
        <p className="mt-2 text-lg">di Aplikasi Bappenda Juara</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Link href="/login" passHref className="w-full">
          <Button size="lg" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">Masuk</Button>
        </Link>
        <Link href="/register" passHref className="w-full">
          <Button variant="outline" size="lg" className="w-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">Daftar</Button>
        </Link>
      </div>
    </div>
  );
}
