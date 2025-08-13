
"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
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
import { getPersonalCheckInHistory } from "@/lib/repository_mock/check-in-personal";


const ITEMS_PER_PAGE = 5;
const CURRENT_USER_NAME = "Tubagus Rifan"; // Hardcoded for mock purposes

export function CheckInReport() {
  const [records, setRecords] = useState<PersonalCheckInRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      try {
        const data = await getPersonalCheckInHistory(CURRENT_USER_NAME);
        setRecords(data);
      } catch (error) {
         toast({
          variant: "destructive",
          title: "Gagal Memuat Riwayat",
          description: "Tidak dapat memuat riwayat check-in Anda.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, [toast]);

  const filteredData = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return records
      .filter((record) => {
        return record.service.toLowerCase().includes(lowercasedSearchTerm);
      })
      .filter((record) =>
        filterMethod === "all" ? true : record.checkinMethod === filterMethod
      );
  }, [records, searchTerm, filterMethod]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);
  
  const handlePageChange = (newPage: number) => {
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
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="bg-card sm:w-[180px]">
            <SelectValue placeholder="Metode Check-in" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Metode</SelectItem>
            <SelectItem value="Barcode">Barcode</SelectItem>
            <SelectItem value="RFID">RFID</SelectItem>
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
            ) : paginatedData.length > 0 ? (
              paginatedData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.service}</TableCell>
                  <TableCell>{new Date(record.checkinDate).toLocaleString("id-ID", { dateStyle: 'long', timeStyle: 'short' })}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={record.checkinMethod === "Barcode" ? "default" : "secondary"}>
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
