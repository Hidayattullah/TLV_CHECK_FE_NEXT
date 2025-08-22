
"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, ExternalLink, PlusCircle, Copy } from "lucide-react";
import Link from "next/link";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CheckInEvent } from "@/lib/api/types";
import { getCheckInEvents } from "@/lib/repository/check-in";


function CreateEditScreenDialog({
  event,
  activeEvents,
  children
}: {
  event?: CheckInEvent | null;
  activeEvents: CheckInEvent[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  
  const displayLink = useMemo(() => {
    if (selectedEventId) {
      return `${window.location.origin}/display/${selectedEventId}`;
    }
    return "";
  }, [selectedEventId]);

  useEffect(() => {
    if (open) {
      setSelectedEventId(event?.id);
    } else {
      // Reset on close
      setTimeout(() => setSelectedEventId(undefined), 200);
    }
  }, [open, event]);

  const handleCopy = () => {
    if (!displayLink) return;
    navigator.clipboard.writeText(displayLink);
    toast({
      title: "Berhasil Disalin!",
      description: "Tautan layar telah disalin ke clipboard.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? "Detail Layar Check-in" : "Buat Layar Check-in Baru"}</DialogTitle>
          <DialogDescription>
            {event ? "Lihat atau salin tautan untuk layar check-in." : "Pilih acara yang aktif untuk membuat tautan layar check-in."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="event-select">Acara Terpilih</Label>
            <Select
              value={selectedEventId}
              onValueChange={setSelectedEventId}
              disabled={!!event} // Disable if editing
            >
              <SelectTrigger id="event-select">
                <SelectValue placeholder="Pilih acara yang sedang aktif..." />
              </SelectTrigger>
              <SelectContent>
                {activeEvents.length > 0 ? (
                  activeEvents.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.eventName}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-events" disabled>Tidak ada acara aktif</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          {displayLink && (
            <div className="space-y-2">
              <Label htmlFor="display-link">Tautan Layar</Label>
              <div className="relative">
                <Input id="display-link" value={displayLink} readOnly className="pr-10"/>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Salin Tautan</span>
                </Button>
              </div>
            </div>
          )}
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


export default function DisplayScreensPage() {
  const [events, setEvents] = useState<CheckInEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      try {
        // Fetch a large number of events to simulate fetching all of them, as this page has no pagination.
        const { data } = await getCheckInEvents(1, 100); 
        // Sort events by date descending
        const sortedData = data.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
        setEvents(sortedData);
      } catch (error) {
         toast({
          variant: "destructive",
          title: "Gagal Memuat Acara",
          description: "Tidak dapat memuat data acara check-in.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, [toast]);

  const activeEvents = useMemo(() => {
    return events.filter(e => e.isActive);
  }, [events]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="font-headline text-4xl mb-2 text-primary">Daftar Layar Check-in</h1>
          <p className="text-muted-foreground max-w-2xl">
            Buka tautan untuk menampilkan layar check-in pada masing-masing acara ibadah.
          </p>
        </div>
      </header>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama Ibadah</TableHead>
              <TableHead>Status Layar</TableHead>
              <TableHead className="text-right">Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : events.length > 0 ? (
              events.map(event => (
                <CreateEditScreenDialog key={event.id} event={event} activeEvents={activeEvents}>
                  <TableRow className="cursor-pointer">
                    <TableCell>
                      {new Date(event.eventDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'})}
                    </TableCell>
                    <TableCell className="font-medium">{event.eventName}</TableCell>
                    <TableCell>
                      <Badge variant={event.isActive ? "default" : "secondary"}>
                        {event.isActive ? <CheckCircle className="mr-2 h-4 w-4"/> : <XCircle className="mr-2 h-4 w-4"/>}
                        {event.isActive ? 'On Air' : 'Off Air'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                        <Link href={`/display/${event.id}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4"/>
                          Buka Tautan
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                </CreateEditScreenDialog>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Belum ada acara yang dibuat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
