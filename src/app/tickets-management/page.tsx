
"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { SupportTicket } from "@/lib/api/types";
import { getAllSupportTickets } from "@/lib/repository_mock/tickets";
import { Search } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function TicketsManagementPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function loadTickets() {
      setIsLoading(true);
      try {
        const data = await getAllSupportTickets();
        setTickets(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Gagal Memuat Tiket",
          description: "Tidak dapat memuat data tiket dukungan.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadTickets();
  }, [toast]);

  const filteredTickets = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return tickets.filter(ticket =>
      ticket.id.toLowerCase().includes(lowercasedSearchTerm) ||
      ticket.userName.toLowerCase().includes(lowercasedSearchTerm) ||
      ticket.phoneNumber.includes(lowercasedSearchTerm)
    );
  }, [tickets, searchTerm]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    startTransition(() => {
      setCurrentPage(newPage);
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl mb-2 text-primary">Kelola Tiket Dukungan</h1>
        <p className="text-muted-foreground max-w-2xl">
          Tinjau, kelola, dan tanggapi tiket dukungan yang masuk dari pengguna.
        </p>
      </header>
      
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan ID Tiket, Nama, atau No. Telepon..."
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
              <TableHead>ID Tiket</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>No. Telepon</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isLoading || isPending) ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                </TableRow>
              ))
            ) : paginatedTickets.length > 0 ? (
              paginatedTickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                  <TableCell className="font-medium">{ticket.userName}</TableCell>
                  <TableCell>{ticket.phoneNumber}</TableCell>
                  <TableCell>
                    <p className="max-w-xs truncate">{ticket.description}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={ticket.isResolved ? "default" : "secondary"}>
                      {ticket.isResolved ? "Selesai" : "Dalam Proses"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  Tidak ada tiket yang cocok dengan pencarian Anda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
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
  );
}
