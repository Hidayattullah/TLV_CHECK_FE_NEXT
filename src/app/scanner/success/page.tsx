
"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventName = searchParams.get('eventName') || 'acara ini';
  const userName = searchParams.get('userName') || 'Anda';

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="animate-fade-in-scale">
        <span className="text-8xl" role="img" aria-label="Thumbs up">👍</span>
      </div>
      
      <div className="relative my-8 animate-fade-in-down" style={{ animationDelay: '200ms' }}>
        <CheckCircle className="w-32 h-32 text-green-500" />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Selamat datang, <span className="text-primary">{userName}</span>!
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Anda telah berhasil check-in di {eventName}.
        </p>
      </div>

      <div className="mt-12 animate-fade-in flex flex-col sm:flex-row gap-4" style={{ animationDelay: '600ms' }}>
        <Button onClick={() => router.replace('/scanner')} variant="outline">
          Pindai Lagi
        </Button>
        <Link href="/dashboard" passHref>
           <Button>Kembali ke Dasbor</Button>
        </Link>
      </div>
    </div>
  );
}

export default function ScannerSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
