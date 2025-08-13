
"use client";

import React, { useState, useMemo, useTransition, useEffect, useCallback } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Eye, Loader2, ListChecks, Search, Users, Calendar, CheckCircle, XCircle, Settings, Timer, ToggleLeft, ToggleRight, Fingerprint } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";


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
  activationType?: 'manual' | 'timer';
  deactivationTimer?: ReturnType<typeof setTimeout>;
  timerEndsAt?: number;
};

const mockEvents: CheckInEvent[] = [
  {
    id: "evt-001",
    eventName: "Ibadah Raya 1",
    eventDate: "2024-07-28",
    isActive: true,
    activationType: 'manual',
    attendees: [
      { id: "1", name: "Tubagus Rifan", checkinTime: "09:05", checkinMethod: "Barcode" },
      { id: "4", name: "Sarah Connor", checkinTime: "09:02", checkinMethod: "RFID" },
      { id: "user-a", name: "John Doe", checkinTime: "09:03", checkinMethod: "Barcode" },
      { id: "user-b", name: "Peter Parker", checkinTime: "09:04", checkinMethod: "RFID" },
      { id: "user-c", name: "Bruce Wayne", checkinTime: "09:06", checkinMethod: "Barcode" },
      { id: "user-d", name: "Clark Kent", checkinTime: "09:07", checkinMethod: "RFID" },
    ],
  },
  {
    id: "evt-002",
    eventName: "Ibadah Raya 2",
    eventDate: "2024-07-28",
    isActive: true,
    activationType: 'manual',
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

const ITEMS_PER_PAGE = 6;

function AddEditEventDialog({
  event,
  onSave,
  children,
  triggerAsChild
}: {
  event?: CheckInEvent | null;
  onSave: (data: Omit<CheckInEvent, "id" | "attendees" | "isActive">) => void;
  children: React.ReactNode;
  triggerAsChild?: boolean;
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
      <DialogTrigger asChild={triggerAsChild}>{children}</DialogTrigger>
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

function AttendanceListDialog({ event, children, asChild }: { event: CheckInEvent, children: React.ReactNode, asChild?: boolean }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ATTENDEES_PER_PAGE = 5;
  
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setFilterMethod("all");
      setCurrentPage(1);
    }
  }, [open]);
  
  const filteredAttendees = useMemo(() => {
    return event.attendees
      .filter(attendee => 
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(attendee => 
        filterMethod === "all" ? true : attendee.checkinMethod === filterMethod
      );
  }, [event.attendees, searchTerm, filterMethod]);

  const totalPages = Math.ceil(filteredAttendees.length / ATTENDEES_PER_PAGE);

  const paginatedAttendees = useMemo(() => {
    const startIndex = (currentPage - 1) * ATTENDEES_PER_PAGE;
    return filteredAttendees.slice(startIndex, startIndex + ATTENDEES_PER_PAGE);
  }, [filteredAttendees, currentPage]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Daftar Hadir: {event.eventName}</DialogTitle>
          <DialogDescription>
            Jemaat yang telah melakukan check-in pada {new Date(event.eventDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto -mx-6 px-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 pt-2 pb-4 sticky top-0 bg-background z-20">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama jemaat..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={filterMethod}
              onValueChange={(value) => {
                setFilterMethod(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Metode Check-in" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Metode</SelectItem>
                <SelectItem value="Barcode">Barcode</SelectItem>
                <SelectItem value="RFID">RFID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Jemaat</TableHead>
                    <TableHead>Waktu Check-in</TableHead>
                    <TableHead className="text-right">Metode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAttendees.length > 0 ? (
                    paginatedAttendees.map((att) => (
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
                        {searchTerm || filterMethod !== "all" ? "Tidak ada jemaat yang cocok." : "Belum ada jemaat yang check-in."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4 border-t -mx-6 px-6">
           <DialogClose asChild>
              <Button type="button" variant="secondary">Tutup</Button>
           </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusManagementDialog({
  event,
  onStatusChange,
  onTimerSet,
  children,
  triggerAsChild
}: {
  event: CheckInEvent;
  onStatusChange: (eventId: string, isActive: boolean) => void;
  onTimerSet: (eventId: string, hours: number) => void;
  children: React.ReactNode;
  triggerAsChild?: boolean;
}) {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={triggerAsChild}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kelola Status: {event.eventName}</DialogTitle>
          <DialogDescription>
            Atur status keaktifan acara secara manual atau otomatis.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="manual-toggle" className="font-semibold">Status Manual</Label>
              <p className="text-sm text-muted-foreground">Ubah status acara sekarang juga.</p>
            </div>
            <Switch
              id="manual-toggle"
              checked={event.isActive}
              onCheckedChange={(checked) => onStatusChange(event.id, checked)}
            />
          </div>
          <div className="space-y-4 p-4 border rounded-lg">
             <div>
              <Label className="font-semibold">Timer Otomatis</Label>
              <p className="text-sm text-muted-foreground">Atur acara untuk selesai secara otomatis.</p>
            </div>
             <div className="flex gap-2">
              {[1, 2, 3].map((hour) => (
                <Button key={hour} variant="outline" className="w-full" onClick={() => { onTimerSet(event.id, hour); setOpen(false); }}>
                  <Timer className="mr-2 h-4 w-4"/>
                  {hour} Jam
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Tutup</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TimerCountdown({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = endTime - Date.now();
      if (newTimeLeft <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft <= 0) {
    return null;
  }

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Timer className="h-3 w-3" />
      <span>
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
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

  const handleSaveEvent = (data: Omit<CheckInEvent, "id" | "attendees" | "isActive" | "deactivationTimer">, id?: string) => {
    startTransition(() => {
        if (id) {
            setEvents(events.map(e => e.id === id ? { ...e, ...data } : e));
            toast({ title: "Berhasil!", description: "Acara berhasil diperbarui." });
        } else {
            const newEvent: CheckInEvent = {
                ...data,
                id: `evt-${Date.now()}`,
                isActive: true,
                attendees: [],
                activationType: 'manual',
            };
            setEvents([newEvent, ...events]);
            toast({ title: "Berhasil!", description: "Acara baru telah dibuat." });
        }
    });
  };
  
  const confirmDeleteEvent = (event: CheckInEvent) => {
    setEventToDelete(event);
    setDeleteAlertOpen(true);
  };
  
  const handleDeleteEvent = () => {
    if(!eventToDelete) return;

    startTransition(() => {
        setEvents(events.filter(e => e.id !== eventToDelete.id));
        toast({ variant: "destructive", title: "Dihapus!", description: `Acara ${eventToDelete.eventName} telah dihapus.` });
        setDeleteAlertOpen(false);
        setEventToDelete(null);
    });
  };

  const handleStatusChange = useCallback((eventId: string, isActive: boolean) => {
      startTransition(() => {
          setEvents(prevEvents => prevEvents.map(event => {
              if (event.id === eventId) {
                  if (event.deactivationTimer) {
                      clearTimeout(event.deactivationTimer);
                  }
                  toast({
                      title: `Status Diubah`,
                      description: `Acara "${event.eventName}" sekarang ${isActive ? 'Aktif' : 'Selesai'}.`
                  });
                  return { ...event, isActive, deactivationTimer: undefined, activationType: isActive ? 'manual' : undefined, timerEndsAt: undefined };
              }
              return event;
          }));
      });
  }, [toast]);

  const handleTimerSet = useCallback((eventId: string, hours: number) => {
      const durationMs = hours * 60 * 60 * 1000;
      const endsAt = Date.now() + durationMs;

      startTransition(() => {
          setEvents(prevEvents => prevEvents.map(event => {
              if (event.id === eventId) {
                  if (event.deactivationTimer) {
                      clearTimeout(event.deactivationTimer);
                  }
                  const newTimer = setTimeout(() => {
                      handleStatusChange(eventId, false);
                  }, durationMs);

                  toast({
                      title: 'Timer Disetel!',
                      description: `Acara "${event.eventName}" akan otomatis selesai dalam ${hours} jam.`
                  });

                  return { ...event, isActive: true, deactivationTimer: newTimer, activationType: 'timer', timerEndsAt: endsAt };
              }
              return event;
          }));
      });
  }, [handleStatusChange, toast]);

  useEffect(() => {
      return () => {
          events.forEach(event => {
              if (event.deactivationTimer) {
                  clearTimeout(event.deactivationTimer);
              }
          });
      };
  }, [events]);


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

        <div className="flex justify-between items-center mb-6 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(isLoading || isPending) ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <Card key={`skeleton-${index}`}>
                  <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-20" />
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                      <Skeleton className="h-9 w-full" />
                  </CardFooter>
              </Card>
            ))
          ) : paginatedEvents.length > 0 ? (
            paginatedEvents.map(event => (
              <Card key={event.id} className="flex flex-col">
                <CardHeader>
                  <AttendanceListDialog event={event} asChild>
                    <CardTitle className="text-xl text-primary cursor-pointer hover:underline">{event.eventName}</CardTitle>
                  </AttendanceListDialog>
                  <div className="flex items-center text-sm text-muted-foreground gap-2 pt-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.eventDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric'})}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                   <Separator />
                   <div className="flex justify-between items-start pt-2">
                       <div className="flex items-center gap-2">
                           <Users className="h-5 w-5 text-muted-foreground" />
                           <span className="font-medium">{event.attendees.length} Jemaat Hadir</span>
                       </div>
                       <div className="flex flex-col items-end gap-1">
                          <Badge variant={event.isActive ? "default" : "secondary"}>
                            {event.isActive ? <CheckCircle className="mr-2 h-4 w-4"/> : <XCircle className="mr-2 h-4 w-4"/>}
                            {event.isActive ? 'Aktif' : 'Selesai'}
                          </Badge>
                          {event.isActive && (
                            <>
                              {event.activationType === 'timer' && event.timerEndsAt && (
                                <TimerCountdown endTime={event.timerEndsAt} />
                              )}
                              {event.activationType === 'manual' && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Fingerprint className="h-3 w-3" />
                                  <span>Manual</span>
                                </div>
                              )}
                            </>
                          )}
                       </div>
                   </div>
                </CardContent>
                <CardFooter className="flex pt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="outline" className="w-full">
                         <Settings className="mr-2 h-4 w-4" />
                         Kelola
                       </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                       <AddEditEventDialog
                        event={event}
                        onSave={(data) => handleSaveEvent(data, event.id)}
                        triggerAsChild
                       >
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4"/>
                            Edit Detail
                         </DropdownMenuItem>
                       </AddEditEventDialog>
                       
                       <StatusManagementDialog
                          event={event}
                          onStatusChange={handleStatusChange}
                          onTimerSet={handleTimerSet}
                          triggerAsChild
                       >
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            {event.isActive ? <ToggleRight className="mr-2 h-4 w-4"/> : <ToggleLeft className="mr-2 h-4 w-4"/>}
                            Kelola Status
                         </DropdownMenuItem>
                       </StatusManagementDialog>

                       <DropdownMenuSeparator/>
                       <DropdownMenuItem 
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onSelect={() => confirmDeleteEvent(event)}
                        >
                         <Trash2 className="mr-2 h-4 w-4"/>
                         Hapus Acara
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-24">
                <p className="text-muted-foreground">Tidak ada acara yang cocok.</p>
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
