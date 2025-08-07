"use client";

import { useState } from "react";
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
];

export function AttendanceReport() {
  return (
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
          {mockData.map((record) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
