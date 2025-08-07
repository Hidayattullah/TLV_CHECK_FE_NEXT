
"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const initialFaqs = [
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
  const [faqs, setFaqs] = useState(initialFaqs);
  const [newQuestion, setNewQuestion] = useState("");

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      setFaqs([
        ...faqs,
        {
          question: newQuestion,
          answer: "Menunggu jawaban dari admin...",
        },
      ]);
      setNewQuestion("");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl mb-2 text-primary">Pertanyaan Umum (FAQ)</h1>
        <p className="text-muted-foreground max-w-2xl">
          Temukan jawaban untuk pertanyaan yang sering diajukan di sini. Jika Anda memiliki pertanyaan lain, jangan ragu untuk bertanya.
        </p>
      </header>
      
      <div className="max-w-3xl mx-auto space-y-8">
        <Accordion type="single" collapsible className="w-full">
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

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Punya Pertanyaan Lain?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <Textarea
                placeholder="Tuliskan pertanyaan Anda di sini..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="bg-accent/50 border-0"
                rows={4}
              />
              <Button type="submit" disabled={!newQuestion.trim()}>
                Kirim Pertanyaan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
