
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getMemberByPhoneNumber } from "@/lib/repository_mock/members";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const member = await getMemberByPhoneNumber(phoneNumber);
      
      if (member && member.password === password) {
        toast({
          title: "Login Berhasil!",
          description: `Selamat datang kembali, ${member.name}.`,
        });
        // Simulate setting a session and redirecting
        setTimeout(() => router.push("/"), 1000);
      } else {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: "Nomor telepon atau password salah.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: "Terjadi kesalahan. Coba lagi nanti.",
      });
      setIsLoading(false);
    }
  };


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
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="telephone" className="text-sm font-medium text-muted-foreground">Nomor Telepon</label>
              <Input 
                id="telephone"
                type="tel"
                placeholder="Masukkan nomor telepon Anda" 
                className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-foreground/60 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
             <div className="pt-2">
              <Button type="submit" className="w-full h-12 rounded-full text-lg font-semibold" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </div>
          </form>
         
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
