// FILE INI SUDAH TIDAK DIGUNAKAN LAGI DAN DAPAT DIHAPUS.
// Fungsionalitas telah dipindahkan ke /src/app/scanner-duplicate/page.tsx

"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import Link from 'next/link';

function DuplicateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventName = searchParams.get('eventName') || 'acara ini';
  const userName = searchParams.get('userName') || 'Anda';

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
       <div className="relative my-8 animate-fade-in-down" style={{ animationDelay: '200ms' }}>
        <Info className="w-32 h-32 text-primary" />
      </div>
      
      <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          <span className="text-primary">{userName}</span>, Anda Sudah Check-in
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-md">
          Anda sudah terdaftar pada acara <strong>{eventName}</strong>. Tidak perlu melakukan pemindaian ulang.
        </p>
      </div>

      <div className="mt-12 animate-fade-in flex flex-col sm:flex-row gap-4" style={{ animationDelay: '600ms' }}>
        <Button onClick={() => router.replace('/scanner')} variant="outline">
          Pindai Lagi
        </Button>
        <Link href="/check-in" passHref>
           <Button>Lihat Riwayat Check-in</Button>
        </Link>
      </div>
    </div>
  );
}

export default function ScannerDuplicatePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DuplicateContent />
        </Suspense>
    )
}
