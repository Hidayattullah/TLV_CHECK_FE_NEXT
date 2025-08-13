
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Heart, MessageSquare } from "lucide-react";

type Prayer = {
  id: string;
  name: string;
  request: string;
  response?: string;
  responderName?: string;
  date: string;
};

const initialPrayers: Prayer[] = [
    {
        id: "1",
        name: "Maria S.",
        request: "Mohon doakan untuk kesembuhan ibu saya yang sedang sakit keras. Kiranya Tuhan memberikan kekuatan dan pemulihan.",
        response: "Kami berdoa untuk ibu Maria, agar Tuhan Yesus memberikan kekuatan dan jamahan kesembuhan. Tetap kuat dalam iman. Tuhan memberkati.",
        responderName: "Admin Gereja",
        date: "2024-08-01"
    },
    {
        id: "2",
        name: "Anonim",
        request: "Pergumulan dalam pekerjaan. Saya merasa tidak memiliki harapan dan stres. Mohon dukungan doa agar saya menemukan jalan keluar.",
        response: "Tuhan adalah sumber kekuatan dan pengharapan. Kami berdoa agar Anda diberikan hikmat dan jalan keluar dalam setiap tantangan pekerjaan. Jangan pernah menyerah. Filipi 4:13.",
        responderName: "Admin Gereja",
        date: "2024-07-30"
    }
];


export default function PrayerSupportPage() {
  const [name, setName] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [submittedPrayers, setSubmittedPrayers] = useState<Prayer[]>(initialPrayers);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerRequest.trim()) {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Permohonan doa tidak boleh kosong.",
      });
      return;
    }

    const newPrayer: Prayer = {
        id: `prayer-${Date.now()}`,
        name: name || "Anonim",
        request: prayerRequest,
        date: new Date().toISOString().split("T")[0],
    };

    setSubmittedPrayers(prev => [newPrayer, ...prev]);

    toast({
      title: "Permohonan Terkirim",
      description: "Permohonan doa Anda telah berhasil dikirim. Tuhan memberkati.",
    });

    // Reset form
    setName("");
    setPrayerRequest("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl mb-2 text-primary">Mari Saling Mendoakan</h1>
        <p className="text-muted-foreground max-w-2xl">
          Jika Anda memiliki pergumulan atau permohonan doa, jangan ragu untuk membagikannya di sini. Tim doa kami siap mendukung Anda dalam doa.
        </p>
      </header>

      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Formulir Permohonan Doa</CardTitle>
            <CardDescription>Semua permohonan akan dijaga kerahasiaannya.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama (Opsional)</Label>
                <Input
                  id="name"
                  placeholder="Anda bisa menggunakan 'Anonim'"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prayer-request">Permohonan Doa</Label>
                <Textarea
                  id="prayer-request"
                  placeholder="Tuliskan permohonan doa Anda di sini..."
                  value={prayerRequest}
                  onChange={(e) => setPrayerRequest(e.target.value)}
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Kirim Permohonan Doa
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Separator />
        
        <div>
            <h2 className="text-2xl font-headline text-primary mb-4 text-center">Dinding Doa Komunitas</h2>
            <div className="space-y-6">
                {submittedPrayers.map((prayer) => (
                    <Card key={prayer.id} className="overflow-hidden">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Heart className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{prayer.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(prayer.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{prayer.request}</p>
                        </CardContent>
                        {prayer.response && (
                           <>
                            <Separator className="my-4" />
                            <CardFooter className="flex flex-col items-start bg-green-50/50 p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <CheckCircle className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-green-900">Tanggapan Doa dari {prayer.responderName}</h3>
                                        <p className="text-xs text-green-700">Telah didoakan</p>
                                    </div>
                                </div>
                                <p className="text-green-800/80 text-sm">{prayer.response}</p>
                            </CardFooter>
                           </>
                        )}
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
