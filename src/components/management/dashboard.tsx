
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, QrCode, ScrollText, MessageSquareQuote, Ticket } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import type { Module } from "@/lib/api/types";
import { useMemo } from "react";

// Menambahkan 'module' key untuk mencocokkan dengan object permissions
const managementSections = [
  {
    title: "Manajemen Jemaat",
    description: "Lihat, tambah, dan kelola data anggota jemaat.",
    icon: Users,
    href: "/members-management",
    cta: "Kelola Jemaat",
    module: "members" as Module,
  },
  {
    title: "Pembuatan Check In",
    description: "Buat dan kelola kode QR untuk check-in ibadah atau acara.",
    icon: QrCode,
    href: "/check-in-creation",
    cta: "Buat Check In",
    module: "checkin" as Module,
  },
  {
    title: "Pokok Doa",
    description: "Tinjau dan kelola permohonan doa yang masuk dari jemaat.",
    icon: ScrollText,
    href: "/prayers-management",
    cta: "Lihat Doa",
    module: "prayers" as Module,
  },
  {
    title: "Pertanyaan Jemaat",
    description: "Lihat dan jawab pertanyaan yang diajukan oleh jemaat.",
    icon: MessageSquareQuote,
    href: "/questions-management",
    cta: "Lihat Pertanyaan",
    module: "questions" as Module,
  },
  {
    title: "Tiket Dukungan",
    description: "Kelola dan tanggapi tiket dukungan dari pengguna.",
    icon: Ticket,
    href: "/tickets-management",
    cta: "Kelola Tiket",
    module: "tickets" as Module,
  },
];

export function ManagementDashboard() {
  const { user } = useAuth();

  // Filter sections berdasarkan permission dari user yang login
  const accessibleSections = useMemo(() => {
    if (!user || !user.permissions) {
      return [];
    }
    // A user can see the management card if they have ANY permission for that module.
    return managementSections.filter(section => 
      user.permissions[section.module]?.length > 0
    );
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        {accessibleSections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessibleSections.map((section) => (
              <Card key={section.title} className="flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-primary">{section.title}</CardTitle>
                      <CardDescription className="mt-1">{section.description}</CardDescription>
                    </div>
                    <section.icon className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={section.href}>
                    <Button variant="management" className="w-full">{section.cta}</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Anda tidak memiliki akses ke modul manajemen apapun.</p>
          </div>
        )}
      </div>
    </div>
  );
}
