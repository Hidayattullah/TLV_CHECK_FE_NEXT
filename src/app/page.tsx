
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/common/bottom-nav";
import { AuthGuard } from "@/components/common/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, UserCog, History, ScrollText, Church } from "lucide-react";
import { useMemo } from "react";

const mainFeatures = [
  {
    title: "Check In",
    description: "Lihat riwayat kehadiran ibadah Anda.",
    icon: History,
    href: "/check-in",
    cta: "Lihat Riwayat"
  },
  {
    title: "Dukungan Doa",
    description: "Kirimkan permohonan doa atau doakan sesama.",
    icon: ScrollText,
    href: "/prayer-support",
    cta: "Kirim Doa"
  },
  {
    title: "Tentang Gereja",
    description: "Kenali lebih dalam visi, misi, dan jadwal ibadah.",
    icon: Church,
    href: "/services",
    cta: "Pelajari Lebih"
  }
];

export default function HomePage() {
  const { user } = useAuth();

  const hasManagementAccess = useMemo(() => {
    if (!user || !user.permissions) return false;
    // Check if user has 'read' permission for any of the management modules
    return Object.values(user.permissions).some(perms => perms.includes('read'));
  }, [user]);

  return (
    <AuthGuard>
      <div className="bg-background min-h-screen flex flex-col pb-20">
        <header className="bg-primary text-primary-foreground p-4 flex flex-col items-start gap-2 sticky top-0 z-10 shadow-md">
           <div className="flex items-center gap-3">
             <Image 
                src="/images/emblem_nbg.png" 
                alt="The Lord's Vineyard Logo"
                width={40}
                height={40}
                data-ai-hint="emblem"
              />
              <div>
                <h1 className="text-xl font-bold">Selamat Datang,</h1>
                <p className="text-base opacity-90">{user?.name || "Jemaat Tuhan"}</p>
              </div>
           </div>
        </header>
        
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <div className="space-y-8 max-w-4xl mx-auto">
            {hasManagementAccess && (
               <Card className="bg-accent text-accent-foreground border-none shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Manajemen Gereja</CardTitle>
                      <CardDescription className="text-accent-foreground/80 mt-1">Akses dasbor untuk mengelola data gereja.</CardDescription>
                    </div>
                    <UserCog className="w-8 h-8 text-accent-foreground/70" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/management">
                    <Button 
                      variant="outline"
                      className="w-full bg-accent-foreground text-accent hover:bg-accent-foreground/90"
                    >
                      Buka Dasbor Manajemen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainFeatures.map((feature) => (
                <Card key={feature.title} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-primary">{feature.title}</CardTitle>
                        <CardDescription className="mt-1">{feature.description}</CardDescription>
                      </div>
                      <feature.icon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow" />
                  <CardContent>
                    <Link href={feature.href}>
                      <Button variant="management" className="w-full">{feature.cta}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
