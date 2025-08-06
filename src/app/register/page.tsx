"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const FileUploadItem = ({ label }: { label: string }) => (
    <div className="flex items-center justify-between bg-accent p-3 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="bg-primary/20 text-primary p-2 rounded-full">
            <FileText className="w-5 h-5" />
        </div>
        <span className="font-medium text-foreground/80">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full bg-primary/20 text-primary hover:bg-primary/30">
          <Eye className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200">
          <Upload className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Registrasi ESPPT</h1>
      </header>
      
      <main className="p-4 space-y-6 pb-24">
        <div className="space-y-4">
          <Input placeholder="NIK" className="bg-accent border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
          <Input placeholder="Nama" className="bg-accent border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
          <Input type="email" placeholder="Email" className="bg-accent border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
          <Input type="tel" placeholder="Nomor Telepon" className="bg-accent border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="bg-accent border-0 placeholder:text-foreground/60 h-12 rounded-lg pr-12" 
            />
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className="absolute top-1/2 right-2 -translate-y-1/2 text-foreground/60 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <div className="relative">
            <Input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Ulangi Password" 
              className="bg-accent border-0 placeholder:text-foreground/60 h-12 rounded-lg pr-12" 
            />
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className="absolute top-1/2 right-2 -translate-y-1/2 text-foreground/60 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-center font-semibold text-foreground/80">Upload Berkas</h2>
          <div className="space-y-3">
            <FileUploadItem label="KTP/Identitas" />
            <FileUploadItem label="SPPT" />
            <FileUploadItem label="PBB/STTS" />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <Button className="w-full h-12 rounded-lg bg-cyan-200 text-cyan-700 hover:bg-cyan-300 text-lg font-semibold">
            Submit
          </Button>
        </div>
      </main>
    </div>
  );
}
