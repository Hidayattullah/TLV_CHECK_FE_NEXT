
"use client";

import { useState, useMemo, useTransition, useEffect, useCallback } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { PersonalCheckInRecord } from "@/lib/api/types";
import { getPersonalCheckInHistory } from "@/lib/repository/check-in-personal";


const ITEMS_PER_PAGE = 5;

export function CheckInReport() {
  const [records, setRecords] = useState<PersonalCheckInRecord[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const loadHistory = useCallback(async () => {
    // No setIsLoading(true) here for seamless search/page changes
    try {
      const { data, pagination: pagInfo } = await getPersonalCheckInHistory(currentPage, ITEMS_PER_PAGE, searchTerm);
      setRecords(data);
      setPagination(pagInfo);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Gagal Memuat Riwayat",
        description: "Tidak dapat memuat riwayat check-in Anda.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, currentPage, searchTerm]);

  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      loadHistory();
    }, 300); // Debounce search

    return () => {
      clearTimeout(handler);
    };
  }, [loadHistory]);

  const filteredData = useMemo(() => {
    // Filtering is now done server-side, this can be simplified or removed
    // But keeping it for immediate UI feedback if desired
    return records
      .filter((record) =>
        filterMethod === "all" ? true : record.checkinMethod === filterMethod
      );
  }, [records, filterMethod]);

  const totalPages = pagination?.totalPages || 1;
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    startTransition(() => {
      setCurrentPage(newPage);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Cari Ibadah..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-card flex-grow"
        />
        <Select
          value={filterMethod}
          onValueChange={(value) => {
            setFilterMethod(value);
            // Note: This filter is client-side. For server-side, you'd add it to API call.
          }}
        >
          <SelectTrigger className="bg-card sm:w-[180px]">
            <SelectValue placeholder="Metode Check-in" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Metode</SelectItem>
            <SelectItem value="Barcode">Barcode</SelectItem>
            <SelectItem value="RFID">RFID</SelectItem>
            <SelectItem value="QR_CODE">QR Code</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ibadah</TableHead>
              <TableHead>Tanggal Check-in</TableHead>
              <TableHead className="text-right">Metode Check-in</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isPending ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.eventName}</TableCell>
                  <TableCell>{new Date(record.checkinTime).toLocaleString("id-ID", { dateStyle: 'long', timeStyle: 'short' })}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={record.checkinMethod === "QR_CODE" ? "default" : "secondary"}>
                      {record.checkinMethod}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center p-4 text-muted-foreground">
                  Data tidak ditemukan.
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
