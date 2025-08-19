
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMemberByPhoneNumber } from "@/lib/repository_mock/members";

export default function ResetPasswordPage() {
  const [view, setView] = useState<'request' | 'verify' | 'reset'>('request');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const member = await getMemberByPhoneNumber(phoneNumber);
      if (member) {
        toast({
          title: "Nomor Terdaftar",
          description: "Kode reset akan segera dikirim ke nomor Anda (simulasi).",
        });
        setView('verify');
      } else {
        toast({
          variant: "destructive",
          title: "Nomor Tidak Ditemukan",
          description: "Nomor telepon ini belum terdaftar. Silakan registrasi terlebih dahulu.",
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: "Tidak dapat memverifikasi nomor telepon. Coba lagi nanti.",
      });
    } finally {
      setIsLoading(false);
    }
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
    toast({
        title: "Berhasil!",
        description: "Password Anda telah berhasil direset.",
    });
    // Ideally, redirect to login page after a delay.
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/login" passHref>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground hover:text-primary">
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
                    placeholder="cth: 081234567890" 
                    required 
                    className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Memeriksa..." : "Kirim Kode Reset"}
                </Button>
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
                <Button type="submit" className="w-full">Verifikasi Kode</Button>
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
                <CardDescription>Buat kata sandi baru untuk akun Anda yang bernomor: <strong>{phoneNumber}</strong></CardDescription>
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
                <Button type="submit" className="w-full">Simpan Password Baru</Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
