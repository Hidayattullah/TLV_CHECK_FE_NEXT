
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
  DialogTrigger,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Eye, Loader2, ListChecks, Search } from "lucide-react";

type Attendee = {
  id: string;
  name: string;
  checkinTime: string;
  checkinMethod: "Barcode" | "RFID";
};

type CheckInEvent = {
  id: string;
  eventName: string;
  eventDate: string;
  isActive: boolean;
  attendees: Attendee[];
};

const mockEvents: CheckInEvent[] = [
  {
    id: "evt-001",
    eventName: "Ibadah Raya 1",
    eventDate: "2024-07-28",
    isActive: true,
    attendees: [
      { id: "1", name: "Tubagus Rifan", checkinTime: "09:05", checkinMethod: "Barcode" },
      { id: "4", name: "Sarah Connor", checkinTime: "09:02", checkinMethod: "RFID" },
    ],
  },
  {
    id: "evt-002",
    eventName: "Ibadah Raya 2",
    eventDate: "2024-07-28",
    isActive: true,
    attendees: [
      { id: "2", name: "Jane Doe", checkinTime: "17:02", checkinMethod: "RFID" },
    ],
  },
  {
    id: "evt-003",
    eventName: "Ibadah Dewasa Muda",
    eventDate: "2024-07-27",
    isActive: false,
    attendees: [
      { id: "6", name: "Michael Bay", checkinTime: "18:30", checkinMethod: "Barcode" },
      { id: "3", name: "Admin Gereja", checkinTime: "18:25", checkinMethod: "RFID" },
    ],
  },
  {
    id: "evt-004",
    eventName: "Ibadah Youth",
    eventDate: "2024-07-26",
    isActive: false,
    attendees: [],
  },
];

const ITEMS_PER_PAGE = 5;

function AddEditEventDialog({
  event,
  onSave,
  children,
}: {
  event?: CheckInEvent | null;
  onSave: (data: Omit<CheckInEvent, "id" | "attendees" | "isActive">) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const { toast } = useToast();

  React.useEffect(() => {
    if (event) {
      setEventName(event.eventName);
      setEventDate(event.eventDate);
    } else {
      setEventName("");
      setEventDate("");
    }
  }, [event, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !eventDate) {
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Nama acara dan tanggal tidak boleh kosong.",
      });
      return;
    }
    onSave({ eventName, eventDate });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit Acara" : "Buat Acara Check-in Baru"}</DialogTitle>
          <DialogDescription>
            {event ? "Perbarui detail acara di bawah ini." : "Isi detail untuk membuat acara check-in baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">Nama Acara</Label>
            <Input id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="cth: Ibadah Raya 1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDate">Tanggal Acara</Label>
            <Input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AttendanceListDialog({ event }: { event: CheckInEvent }) {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Daftar Hadir: {event.eventName}</DialogTitle>
          <DialogDescription>
            Jemaat yang telah melakukan check-in pada {new Date(event.eventDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Jemaat</TableHead>
                <TableHead>Waktu Check-in</TableHead>
                <TableHead className="text-right">Metode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.attendees.length > 0 ? (
                event.attendees.map((att) => (
                  <TableRow key={att.id}>
                    <TableCell className="font-medium">{att.name}</TableCell>
                    <TableCell>{att.checkinTime}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={att.checkinMethod === "Barcode" ? "default" : "secondary"}>
                        {att.checkinMethod}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Belum ada jemaat yang check-in.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
           <DialogClose asChild>
              <Button type="button" variant="secondary">Tutup</Button>
           </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function CheckInCreationPage() {
  const [events, setEvents] = useState<CheckInEvent[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CheckInEvent | null>(null);
  const { toast } = useToast();

  const handleSaveEvent = (data: Omit<CheckInEvent, "id" | "attendees" | "isActive">, id?: string) => {
    if (id) {
      // Edit
      setEvents(events.map(e => e.id === id ? { ...e, ...data } : e));
      toast({ title: "Berhasil!", description: "Acara berhasil diperbarui." });
    } else {
      // Add
      const newEvent: CheckInEvent = {
        ...data,
        id: `evt-${Date.now()}`,
        isActive: true,
        attendees: [],
      };
      setEvents([newEvent, ...events]);
      toast({ title: "Berhasil!", description: "Acara baru telah dibuat." });
    }
  };
  
  const confirmDeleteEvent = (event: CheckInEvent) => {
    setEventToDelete(event);
    setDeleteAlertOpen(true);
  };
  
  const handleDeleteEvent = () => {
    if(!eventToDelete) return;

    setEvents(events.filter(e => e.id !== eventToDelete.id));
    toast({ variant: "destructive", title: "Dihapus!", description: `Acara ${eventToDelete.eventName} telah dihapus.` });
    setDeleteAlertOpen(false);
    setEventToDelete(null);
  };


  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

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

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="font-headline text-4xl mb-2 text-primary">Kelola Check-in</h1>
          <p className="text-muted-foreground max-w-2xl">
            Buat, edit, dan pantau acara check-in untuk semua ibadah dan kegiatan gereja.
          </p>
        </header>

        <div className="flex justify-between items-center mb-4 gap-4">
          <div className="relative flex-grow max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
                placeholder="Cari nama acara..."
                value={searchTerm}
                onChange={e => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                className="pl-9 bg-card"
            />
          </div>
          <AddEditEventDialog onSave={(data) => handleSaveEvent(data)}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat Acara
            </Button>
          </AddEditEventDialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Acara</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jemaat Hadir</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedEvents.length > 0 ? (
                paginatedEvents.map(event => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.eventName}</TableCell>
                    <TableCell>{new Date(event.eventDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric'})}</TableCell>
                    <TableCell>
                      <Badge variant={event.isActive ? "default" : "secondary"}>
                        {event.isActive ? 'Aktif' : 'Selesai'}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.attendees.length} jemaat</TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end items-center gap-2">
                        <AttendanceListDialog event={event} />
                        <AddEditEventDialog event={event} onSave={(data) => handleSaveEvent(data, event.id)}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </AddEditEventDialog>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => confirmDeleteEvent(event)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    Tidak ada acara yang cocok.
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
       <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Acara</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus acara <strong>{eventToDelete?.eventName}</strong>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive hover:bg-destructive/90">
                Lanjutkan & Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
