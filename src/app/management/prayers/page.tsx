
"use client";

import React, { useState, useMemo, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type PrayerRequest = {
  id: string;
  userName: string;
  avatarUrl?: string;
  requestText: string;
  submittedDate: string;
  isAnonymous: boolean;
};

const mockPrayers: PrayerRequest[] = [
  { id: "p1", userName: "Maria S.", requestText: "Mohon doakan untuk kesembuhan ibu saya yang sedang sakit keras. Kiranya Tuhan memberikan kekuatan dan pemulihan.", submittedDate: "2024-08-01", isAnonymous: false },
  { id: "p2", userName: "Anonim", requestText: "Pergumulan dalam pekerjaan. Saya merasa tidak memiliki harapan dan stres. Mohon dukungan doa agar saya menemukan jalan keluar.", submittedDate: "2024-08-01", isAnonymous: true },
  { id: "p3", userName: "Yohanes P.", avatarUrl: "/avatars/yohanes.png", requestText: "Doakan untuk kelancaran studi anak saya yang akan menghadapi ujian akhir. Semoga diberikan hikmat dan ketenangan.", submittedDate: "2024-07-31", isAnonymous: false },
  { id: "p4", userName: "Keluarga Smith", requestText: "Kami sekeluarga sedang mengalami kesulitan finansial. Mohon doakan agar Tuhan membuka jalan dan mencukupkan segala kebutuhan kami.", submittedDate: "2024-07-30", isAnonymous: false },
  { id: "p5", userName: "Anonim", requestText: "Saya sedang berjuang melawan kecanduan. Mohon doa agar saya diberikan kekuatan untuk lepas dari jerat ini.", submittedDate: "2024-07-30", isAnonymous: true },
  { id: "p6", userName: "Grace L.", avatarUrl: "/avatars/grace.png", requestText: "Mengucap syukur atas pekerjaan baru yang Tuhan berikan. Mohon doakan agar saya bisa menjadi berkat di tempat kerja yang baru.", submittedDate: "2024-07-29", isAnonymous: false },
  { id: "p7", userName: "David K.", requestText: "Mohon doakan untuk pelayanan kaum muda di gereja kami, agar semakin bertumbuh dan berdampak bagi banyak orang.", submittedDate: "2024-07-28", isAnonymous: false },
  { id: "p8", userName: "Anonim", requestText: "Pergumulan dalam hubungan rumah tangga. Kiranya Tuhan memulihkan dan memberikan kedamaian.", submittedDate: "2024-07-27", isAnonymous: true },
];

const ITEMS_PER_PAGE = 5;

function PrayerRequestDialog({ prayer, isOpen, onOpenChange }: { prayer: PrayerRequest | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const [response, setResponse] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Tanggapan doa tidak boleh kosong.",
      });
      return;
    }
    console.log(`Response for ${prayer?.id}:`, response);
    toast({
      title: "Doa Terkirim",
      description: "Doa dukungan Anda telah berhasil dikirim.",
    });
    setResponse("");
    onOpenChange(false);
  };
  
  if (!prayer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prayer-response" className="font-semibold text-primary">Tulis Doa Dukungan Anda</Label>
              <Textarea
                id="prayer-response"
                placeholder={`Tuliskan doa atau kata-kata penyemangat untuk ${prayer.isAnonymous ? "jemaat ini" : prayer.userName}...`}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={5}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Tutup</Button>
              </DialogClose>
              <Button type="submit">Kirim Doa</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PrayersManagementPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>(mockPrayers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => 
      req.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      req.requestText.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [requests, searchTerm]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setIsLoading(true);
    setTimeout(() => {
      startTransition(() => {
        setCurrentPage(newPage);
        setIsLoading(false);
      });
    }, 300);
  };
  
  const handleRowClick = (prayer: PrayerRequest) => {
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

        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="relative flex-grow max-w-sm">
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
        </div>
        
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengirim</TableHead>
                <TableHead>Pokok Doa</TableHead>
                <TableHead className="text-right">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isLoading || isPending) ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-24" /></div></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedRequests.length > 0 ? (
                paginatedRequests.map(req => (
                  <TableRow key={req.id} onClick={() => handleRowClick(req)} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                           <AvatarImage src={req.avatarUrl} alt={req.userName} />
                           <AvatarFallback>{getInitials(req.userName)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{req.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="truncate max-w-sm text-muted-foreground">{req.requestText}</p>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(req.submittedDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Tidak ada pokok doa yang cocok dengan pencarian.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
      />
    </>
  );
}
