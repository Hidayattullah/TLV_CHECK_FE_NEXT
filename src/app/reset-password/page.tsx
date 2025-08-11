
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [view, setView] = useState<'request' | 'verify' | 'reset'>('request');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to send reset code will go here.
    // For now, we'll just switch the view.
    setView('verify');
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to verify reset code will go here.
    // For now, we'll just assume it's correct and switch the view.
    setView('reset');
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save new password will go here.
    // For now, we'll just log it.
    console.log("Password reset successfully!");
    // Ideally, redirect to login page after a delay/toast message.
  }

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
            <form onSubmit={handleRequestCode}>
              <CardHeader>
                <CardTitle className="font-bold text-2xl text-primary">Reset Password</CardTitle>
                <CardDescription>Masukkan nomor telepon Anda untuk menerima kode reset password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tel">Nomor Telepon</Label>
                  <Input 
                    id="tel" 
                    type="tel" 
                    placeholder="Masukkan nomor telepon terdaftar" 
                    required 
                    className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Kirim Kode Reset</Button>
                <p className="text-sm text-center text-muted-foreground">
                  Kembali ke halaman{" "}
                  <Link href="/login" prefetch={false} className="underline text-primary/80 hover:text-primary">
                    Login
                  </Link>
                  .
                </p>
              </CardFooter>
            </form>
          </Card>
        )}

        {view === 'verify' && (
           <Card className="w-full max-w-sm mt-8">
            <form onSubmit={handleVerifyCode}>
              <CardHeader>
                <CardTitle className="font-bold text-2xl text-primary">Masukkan Kode Reset</CardTitle>
                <CardDescription>
                  Masukkan kode yang dikirim ke nomor <strong>{phoneNumber}</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-code">Kode Reset</Label>
                  <Input id="reset-code" type="text" placeholder="Masukkan kode reset" required className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg"/>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Verifikasi Kode</Button>
                 <Button variant="link" onClick={() => setView('request')} className="text-primary/80 hover:text-primary">
                  Salah nomor? Minta kode baru
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {view === 'reset' && (
           <Card className="w-full max-w-sm mt-8">
             <form onSubmit={handleResetPassword}>
              <CardHeader>
                <CardTitle className="font-bold text-2xl text-primary">Atur Password Baru</CardTitle>
                <CardDescription>Buat kata sandi baru untuk akun Anda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password Baru</Label>
                   <div className="relative">
                      <Input 
                        id="new-password"
                        type={showPassword ? "text" : "password"} 
                        placeholder="Masukkan password baru" 
                        required
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
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Ulangi Password Baru</Label>
                  <div className="relative">
                      <Input 
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Ulangi password baru" 
                        required
                        className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg pr-12" 
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
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Simpan Password Baru</Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
