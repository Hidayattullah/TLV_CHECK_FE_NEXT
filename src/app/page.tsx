
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FilePen, History, Search, BookOpen, MessageSquareQuote, QrCode, Home } from "lucide-react";
import { UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomNav } from "@/components/common/bottom-nav";

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
  const userName = "John Doe";
  const userInitials = userName.split(' ').map(n => n[0]).join('');

  return (
    <div className="bg-primary min-h-screen flex flex-col relative overflow-hidden pb-24">
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-0 w-full h-1/2">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/10 rounded-full" />
        <div className="absolute top-10 right-0 w-3/4 h-1/2 bg-white/5 rounded-full" />
      </div>

      <header className="p-4 flex items-center justify-between text-white relative z-10">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src="https://placehold.co/.png" alt={userName} data-ai-hint="person portrait" />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm">Selamat Datang,</p>
            <h1 className="font-bold text-lg">{userName}</h1>
          </div>
        </div>
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

      <BottomNav />
    </div>
  );
}
