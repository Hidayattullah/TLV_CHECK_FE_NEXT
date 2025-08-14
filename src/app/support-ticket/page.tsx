
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Loader2, Search, Ticket, XCircle, Copy } from "lucide-react";
import type { SupportTicket } from "@/lib/api/types";
import { createSupportTicket, getSupportTicketById } from "@/lib/repository_mock/tickets";
import { Badge } from "@/components/ui/badge";


const formSchema = z.object({
  userName: z.string().min(1, { message: "Nama tidak boleh kosong." }),
  phoneNumber: z.string().min(1, { message: "Nomor telepon tidak boleh kosong." }),
  description: z.string().min(10, { message: "Deskripsi harus minimal 10 karakter." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SupportTicketPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);
  const [searchedTicket, setSearchedTicket] = useState<SupportTicket | null | 'not_found'>(null);
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { userName: "", phoneNumber: "", description: "" },
  });

  const onFormSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const newTicket = await createSupportTicket(values);
      setSubmittedTicket(newTicket);
      form.reset();
      toast({
        title: "Tiket Berhasil Dibuat!",
        description: "Tim kami akan segera meninjau permintaan Anda.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal Membuat Tiket",
        description: "Terjadi kesalahan. Coba lagi nanti.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setIsSearching(true);
    setSearchedTicket(null);
    try {
      const result = await getSupportTicketById(searchId.trim());
      setSearchedTicket(result || 'not_found');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal Mencari Tiket",
        description: "Terjadi kesalahan saat mencari tiket.",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil Disalin!",
      description: "ID Tiket telah disalin ke clipboard.",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl mb-2 text-primary">Dukungan Akun</h1>
        <p className="text-muted-foreground max-w-2xl">
          Jika akun Anda nonaktif atau mengalami masalah lain, silakan buat tiket dukungan di bawah ini.
        </p>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Buat Tiket Baru</CardTitle>
            <CardDescription>Isi formulir di bawah ini untuk mengirimkan permintaan bantuan.</CardDescription>
          </CardHeader>
          <CardContent>
            {submittedTicket ? (
              <Alert variant="default" className="border-success text-success-foreground">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle className="font-bold">Tiket Anda Telah Dibuat!</AlertTitle>
                <AlertDescription>
                  <p>Harap simpan ID Tiket Anda untuk memeriksa status.</p>
                  <div className="font-mono text-lg font-bold my-2 bg-secondary p-2 rounded flex items-center justify-between">
                    <span>{submittedTicket.id}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => handleCopy(submittedTicket.id)}
                    >
                      <Copy className="h-4 w-4"/>
                      <span className="sr-only">Salin ID Tiket</span>
                    </Button>
                  </div>
                  <Button size="sm" onClick={() => setSubmittedTicket(null)}>Buat Tiket Lain</Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
                  <FormField control={form.control} name="userName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl><Input placeholder="Masukkan nama Anda" {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon Terdaftar</FormLabel>
                        <FormControl><Input placeholder="Masukkan nomor telepon" {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Masalah</FormLabel>
                        <FormControl><Textarea placeholder="Jelaskan masalah Anda..." rows={4} {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Mengirim..." : "Kirim Tiket"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Periksa Status Tiket</CardTitle>
            <CardDescription>Masukkan ID Tiket Anda untuk melihat status dan jawaban dari admin.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearchTicket} className="flex gap-2 mb-4">
              <Input
                placeholder="Masukkan ID Tiket..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                disabled={isSearching}
              />
              <Button type="submit" disabled={isSearching || !searchId.trim()}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4"/>}
              </Button>
            </form>

            <Separator />

            <div className="mt-4">
              {isSearching && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {searchedTicket === 'not_found' && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Tiket Tidak Ditemukan</AlertTitle>
                  <AlertDescription>
                    Pastikan ID Tiket yang Anda masukkan sudah benar.
                  </AlertDescription>
                </Alert>
              )}
              {searchedTicket && searchedTicket !== 'not_found' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><Ticket className="text-primary"/>Status Tiket</h3>
                     <Badge variant={searchedTicket.isResolved ? "default" : "secondary"}>
                       {searchedTicket.isResolved ? "Selesai" : "Dalam Proses"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">ID Tiket</p>
                    <p className="font-mono">{searchedTicket.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Deskripsi Anda</p>
                    <p className="p-3 bg-secondary/50 rounded-md">{searchedTicket.description}</p>
                  </div>
                  {searchedTicket.isResolved && searchedTicket.response && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Jawaban Admin ({searchedTicket.resolvedBy})</p>
                      <p className="p-3 bg-green-50 border border-green-200 text-green-900 rounded-md">{searchedTicket.response}</p>
                    </div>
                  )}
                </div>
              )}
               {!isSearching && !searchedTicket && (
                 <div className="text-center p-8 text-muted-foreground">
                    Hasil pencarian akan muncul di sini.
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
