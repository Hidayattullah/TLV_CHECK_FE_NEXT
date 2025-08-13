
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Heart, Loader2 } from "lucide-react";
import type { PrayerRequest } from "@/lib/api/types";
import { getPrayerRequests, addPrayerRequest } from "@/lib/repository_mock/prayers";
import { Skeleton } from "@/components/ui/skeleton";

const CURRENT_USER_NAME = "Tubagus Rifan"; // Hardcoded for mock purposes

export default function PrayerSupportPage() {
  const [name, setName] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [myPrayers, setMyPrayers] = useState<PrayerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchMyPrayers() {
      setIsLoading(true);
      try {
        const allPrayers = await getPrayerRequests();
        const filteredPrayers = allPrayers.filter(p => p.userName === CURRENT_USER_NAME || (p.isAnonymous && p.submittedBy === CURRENT_USER_NAME));
        setMyPrayers(filteredPrayers.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Gagal Memuat Doa",
          description: "Gagal memuat riwayat doa Anda.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyPrayers();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerRequest.trim()) {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Permohonan doa tidak boleh kosong.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newPrayerData = {
        userName: name || "Anonim",
        requestText: prayerRequest,
        isAnonymous: !name,
        submittedBy: CURRENT_USER_NAME, // Hidden field to track owner of anonymous prayer
        avatarUrl: "" // Assuming no avatar for simplicity here
      };

      const addedPrayer = await addPrayerRequest(newPrayerData);
      setMyPrayers(prev => [addedPrayer, ...prev]);

      toast({
        title: "Permohonan Terkirim",
        description: "Permohonan doa Anda telah berhasil dikirim. Tuhan memberkati.",
      });

      // Reset form
      setName("");
      setPrayerRequest("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Gagal mengirim permohonan doa Anda. Coba lagi nanti.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={!prayerRequest.trim() || isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Mengirim..." : "Kirim Permohonan Doa"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {isLoading || myPrayers.length > 0 ? (
          <>
            <Separator />
            
            <div>
                <h2 className="text-2xl font-headline text-primary mb-4 text-center">Riwayat Permohonan Doa Anda</h2>
                <div className="space-y-6">
                    {isLoading ? (
                      Array.from({length: 2}).map((_, i) => (
                        <Card key={i}>
                          <CardHeader><Skeleton className="h-6 w-1/2"/></CardHeader>
                          <CardContent><Skeleton className="h-10 w-full"/></CardContent>
                        </Card>
                      ))
                    ) : myPrayers.map((prayer) => (
                        <Card key={prayer.id} className="overflow-hidden">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Heart className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{prayer.userName}</CardTitle>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(prayer.submittedDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{prayer.requestText}</p>
                            </CardContent>
                            {prayer.isResponded && prayer.responseText && (
                               <>
                                <Separator className="my-4" />
                                <CardFooter className="flex flex-col items-start bg-green-50/50 p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <CheckCircle className="h-5 w-5 text-green-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-green-900">Tanggapan Doa dari {prayer.lastResponseBy}</h3>
                                            <p className="text-xs text-green-700">Telah didoakan</p>
                                        </div>
                                    </div>
                                    <p className="text-green-800/80 text-sm">{prayer.responseText}</p>
                                </CardFooter>
                               </>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
