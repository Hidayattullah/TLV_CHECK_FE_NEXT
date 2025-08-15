
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
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { CheckInEvent } from "@/lib/api/types";
import { getCheckInEvents } from "@/lib/repository_mock/check-in";

export default function DisplayScreensPage() {
  const [events, setEvents] = useState<CheckInEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      try {
        const data = await getCheckInEvents();
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl mb-2 text-primary">Daftar Layar Check-in</h1>
        <p className="text-muted-foreground max-w-2xl">
          Buka tautan untuk menampilkan layar check-in pada masing-masing acara ibadah.
        </p>
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
                <TableRow key={event.id}>
                  <TableCell>
                    {new Date(event.eventDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric'})}
                  </TableCell>
                  <TableCell className="font-medium">{event.eventName}</TableCell>
                  <TableCell>
                    <Badge variant={event.isActive ? "default" : "secondary"}>
                      {event.isActive ? <CheckCircle className="mr-2 h-4 w-4"/> : <XCircle className="mr-2 h-4 w-4"/>}
                      {event.isActive ? 'On Air' : 'Off Air'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/display/${event.id}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4"/>
                        Buka Tautan
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
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
