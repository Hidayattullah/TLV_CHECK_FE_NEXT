
"use client";

import { BottomNav } from "@/components/common/bottom-nav";
import { AuthGuard } from "@/components/common/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, History, Shield, Heart, HelpCircle, Church } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useMemo } from "react";
import type { Module } from "@/lib/api/types";

const userActions = [
  {
    title: "Riwayat Check-In",
    description: "Lihat riwayat kehadiran ibadah Anda.",
    icon: History,
    href: "/check-in",
    cta: "Lihat Riwayat",
  },
  {
    title: "Dukungan Doa",
    description: "Kirimkan permohonan doa Anda.",
    icon: Heart,
    href: "/prayer-support",
    cta: "Kirim Doa",
  },
  {
    title: "Pertanyaan & Jawaban",
    description: "Ajukan pertanyaan seputar gereja.",
    icon: HelpCircle,
    href: "/faq",
    cta: "Tanya Jawab",
  },
  {
    title: "Tentang Gereja",
    description: "Kenali lebih dalam visi dan misi kami.",
    icon: Church,
    href: "/services",
    cta: "Pelajari Lebih",
  },
];

export default function HomePage() {
  const { user } = useAuth();

  const hasManagementAccess = useMemo(() => {
    if (!user?.permissions) return false;
    // Check if user has 'read' permission for any module
    return Object.values(user.permissions).some(perms => perms.includes("read"));
  }, [user]);

  return (
    <AuthGuard>
      <div className="bg-background min-h-screen flex flex-col pb-20">
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="font-headline text-4xl mb-2 text-primary">
                Selamat Datang, {user?.name.split(" ")[0]}
              </h1>
              <p className="text-muted-foreground">Apa yang ingin Anda lakukan hari ini?</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasManagementAccess && (
                <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-primary/5 border-primary/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-primary flex items-center gap-2">
                          <Shield />
                          Manajemen Gereja
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Akses dasbor untuk mengelola data jemaat, check-in, dan lainnya.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href="/management">
                      <Button variant="management">
                        Buka Dasbor Manajemen <ArrowRight className="ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {userActions.map((action) => (
                <Card key={action.title} className="flex flex-col">
                  <CardHeader className="flex-grow">
                     <div className="flex items-start justify-between">
                        <div>
                           <CardTitle className="text-xl flex items-center gap-3">
                            <action.icon className="w-6 h-6 text-primary" />
                            {action.title}
                          </CardTitle>
                          <CardDescription className="mt-2">{action.description}</CardDescription>
                        </div>
                      </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={action.href}>
                      <Button variant="outline" className="w-full">
                        {action.cta}
                      </Button>
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
