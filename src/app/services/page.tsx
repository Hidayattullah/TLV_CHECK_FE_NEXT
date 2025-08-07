
import { ServiceCard } from "@/components/services/service-card";

const services = [
  {
    id: "1",
    userName: "The Lord's Vineyard Church",
    userAvatar: "/images/emblem_nbg.png",
    time: "2 jam yang lalu",
    title: "Ibadah Raya Minggu",
    description: "Mari bergabung bersama kami dalam Ibadah Raya setiap hari Minggu. Kita akan memuji dan menyembah Tuhan, serta mendengarkan firman-Nya yang menguatkan iman.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "church praise",
    likes: 120,
    comments: 15,
    shares: 8,
  },
  {
    id: "2",
    userName: "The Lord's Vineyard Youth",
    userAvatar: "/images/emblem_nbg.png",
    time: "1 hari yang lalu",
    title: "Youth Service: 'Fearless Generation'",
    description: "Untuk para kaum muda! Jangan lewatkan ibadah pemuda kami yang penuh semangat. Tema bulan ini adalah 'Fearless Generation'. Ajak teman-temanmu!",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "youth group",
    likes: 250,
    comments: 45,
    shares: 22,
  },
  {
    id: "3",
    userName: "Sunday School TLV",
    userAvatar: "/images/emblem_nbg.png",
    time: "3 hari yang lalu",
    title: "Sekolah Minggu Ceria",
    description: "Kelas Sekolah Minggu kembali hadir! Anak-anak akan belajar firman Tuhan dengan cara yang menyenangkan melalui cerita, lagu, dan aktivitas kreatif.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "children sunday school",
    likes: 88,
    comments: 10,
    shares: 5,
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-muted/40 min-h-full">
      <div className="max-w-2xl mx-auto py-4 sm:py-6 lg:py-8 px-2 sm:px-4 space-y-4">
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  );
}
