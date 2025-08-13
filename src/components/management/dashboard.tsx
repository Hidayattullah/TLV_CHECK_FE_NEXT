
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, QrCode, ScrollText, MessageSquareQuote, Settings, Save, Trash2, Download, Plus, Edit, Loader2, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const managementSections = [
  {
    title: "Manajemen Jemaat",
    description: "Lihat, tambah, dan kelola data anggota jemaat.",
    icon: Users,
    href: "/members-management",
    cta: "Kelola Jemaat",
  },
  {
    title: "Pembuatan Check In",
    description: "Buat dan kelola kode QR untuk check-in ibadah atau acara.",
    icon: QrCode,
    href: "/check-in-creation",
    cta: "Buat Check In",
  },
  {
    title: "Pokok Doa",
    description: "Tinjau dan kelola permohonan doa yang masuk dari jemaat.",
    icon: ScrollText,
    href: "/management/prayers",
    cta: "Lihat Doa",
  },
  {
    title: "Pertanyaan Jemaat",
    description: "Lihat dan jawab pertanyaan yang diajukan oleh jemaat.",
    icon: MessageSquareQuote,
    href: "/management/questions",
    cta: "Lihat Pertanyaan",
  },
];

export function ManagementDashboard() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [pressedStates, setPressedStates] = useState<Record<string, boolean>>({});

  const handleLoadingToggle = (key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // Auto-disable loading after 3 seconds
    if (!loadingStates[key]) {
      setTimeout(() => {
        setLoadingStates(prev => ({
          ...prev,
          [key]: false
        }));
      }, 3000);
    }
  };

  const handlePressedToggle = (key: string) => {
    setPressedStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Original Management Cards - Now with Fixed Buttons */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {managementSections.map((section) => (
            <Card key={section.title} className="flex flex-col">
              <CardHeader className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-primary">{section.title}</CardTitle>
                    <CardDescription className="mt-1">{section.description}</CardDescription>
                  </div>
                  <section.icon className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <Link href={section.href}>
                  <Button variant="management" className="w-full">{section.cta}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
