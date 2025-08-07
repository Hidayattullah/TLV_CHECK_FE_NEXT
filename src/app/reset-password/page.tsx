"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [view, setView] = useState<'request' | 'reset'>('request');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/login" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Lupa Password</h1>
      </header>

      <div className="flex items-center justify-center p-4">
        {view === 'request' && (
          <Card className="w-full max-w-sm mt-8">
            <CardHeader>
              <CardTitle className="font-bold text-2xl text-primary">Reset Password</CardTitle>
              <CardDescription>Masukkan nomor telepon Anda untuk menerima kode reset password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tel">Nomor Telepon</Label>
                <Input id="tel" type="tel" placeholder="Masukkan nomor telepon terdaftar" required className="bg-accent/50 border-0"/>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Kirim Kode Reset</Button>
              <Button variant="link" onClick={() => setView('reset')} className="text-primary/80 hover:text-primary">
                Sudah punya kode reset?
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Kembali ke halaman{" "}
                <Link href="/login" prefetch={false} className="underline text-primary/80 hover:text-primary">
                  Login
                </Link>
                .
              </p>
            </CardFooter>
          </Card>
        )}

        {view === 'reset' && (
           <Card className="w-full max-w-sm mt-8">
            <CardHeader>
              <CardTitle className="font-bold text-2xl text-primary">Masukkan Kode Reset</CardTitle>
              <CardDescription>Masukkan kode yang Anda terima dan atur password baru Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-code">Kode Reset</Label>
                <Input id="reset-code" type="text" placeholder="Masukkan kode reset" required className="bg-accent/50 border-0"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password Baru</Label>
                 <div className="relative">
                    <Input 
                      id="new-password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="Masukkan password baru" 
                      className="bg-accent/50 border-0 placeholder:text-foreground/50 h-12 rounded-lg pr-12" 
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
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Ulangi Password Baru</Label>
                <div className="relative">
                    <Input 
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Ulangi password baru" 
                      className="bg-accent/50 border-0 placeholder:text-foreground/50 h-12 rounded-lg pr-12" 
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Simpan Password Baru</Button>
               <Button variant="link" onClick={() => setView('request')} className="text-primary/80 hover:text-primary">
                Belum punya kode? Minta kode baru
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
