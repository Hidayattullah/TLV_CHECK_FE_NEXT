
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/splash');
  }, [router]);

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-background">
  //     <Loader2 className="w-12 h-12 animate-spin text-primary" />
  //   </div>
  // );
}