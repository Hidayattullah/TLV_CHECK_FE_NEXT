
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Headset } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { login as loginUser } from "@/lib/repository_mock/members";
import { useAuth } from "@/hooks/use-auth";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { login: setAuthSession } = useAuth();

  useEffect(() => {
    const savedPhoneNumber = localStorage.getItem("rememberedPhoneNumber");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedPhoneNumber && savedPassword) {
      setPhoneNumber(savedPhoneNumber);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { token, member } = await loginUser(phoneNumber, password);
      
      if (!member.isActive) {
        toast({
          variant: "destructive",
          title: "Akun Tidak Aktif",
          description: (
            <span>
              Maaf, akun Anda tidak aktif. Harap hubungi administrator melalui{" "}
              <Link href="/support-ticket" className="underline font-bold">
                formulir ini
              </Link>
              .
            </span>
          ),
          duration: 10000,
        });
        setIsLoading(false);
        return;
      }
      
      setAuthSession(token);
      
      if (rememberMe) {
        localStorage.setItem("rememberedPhoneNumber", phoneNumber);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedPhoneNumber");
        localStorage.removeItem("rememberedPassword");
      }
      
      toast({
        title: "Login Berhasil!",
        description: `Selamat datang kembali, ${member.name}.`,
      });
      
      setTimeout(() => router.push("/dashboard"), 1000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nomor telepon atau password salah.";
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: errorMessage,
      });
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-primary w-full p-4 flex flex-col items-center justify-center flex-shrink-0 text-primary-foreground">
        <div className="w-full max-w-md relative">
            <Link href="/support-ticket" passHref>
             <Button 
                size="icon" 
                className="absolute top-0 right-0 bg-white text-primary rounded-full hover:bg-primary hover:text-primary-foreground hover:border hover:border-primary-foreground transition-all"
              >
                <Headset />
                <span className="sr-only">Dukungan</span>
             </Button>
           </Link>
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember-me" className="text-sm font-medium text-muted-foreground cursor-pointer">
                  Ingat Saya
                </Label>
              </div>
              <Link href="/reset-password" prefetch={false} className="text-sm text-primary hover:text-primary/80">
                  Lupa Password
              </Link>
            </div>

             <div className="pt-2">
              <Button type="submit" className="w-full h-12 rounded-full text-lg font-semibold" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </div>
          </form>
         
           <div className="mt-6 text-center text-sm">
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
