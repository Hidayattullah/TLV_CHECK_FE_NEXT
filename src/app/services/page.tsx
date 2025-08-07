
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, Cross, Calendar, Users, Target, Rocket } from "lucide-react";
import React from "react";

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
                <p>Menjadi gereja yang berdampak, yang menjangkau jiwa-jiwa bagi Kristus dan memuridkan mereka untuk menjadi serupa dengan-Nya.</p>
            </div>
            <div>
                <h3 className="font-semibold flex items-center gap-2 mb-1"><Cross className="w-4 h-4 text-primary" />Misi</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Menyelenggarakan ibadah yang penuh hadirat Tuhan.</li>
                    <li>Membangun komunitas yang saling mengasihi dan mendukung.</li>
                    <li>Melengkapi jemaat untuk melayani sesuai karunia.</li>
                    <li>Menjadi berkat bagi masyarakat sekitar.</li>
                </ul>
            </div>
        </div>
    )
  },
  {
    value: "item-3",
    title: "Jadwal Ibadah",
    icon: Calendar,
    content: (
      <ul className="space-y-2">
        <li><strong>Ibadah Raya Minggu:</strong> 09:00 & 17:00</li>
        <li><strong>Ibadah Pemuda (Youth):</strong> Sabtu, 18:30</li>
        <li><strong>Sekolah Minggu:</strong> Minggu, 09:30</li>
        <li><strong>Ibadah Tengah Minggu:</strong> Rabu, 19:00</li>
      </ul>
    ),
  },
  {
    value: "item-4",
    title: "Pelayanan & Ministries",
    icon: Users,
    content: "Kami memiliki berbagai pelayanan untuk segala usia dan minat, termasuk Pelayanan Anak, Pelayanan Remaja & Pemuda, Pelayanan Musik & Multimedia, Pelayanan Wanita, dan Pelayanan Sosial. Mari bergabung dan melayani bersama kami!",
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
