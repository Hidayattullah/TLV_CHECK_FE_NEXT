"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Registrasi</h1>
      </header>
      
      <main className="p-4 space-y-6 pb-24">
        <div className="space-y-4">
          <Input placeholder="NIK" className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
          <Input placeholder="Nama" className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
          <Input type="email" placeholder="Email" className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
          <Input type="tel" placeholder="Nomor Telepon" className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
          <Input placeholder="Alamat" className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
          <div className="relative">
            <Label className="absolute left-3 top-[-0.6rem] bg-background px-1 text-xs text-foreground/60">Tanggal Lahir</Label>
            <Input type="date" placeholder="Tanggal Lahir" className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg text-foreground/60" />
          </div>
          
          <div className="space-y-2 pt-2">
            <Label className="text-foreground/60">Jenis Kelamin</Label>
            <RadioGroup defaultValue="laki-laki" className="flex gap-6 pt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="laki-laki" id="r1" />
                <Label htmlFor="r1" className="font-normal">Laki-laki</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="perempuan" id="r2" />
                <Label htmlFor="r2" className="font-normal">Perempuan</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg pr-12" 
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
              className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg pr-12" 
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
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <Button className="w-full h-12 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold">
            Submit
          </Button>
        </div>
      </main>
    </div>
  );
}
