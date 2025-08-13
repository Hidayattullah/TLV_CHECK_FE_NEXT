
"use client";

import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import type { Question } from "@/lib/api/types";
import { getQuestions, addQuestion } from "@/lib/repository_mock/questions";
import { Loader2 } from "lucide-react";

const staticFaqs = [
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
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const currentUserName = "Tubagus Rifan"; // Hardcoded for now

  useEffect(() => {
    async function fetchUserQuestions() {
      setIsLoading(true);
      try {
        const allQuestions = await getQuestions();
        // Filter questions for the current user
        const filteredQuestions = allQuestions.filter(q => q.userName === currentUserName);
        setUserQuestions(filteredQuestions.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Gagal Memuat Pertanyaan",
          description: "Gagal memuat riwayat pertanyaan Anda."
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserQuestions();
  }, [toast]);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setIsSubmitting(true);
    try {
      const newQuestionData = {
        userName: currentUserName,
        avatarUrl: "", // Assuming current user has no avatar or it can be fetched elsewhere
        questionText: newQuestion
      };
      const addedQuestion = await addQuestion(newQuestionData);
      setUserQuestions(prev => [addedQuestion, ...prev]);
      setNewQuestion("");
      toast({
        title: "Pertanyaan Terkirim",
        description: "Pertanyaan Anda telah berhasil dikirim. Admin akan segera menjawabnya.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Gagal mengirim pertanyaan Anda. Coba lagi nanti.",
      });
    } finally {
      setIsSubmitting(false);
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
          {staticFaqs.map((faq, index) => (
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
                className="bg-secondary border-0"
                rows={4}
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={!newQuestion.trim() || isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Mengirim..." : "Kirim Pertanyaan"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading || userQuestions.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-headline text-primary">Riwayat Pertanyaan Anda</h2>
            <Accordion type="single" collapsible className="w-full">
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground">Memuat pertanyaan...</div>
              ) : (
                 userQuestions.map((faq, index) => (
                  <AccordionItem value={`user-item-${index}`} key={faq.id}>
                    <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                      {faq.questionText}
                    </AccordionTrigger>
                    <AccordionContent className="text-base">
                      {faq.isResponded ? (
                        <>
                          <p className="text-primary font-semibold mb-2">Jawaban Admin:</p>
                          <p className="text-muted-foreground">{faq.responseText}</p>
                        </>
                      ) : (
                        <p className="text-muted-foreground">Menunggu jawaban dari admin...</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))
              )}
            </Accordion>
          </div>
        ) : null}
      </div>
    </div>
  );
}
