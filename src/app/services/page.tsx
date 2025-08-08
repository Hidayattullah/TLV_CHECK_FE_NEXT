
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Church, Cross, Calendar, Users, Target, Rocket } from "lucide-react";
import React from "react";
import Link from "next/link";

const aboutData = [
  {
    value: "item-1",
    title: "Tentang Gereja",
    icon: Church,
    content: "The Lord's Vineyard Church adalah sebuah komunitas orang percaya yang berdedikasi untuk menyebarkan kasih Kristus dan membangun jemaat yang kuat dalam iman. Kami adalah tempat bagi semua orang untuk bertumbuh, melayani, dan menemukan keluarga di dalam Kristus.",
  },
  {
    value: "item-2",
    title: "Visi & Misi",
    icon: Target,
    content: (
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold flex items-center gap-2 mb-1"><Rocket className="w-4 h-4 text-primary" />Visi</h3>
                <p>Menjadi Gereja yang mengasihi Tuhan Yesus dan sesama.</p>
            </div>
            <div>
                <h3 className="font-semibold flex items-center gap-2 mb-1"><Cross className="w-4 h-4 text-primary" />Misi</h3>
                 <p>Mempersiapkan Jemaat yang kudus, penuh belas kasihan dan berdampak.</p>
            </div>
        </div>
    )
  },
  {
    value: "item-3",
    title: "Jadwal Ibadah",
    icon: Calendar,
    content: (
      <ul className="space-y-2 list-disc pl-4">
        <li><strong>Ibadah Raya 1 & 2:</strong> Minggu, 07.30 & 10.00</li>
        <li><strong>Sekolah Minggu:</strong> Minggu, 10.00</li>
        <li><strong>Ibadah Kasih Agape:</strong> Minggu, 13.30</li>
        <li><strong>Ibadah Dewasa Muda:</strong> Minggu, 17.00</li>
        <li><strong>Ibadah Youth Burning Spirit:</strong> Sabtu, 18.00</li>
      </ul>
    ),
  },
  {
    value: "item-4",
    title: "Pelayanan & Ministries",
    icon: Users,
    content: (
      <div className="space-y-3">
        <p>🎶 "Pakai Talentamu untuk Kemuliaan Tuhan"</p>
        <p>Setiap talenta adalah pemberian Tuhan, dan pelayanan adalah cara kita mengembalikannya untuk kemuliaan-Nya. Di gereja ini, ada banyak kesempatan buat kamu terlibat sesuai passion dan kemampuanmu.</p>
        <p>Karena pelayanan bukan cuma soal tampil di depan, tapi soal hati yang mau dipakai Tuhan. ❤️ Yuk, temukan tempatmu, pakai talentamu, dan jadilah berkat bagi banyak orang!</p>
        <p>
          📲 Buat kamu yang rindu melayani bersama, klik link berikut ini untuk mendaftarnya:{" "}
          <Link href="https://forms.gle/kqWn3st16WkubzVx7" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
            https://forms.gle/kqWn3st16WkubzVx7
          </Link>
        </p>
      </div>
    ),
  },
];


export default function ServicesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
            <h1 className="font-headline text-4xl mb-2 text-primary">Mengenal The Lord&apos;s Vineyard</h1>
            <p className="text-muted-foreground max-w-2xl">
            Temukan informasi lengkap mengenai gereja kami, mulai dari visi dan misi, jadwal ibadah, hingga berbagai pelayanan yang ada untuk Anda.
            </p>
        </header>
        <Card className="max-w-3xl mx-auto">
            <CardContent className="p-4 sm:p-6">
                 <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    {aboutData.map((item) => (
                        <AccordionItem value={item.value} key={item.value}>
                            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5 text-primary" />
                                    <span>{item.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base pl-11">
                                {item.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    </div>
  );
}
