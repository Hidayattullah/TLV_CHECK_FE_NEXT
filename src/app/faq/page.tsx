
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Bagaimana keamanan data yang sudah diregistrasi?",
    answer:
      "Kami menjamin keamanan data Anda dengan menggunakan enkripsi end-to-end dan praktik keamanan standar industri. Data pribadi Anda hanya digunakan untuk keperluan verifikasi dan tidak akan dibagikan kepada pihak ketiga tanpa izin Anda.",
  },
  {
    question: "Kenapa kami memerlukan NIK?",
    answer:
      "NIK (Nomor Induk Kependudukan) diperlukan untuk memverifikasi identitas Anda secara unik dan memastikan bahwa setiap akun terhubung dengan individu yang valid. Ini membantu kami mencegah duplikasi akun dan menjaga integritas data.",
  },
  {
    question: "Apa manfaat dari aplikasi ini?",
    answer:
      "Aplikasi ini memberikan kemudahan bagi Anda untuk melakukan check-in dan check-out acara dengan cepat menggunakan QR code, melihat riwayat kehadiran, dan mendapatkan informasi terbaru seputar kegiatan gereja. Tujuannya adalah untuk meningkatkan efisiensi administrasi dan keterlibatan jemaat.",
  },
];

export default function FAQPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl mb-2 text-primary">Pertanyaan Umum (FAQ)</h1>
        <p className="text-muted-foreground max-w-2xl">
          Temukan jawaban untuk pertanyaan yang sering diajukan di sini.
        </p>
      </header>
      <Accordion type="single" collapsible className="w-full max-w-3xl">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
