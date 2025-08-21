
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
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SupportTicket, TicketStatus } from "@/lib/api/types";
import { getAllSupportTickets, updateSupportTicket, deleteTickets as apiDeleteTickets } from "@/lib/repository_mock/tickets";
import { Search, Loader2, Save, AlertTriangle, Send, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

const ITEMS_PER_PAGE = 8;

function TicketDetailDialog({
  ticket,
  isOpen,
  onOpenChange,
  onUpdate
}: {
  ticket: SupportTicket | null,
  isOpen: boolean,
  onOpenChange: (open: boolean) => void,
  onUpdate: (ticketId: string, updateData: { status: TicketStatus; response?: string; resolvedBy?: string }) => void
}) {
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<TicketStatus>("Proses");
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const canEdit = user?.permissions?.tickets?.includes("edit");

  useEffect(() => {
    if (ticket) {
      setResponse(ticket.response || "");
      setStatus(ticket.status);
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleSubmit = async () => {
    if (!response && (status === "Selesai" || status === "Ditolak")) {
      toast({
        variant: "destructive",
        title: "Tanggapan Diperlukan",
        description: `Status "${status}" memerlukan tanggapan untuk dikirim ke pengguna.`,
      });
      setConfirmOpen(false);
      return;
    }

    setIsSaving(true);
    try {
      const updateData = {
        status,
        response,
        resolvedBy: user?.name || "Admin",
      };
      await updateSupportTicket(ticket.id, updateData);
      onUpdate(ticket.id, updateData);
      toast({
        title: "Tiket Diperbarui!",
        description: `Status tiket ${ticket.id} telah diubah menjadi "${status}".`,
      });
      onOpenChange(false);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Gagal Memperbarui",
        description: "Terjadi kesalahan saat menyimpan perubahan.",
      });
    } finally {
      setIsSaving(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Tiket: {ticket.id}</DialogTitle>
            <DialogDescription>
              Dari: {ticket.userName} ({ticket.phoneNumber})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-4">
            <div className="space-y-2">
              <Label>Deskripsi Masalah</Label>
              <div className="p-4 bg-secondary/50 rounded-lg whitespace-pre-wrap">
                <p className="text-foreground">{ticket.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="response">Tanggapan Admin</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Textarea
                        id="response"
                        placeholder={!canEdit ? "Anda tidak memiliki izin untuk menanggapi." : "Tulis tanggapan untuk pengguna di sini..."}
                        rows={5}
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                  </TooltipTrigger>
                  {!canEdit && (
                    <TooltipContent>
                      <p>Anda perlu memiliki akses 'edit' untuk fitur ini.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Ubah Status Tiket</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="w-[180px]">
                        <Select value={status} onValueChange={(value) => setStatus(value as TicketStatus)} disabled={!canEdit}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Proses">Proses</SelectItem>
                            <SelectItem value="Selesai">Selesai</SelectItem>
                            <SelectItem value="Ditolak">Ditolak</SelectItem>
                          </SelectContent>
                        </Select>
                     </div>
                  </TooltipTrigger>
                   {!canEdit && (
                    <TooltipContent>
                       <p>Anda perlu memiliki akses 'edit' untuk fitur ini.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
            {canEdit && (
                <Button type="button" onClick={() => setConfirmOpen(true)}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
                </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isConfirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-primary"/>Konfirmasi Perubahan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menyimpan perubahan pada tiket ini? Status akan diubah menjadi <strong>{status}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
              {isSaving ? "Menyimpan..." : "Lanjutkan & Simpan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


function TicketTable({ 
  tickets, 
  isLoading,
  onRowClick,
  showCheckboxes,
  selectedIds,
  onSelectionChange
}: { 
  tickets: SupportTicket[], 
  isLoading: boolean,
  onRowClick: (ticket: SupportTicket) => void,
  showCheckboxes?: boolean,
  selectedIds?: Set<string>,
  onSelectionChange?: (id: string, checked: boolean) => void
}) {

  const handleSelectAll = (checked: boolean) => {
    tickets.forEach(ticket => onSelectionChange?.(ticket.id, checked));
  }

  const allSelected = showCheckboxes && tickets.length > 0 && tickets.every(t => selectedIds?.has(t.id));
  
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {showCheckboxes && (
                <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                      aria-label="Pilih semua"
                    />
                </TableHead>
            )}
            <TableHead className="w-[180px]">ID Tiket</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>No. Telepon</TableHead>
            <TableHead>Deskripsi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                 {showCheckboxes && <TableCell><Skeleton className="h-5 w-5" /></TableCell>}
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
              </TableRow>
            ))
          ) : tickets.length > 0 ? (
            tickets.map(ticket => (
              <TableRow key={ticket.id} onClick={() => onRowClick(ticket)} className="cursor-pointer">
                 {showCheckboxes && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                            checked={selectedIds?.has(ticket.id)}
                            onCheckedChange={(checked) => onSelectionChange?.(ticket.id, !!checked)}
                            aria-label={`Pilih tiket ${ticket.id}`}
                        />
                    </TableCell>
                )}
                <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                <TableCell className="font-medium">{ticket.userName}</TableCell>
                <TableCell>{ticket.phoneNumber}</TableCell>
                <TableCell>
                  <p className="max-w-xs truncate">{ticket.description}</p>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={showCheckboxes ? 5 : 4} className="text-center h-24 text-muted-foreground">
                Tidak ada tiket dalam kategori ini.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


export default function TicketsManagementPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const canDelete = user?.permissions?.tickets?.includes("delete");

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
  
  const handleSelectionChange = (id: string, checked: boolean) => {
    setSelectedIds(prev => {
        const newSet = new Set(prev);
        if (checked) {
            newSet.add(id);
        } else {
            newSet.delete(id);
        }
        return newSet;
    });
  };
  
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    setIsDeleting(true);
    try {
        await apiDeleteTickets(Array.from(selectedIds));
        setTickets(prev => prev.filter(t => !selectedIds.has(t.id)));
        toast({
            variant: "destructive",
            title: "Berhasil Dihapus",
            description: `${selectedIds.size} tiket telah dihapus.`
        });
        setSelectedIds(new Set());
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Gagal Menghapus",
            description: "Terjadi kesalahan saat menghapus tiket."
        });
    } finally {
        setIsDeleting(false);
        setDeleteConfirmOpen(false);
    }
  }


  const handleUpdateTicket = (ticketId: string, updateData: Partial<SupportTicket>) => {
    setTickets(prevTickets => prevTickets.map(t => t.id === ticketId ? { ...t, ...updateData } : t));
  };
  
  const filteredTickets = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return tickets.filter(ticket =>
      ticket.id.toLowerCase().includes(lowercasedSearchTerm) ||
      ticket.userName.toLowerCase().includes(lowercasedSearchTerm) ||
      ticket.phoneNumber.includes(lowercasedSearchTerm)
    );
  }, [tickets, searchTerm]);

  const ticketsByStatus = useMemo(() => {
    return {
      proses: filteredTickets.filter(t => t.status === 'Proses'),
      selesai: filteredTickets.filter(t => t.status === 'Selesai'),
      ditolak: filteredTickets.filter(t => t.status === 'Ditolak'),
    }
  }, [filteredTickets]);


  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="font-headline text-4xl mb-2 text-primary">Kelola Tiket Dukungan</h1>
          <p className="text-muted-foreground max-w-2xl">
            Tinjau, kelola, dan tanggapi tiket dukungan yang masuk dari pengguna. Tiket yang sudah selesai akan otomatis terhapus setelah 3 hari.
          </p>
        </header>
        
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan ID, Nama, atau No. Telepon..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          {canDelete && selectedIds.size > 0 && (
            <Button variant="destructive" onClick={() => setDeleteConfirmOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus ({selectedIds.size})
            </Button>
          )}
        </div>

        <Tabs defaultValue="proses" className="w-full" onValueChange={() => setSelectedIds(new Set())}>
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="proses">
              Proses <Badge variant="secondary" className="ml-2">{ticketsByStatus.proses.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="selesai">
              Selesai <Badge variant="secondary" className="ml-2">{ticketsByStatus.selesai.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="ditolak">
              Ditolak <Badge variant="secondary" className="ml-2">{ticketsByStatus.ditolak.length}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="proses">
            <TicketTable tickets={ticketsByStatus.proses} isLoading={isLoading} onRowClick={setSelectedTicket} />
          </TabsContent>
          <TabsContent value="selesai">
            <TicketTable 
              tickets={ticketsByStatus.selesai} 
              isLoading={isLoading} 
              onRowClick={setSelectedTicket} 
              showCheckboxes={canDelete}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
            />
          </TabsContent>
          <TabsContent value="ditolak">
            <TicketTable 
              tickets={ticketsByStatus.ditolak} 
              isLoading={isLoading} 
              onRowClick={setSelectedTicket} 
              showCheckboxes={canDelete}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
            />
          </TabsContent>
        </Tabs>

      </div>
      <TicketDetailDialog
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onOpenChange={(open) => { if(!open) setSelectedTicket(null) }}
        onUpdate={handleUpdateTicket}
      />
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                  <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus {selectedIds.size} tiket yang dipilih? Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteSelected} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                      {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isDeleting ? "Menghapus..." : "Lanjutkan & Hapus"}
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
