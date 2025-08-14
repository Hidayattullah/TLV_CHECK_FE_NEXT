
"use client";

import { BottomNav } from "@/components/common/bottom-nav";
import { AuthGuard } from "@/components/common/auth-guard";
import { ServiceCard } from "@/components/services/service-card";
import { Separator } from "@/components/ui/separator";

const services = [
    {
      userName: "The Lord's Vineyard",
      userAvatar: "/images/emblem_nbg.png",
      time: "2 jam yang lalu",
      title: "Ibadah Minggu Pagi",
      description: "Jangan lewatkan ibadah minggu pagi besok! Mari datang dan bersekutu bersama dalam hadirat Tuhan. Ajak keluarga dan teman-teman Anda.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "church interior",
      likes: 120,
      comments: 15,
      shares: 8,
    },
    {
      userName: "Youth Ministry",
      userAvatar: "/images/emblem_nbg.png",
      time: "1 hari yang lalu",
      title: "Youth Gathering: Burning Spirit",
      description: "Kaum muda, mari bergabung dalam acara Youth Gathering akhir pekan ini! Akan ada sesi praise & worship yang luar biasa dan firman yang mengubahkan.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "youth group",
      likes: 85,
      comments: 22,
      shares: 11,
    },
];

export default function HomePage() {
  return (
    <AuthGuard>
      <div className="bg-background min-h-screen flex flex-col pb-20">
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
            <div className="max-w-xl mx-auto space-y-6">
                <h1 className="font-headline text-3xl text-primary">Aktivitas Terbaru</h1>
                <Separator />
                {services.map((service, index) => (
                    <ServiceCard key={index} {...service} />
                ))}
            </div>
        </main>
        
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
