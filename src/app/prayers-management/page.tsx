
"use client";

import React, { useState, useMemo, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, User, MessageSquarePlus, CheckCircle, Loader2, Edit, Save, AlertTriangle } from "lucide-react";
import type { PrayerRequest } from "@/lib/api/types";
import { getPrayerRequests, respondToPrayerRequest } from "@/lib/repository_mock/prayers";

const ITEMS_PER_PAGE = 6;

function PrayerRequestDialog({ 
  prayer, 
  isOpen, 
  onOpenChange, 
  onRespond 
}: { 
  prayer: PrayerRequest | null, 
  isOpen: boolean, 
  onOpenChange: (open: boolean) => void,
  onRespond: (prayerId: string, response: string, responder: string) => void
}) {
  const { toast } = useToast();
  const [response, setResponse] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (prayer) {
      setResponse(prayer.responseText || "");
      setIsEditing(!prayer.isResponded);
    } else {
      setResponse("");
      setIsEditing(false);
    }
  }, [prayer]);

  const handleConfirmSubmit = async () => {
    if (!response.trim() || !prayer) {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Tanggapan doa tidak boleh kosong.",
      });
      return;
    }
    setIsSending(true);
    try {
      await respondToPrayerRequest(prayer.id, response, "Tubagus Rifan"); // Hardcoded user for now
      onRespond(prayer.id, response, "Tubagus Rifan");
      toast({
        title: "Doa Terkirim",
        description: "Doa dukungan Anda telah berhasil dikirim.",
      });
      setIsEditing(false);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Gagal mengirim tanggapan. Coba lagi nanti.",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  if (!prayer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!isSending) onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pokok Doa dari {prayer.isAnonymous ? "Jemaat Anonim" : prayer.userName}</DialogTitle>
          <DialogDescription>
            Dikirim pada {new Date(prayer.submittedDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-4">
          <div className="p-4 bg-secondary/50 rounded-lg whitespace-pre-wrap">
            <p className="text-foreground">{prayer.requestText}</p>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="prayer-response" className="font-semibold text-primary">Tanggapan Doa</Label>
            
            {isEditing ? (
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <Textarea
                  id="prayer-response"
                  placeholder={`Tuliskan doa atau kata-kata penyemangat untuk ${prayer.isAnonymous ? "jemaat ini" : prayer.userName}...`}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={5}
                  disabled={isSending}
                  className="bg-card"
                />
                 <div className="flex justify-end gap-2">
                  {prayer.isResponded && (
                     <Button type="button" variant="secondary" onClick={() => setIsEditing(false)} disabled={isSending}>Batal</Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button type="submit" disabled={isSending || !response.trim()}>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Doa
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                       <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                           <AlertTriangle className="text-primary"/> Konfirmasi Tanggapan Doa
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin mengirimkan tanggapan doa ini? Pesan akan terlihat oleh jemaat.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSending}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSubmit} disabled={isSending}>
                           {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                           {isSending ? "Mengirim..." : "Lanjutkan & Kirim"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                 <p className="text-green-900 whitespace-pre-wrap">{prayer.responseText}</p>
                 <div className="text-xs text-green-700">Didoakan oleh {prayer.lastResponseBy}</div>
                 <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Doa
                    </Button>
                 </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isSending}>Tutup</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PrayersManagementPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'responded', 'unresponded'
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadPrayers() {
      setIsLoading(true);
      try {
        const data = await getPrayerRequests();
        setRequests(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Gagal Memuat Data",
          description: "Tidak dapat memuat data pokok doa. Coba lagi nanti.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadPrayers();
  }, [toast]);

  const handleRespond = (prayerId: string, responseText: string, responderName: string) => {
    const updatedRequest = { 
        isResponded: true, 
        lastResponseBy: responderName,
        responseText: responseText
    };

    setRequests(prev => prev.map(req => 
      req.id === prayerId 
        ? { ...req, ...updatedRequest } 
        : req
    ));
    if (selectedPrayer?.id === prayerId) {
      setSelectedPrayer(prev => prev ? {...prev, ...updatedRequest} : null);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests
      .filter(req => 
        req.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        req.requestText.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(req => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'responded') return req.isResponded;
        if (filterStatus === 'unresponded') return !req.isResponded;
        return true;
      });
  }, [requests, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    startTransition(() => {
        setCurrentPage(newPage);
    });
  };
  
  const handleCardClick = (prayer: PrayerRequest) => {
    setSelectedPrayer(prayer);
    setIsDialogOpen(true);
  };

  const getInitials = (name: string) => {
    if (name === "Anonim") return "A";
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="font-headline text-4xl mb-2 text-primary">Tinjau Pokok Doa</h1>
          <p className="text-muted-foreground max-w-2xl">
            Lihat dan berikan dukungan doa untuk setiap permohonan yang masuk dari jemaat.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative flex-grow w-full sm:max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
                placeholder="Cari nama atau isi doa..."
                value={searchTerm}
                onChange={e => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                className="pl-9 bg-card"
            />
          </div>
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-card">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="responded">Sudah Didoakan</SelectItem>
              <SelectItem value="unresponded">Menunggu Doa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(isLoading || isPending) ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <Card key={`skeleton-${index}`}>
                <CardHeader className="flex flex-row items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter className="flex justify-between items-center gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-36" />
                </CardFooter>
              </Card>
            ))
          ) : paginatedRequests.length > 0 ? (
            paginatedRequests.map(req => (
              <Card 
                key={req.id} 
                onClick={() => handleCardClick(req)} 
                className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all flex flex-col"
              >
                <CardHeader className="flex flex-row items-center gap-3">
                   <Avatar>
                       <AvatarImage src={req.avatarUrl} alt={req.userName} data-ai-hint="person" />
                       <AvatarFallback>{getInitials(req.userName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <CardTitle className="text-base">{req.userName}</CardTitle>
                      {req.isAnonymous && <CardDescription className="text-xs">Anonim</CardDescription>}
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{req.requestText}</p>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-between items-center gap-2 pt-4">
                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(req.submittedDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  {req.isResponded ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1.5" />
                          Didoakan oleh {req.lastResponseBy}
                      </Badge>
                  ) : (
                      <Badge variant="secondary" className="text-xs">
                          <MessageSquarePlus className="h-3 w-3 mr-1.5" />
                          Menunggu Doa
                      </Badge>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-24">
              <p className="text-muted-foreground">Tidak ada pokok doa yang cocok dengan filter.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <span className="text-sm text-muted-foreground">
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading || isPending}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading || isPending}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </div>
      <PrayerRequestDialog 
        prayer={selectedPrayer} 
        isOpen={isDialogOpen} 
        onOpenChange={(open) => {
            if (!open) {
                setTimeout(() => setSelectedPrayer(null), 300);
            }
            setIsDialogOpen(open);
        }} 
        onRespond={handleRespond}
      />
    </>
  );
}
