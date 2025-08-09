
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, QrCode, ScrollText, MessageSquareQuote } from "lucide-react";
import Link from "next/link";

const managementSections = [
  {
    title: "Manajemen Jemaat",
    description: "Lihat, tambah, dan kelola data anggota jemaat.",
    icon: Users,
    href: "/management/members",
    cta: "Kelola Jemaat",
  },
  {
    title: "Pembuatan Absensi",
    description: "Buat dan kelola kode QR untuk absensi ibadah atau acara.",
    icon: QrCode,
    href: "/management/attendance-creation",
    cta: "Buat Absensi",
  },
  {
    title: "Pokok Doa",
    description: "Tinjau dan kelola permohonan doa yang masuk dari jemaat.",
    icon: ScrollText,
    href: "/management/prayers",
    cta: "Lihat Doa",
  },
  {
    title: "Pertanyaan Jemaat",
    description: "Lihat dan jawab pertanyaan yang diajukan oleh jemaat.",
    icon: MessageSquareQuote,
    href: "/management/questions",
    cta: "Lihat Pertanyaan",
  },
];

export function ManagementDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {managementSections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
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
  );
}
