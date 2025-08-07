import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FilePen, History, Search, BookOpen, MessageSquareQuote, Barcode } from "lucide-react";
import { UserCircle } from "lucide-react";

const menuItems = [
  { href: "/register", label: "Registrasi E-SPPT", icon: FilePen },
  { href: "#", label: "Catatan Pembayaran", icon: History },
  { href: "#", label: "Cek Pelayanan", icon: Search },
  { href: "#", label: "Panduan Aplikasi", icon: BookOpen },
  { href: "#", label: "Pertanyaan", icon: MessageSquareQuote },
];

const MenuItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => (
  <Link href={href} passHref>
    <Card className="bg-card hover:bg-accent/50 transition-colors duration-200 aspect-square flex flex-col items-center justify-center p-4 text-center rounded-2xl shadow-md">
      <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
        <Icon className="w-10 h-10 text-primary" />
        <p className="text-sm font-semibold text-foreground/80">{label}</p>
      </CardContent>
    </Card>
  </Link>
);


export default function DashboardPage() {
  return (
    <div className="bg-primary min-h-screen flex flex-col relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-0 w-full h-1/2">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/10 rounded-full" />
        <div className="absolute top-10 right-0 w-3/4 h-1/2 bg-white/5 rounded-full" />
      </div>

      <header className="p-4 flex items-center justify-between text-white relative z-10">
        <div className="flex items-center gap-3">
          <Image
            src="/images/emblem_nbg.png"
            alt="The Lord's Vineyard Logo"
            width={48}
            height={48}
            className="w-12 h-12"
            data-ai-hint="emblem"
          />
          <div>
            <h1 className="font-bold text-lg">The Lord&apos;s Vineyard</h1>
            <p className="text-sm">Entry Sistem</p>
          </div>
        </div>
        <Link href="/profile" passHref>
           <Button variant="ghost" size="icon" className="bg-white/90 text-primary rounded-full w-10 h-10 hover:bg-white">
            <UserCircle className="w-6 h-6" />
          </Button>
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center w-full mt-4 z-10">
        <div className="bg-card w-full flex-grow p-6 rounded-3xl shadow-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
              <Link href="/scanner" passHref>
                <Card className="bg-card hover:bg-accent/50 transition-colors duration-200 flex items-center p-4 text-center rounded-2xl shadow-md">
                   <CardContent className="p-0 flex items-center gap-4">
                    <Barcode className="w-10 h-10 text-primary" />
                    <p className="text-base font-semibold text-foreground/80">Scan Barcode</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
            <MenuItem href="/attendance" label="Catatan Absensi" icon={History} />
            <MenuItem href="#" label="Cek Pelayanan" icon={Search} />
            <MenuItem href="#" label="Panduan Aplikasi" icon={BookOpen} />
            <MenuItem href="#" label="Pertanyaan" icon={MessageSquareQuote} />
          </div>
        </div>
      </main>

      <footer className="w-full p-4 text-center text-primary-foreground text-sm relative z-10 bg-primary">
        &copy; {new Date().getFullYear()} Tubagus Rifan, All Rights Reserved
      </footer>
    </div>
  );
}
