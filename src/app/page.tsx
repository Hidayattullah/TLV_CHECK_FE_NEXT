
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FilePen, History, Search, BookOpen, MessageSquareQuote, QrCode, Home } from "lucide-react";
import { UserCircle } from "lucide-react";

const menuItems = [
  { href: "/attendance", label: "Absenku", icon: History },
  { href: "/services", label: "Tentang Kita", icon: Search },
  { href: "/faq", label: "Pertanyaan", icon: MessageSquareQuote },
  { href: "/register", label: "Registrasi", icon: FilePen },
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
    <div className="bg-primary min-h-screen flex flex-col relative overflow-hidden pb-24">
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
            <MenuItem href="/attendance" label="Absenku" icon={History} />
            <MenuItem href="/services" label="Tentang Kita" icon={Search} />
            <MenuItem href="/faq" label="Pertanyaan" icon={MessageSquareQuote} />
            <MenuItem href="/register" label="Registrasi" icon={FilePen} />
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border/50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
        <div className="flex justify-around items-center h-full max-w-lg mx-auto">
          <Link href="/" className="flex flex-col items-center justify-center text-primary w-16 text-center">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/attendance" className="flex flex-col items-center justify-center text-foreground/70 hover:text-primary w-16 text-center">
            <History className="w-6 h-6 mb-1" />
            <span className="text-xs">Absenku</span>
          </Link>
          
          <div className="relative w-16 h-full flex items-center justify-center">
             <Link href="/scanner" className="absolute bottom-5 flex flex-col items-center justify-center">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 bg-card rounded-full transform scale-110"></div>
                   <Button size="icon" className="relative w-16 h-16 rounded-full bg-primary shadow-lg hover:bg-primary/90">
                    <QrCode className="w-9 h-9 text-primary-foreground" />
                  </Button>
                </div>
              <span className="text-xs mt-2 text-foreground/70">Scan</span>
            </Link>
          </div>
          
          <Link href="/services" className="flex flex-col items-center justify-center text-foreground/70 hover:text-primary w-16 text-center">
            <Search className="w-6 h-6 mb-1" />
            <span className="text-xs">Tentang</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center justify-center text-foreground/70 hover:text-primary w-16 text-center">
            <UserCircle className="w-6 h-6 mb-1" />
            <span className="text-xs">Profil</span>
          </Link>
        </div>
      </nav>

    </div>
  );
}
