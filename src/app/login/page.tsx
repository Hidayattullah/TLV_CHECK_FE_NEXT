
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-primary w-full p-4 flex flex-col items-center justify-center flex-shrink-0 text-primary-foreground">
        <div className="w-full max-w-md">
        </div>
        <div className="my-4 flex flex-col items-center text-center">
           <Image 
              src="/images/emblem_nbg.png" 
              alt="The Lord's Vineyard Logo"
              width={96}
              height={96}
              data-ai-hint="emblem"
            />
           <h1 className="text-2xl font-headline mt-2">The Lord&apos;s Vineyard</h1>
           <p className="text-lg opacity-80 mb-2">Entry Sistem</p>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center w-full -mt-10">
        <div className="bg-card text-card-foreground w-full max-w-md flex-grow p-8 rounded-3xl shadow-lg">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="telephone" className="text-sm font-medium text-muted-foreground">Nomor Telepon</label>
              <Input 
                id="telephone"
                type="tel"
                placeholder="Masukkan nomor telepon Anda" 
                className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg" 
              />
            </div>
            <div className="space-y-2">
               <label htmlFor="password" className="text-sm font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Masukkan password Anda" 
                  className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg pr-12" 
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
            </div>
          </div>
          <div className="mt-8">
             <Link href="/" passHref className="w-full">
              <Button className="w-full h-12 rounded-full bg-primary text-primary-foreground text-lg font-semibold hover:bg-primary/90">
                  Login
              </Button>
            </Link>
          </div>
          <div className="mt-6 text-center">
             <Link href="/reset-password" prefetch={false} className="text-primary hover:text-primary/80 text-sm">
                Lupa Password
             </Link>
          </div>
           <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Belum punya akun? </span>
            <Link href="/register" prefetch={false} className="font-semibold text-primary hover:text-primary/80">
              Daftar
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
