"use client";

import { useState, useMemo, useTransition } from "react";
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

type AttendanceRecord = {
  id: string;
  service: string;
  speaker: string;
  checkinDate: string;
  checkinMethod: "Barcode" | "RFID";
};

const mockData: AttendanceRecord[] = [
  { id: "1", service: "Ibadah Pagi", speaker: "Pdt. Abraham", checkinDate: "2024-07-28 09:05", checkinMethod: "Barcode" },
  { id: "2", service: "Ibadah Sore", speaker: "Pdt. Yusuf", checkinDate: "2024-07-28 17:02", checkinMethod: "RFID" },
  { id: "3", service: "Ibadah Pagi", speaker: "Pdt. Abraham", checkinDate: "2024-07-21 09:01", checkinMethod: "Barcode" },
  { id: "4", service: "Ibadah Sore", speaker: "Pdt. Yusuf", checkinDate: "2024-07-21 16:59", checkinMethod: "Barcode" },
  { id: "5", service: "Ibadah Pagi", speaker: "Pdt. Daud", checkinDate: "2024-07-14 09:10", checkinMethod: "RFID" },
  { id: "6", service: "Ibadah Remaja", speaker: "Pdt. Yohanes", checkinDate: "2024-07-27 18:30", checkinMethod: "Barcode" },
  { id: "7", service: "Ibadah Pagi", speaker: "Pdt. Abraham", checkinDate: "2024-07-07 09:03", checkinMethod: "Barcode" },
  { id: "8", service: "Ibadah Sore", speaker: "Pdt. Maria", checkinDate: "2024-07-07 17:05", checkinMethod: "RFID" },
  { id: "9", service: "Ibadah Pagi", speaker: "Pdt. Daud", checkinDate: "2024-06-30 08:59", checkinMethod: "Barcode" },
  { id: "10", service: "Ibadah Sore", speaker: "Pdt. Yusuf", checkinDate: "2024-06-30 17:01", checkinMethod: "RFID" },
  { id: "11", service: "Ibadah Pagi", speaker: "Pdt. Abraham", checkinDate: "2024-06-23 09:05", checkinMethod: "Barcode" },
];

const ITEMS_PER_PAGE = 5;

export function AttendanceReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredData = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return mockData
      .filter((record) => {
        const serviceMatch = record.service.toLowerCase().includes(lowercasedSearchTerm);
        const speakerMatch = record.speaker.toLowerCase().includes(lowercasedSearchTerm);
        return serviceMatch || speakerMatch;
      })
      .filter((record) =>
        filterMethod === "all" ? true : record.checkinMethod === filterMethod
      );
  }, [searchTerm, filterMethod]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);
  
  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    setTimeout(() => {
      startTransition(() => {
        setCurrentPage(newPage);
        setIsLoading(false);
      });
    }, 500); // Simulate network delay
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Cari Ibadah atau Pembicara..."
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
              <TableHead>Pembicara</TableHead>
              <TableHead>Tanggal Check-in</TableHead>
              <TableHead className="text-right">Metode Check-in</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16" /></TableCell>
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.service}</TableCell>
                  <TableCell>{record.speaker}</TableCell>
                  <TableCell>{record.checkinDate}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={record.checkinMethod === "Barcode" ? "default" : "secondary"}>
                      {record.checkinMethod}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center p-4 text-muted-foreground">
                  Data tidak ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
    </div>
  );
}
