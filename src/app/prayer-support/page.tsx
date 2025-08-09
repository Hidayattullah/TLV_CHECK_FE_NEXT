
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function PrayerSupportPage() {
  const [name, setName] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
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

    // Here you would typically send the data to your backend.
    console.log({
      name: name || "Anonim",
      prayerRequest,
    });

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

      <Card className="max-w-2xl mx-auto">
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
    </div>
  );
}
