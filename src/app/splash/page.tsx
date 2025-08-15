// FILE INI SUDAH TIDAK DIGUNAKAN LAGI DAN DAPAT DIHAPUS.
// Fungsionalitas telah dipindahkan ke /src/app/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const APP_VERSION = "1.0.0";

export default function SplashScreenPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000); // Splash screen will be visible for 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-primary min-h-screen flex flex-col items-center justify-center p-8 text-primary-foreground overflow-hidden">
      <main className="flex flex-col items-center justify-center flex-grow text-center">
        <div className="animate-fade-in-down">
          <h1 className="text-3xl font-headline tracking-wider mb-4">The Lord&apos;s Vineyard</h1>
        </div>
         <div className="relative w-64 h-64 animate-fade-in-scale">
           <Image 
              src="/images/emblem_nbg.png" 
              alt="The Lord's Vineyard Logo"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              data-ai-hint="emblem"
            />
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 animate-fade-in opacity-0" style={{ animationDelay: '500ms' }}>
           <Loader2 className="w-6 h-6 animate-spin" />
           <p className="text-lg">Loading...</p>
        </div>
      </main>

      <footer className="w-full text-center animate-fade-in-up">
        <p className="text-sm opacity-70">Version {APP_VERSION}</p>
      </footer>
    </div>
  );
}
