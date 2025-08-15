
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode';
import { getCheckInEventById, addAttendee } from '@/lib/repository_mock/check-in';
import type { CheckInEvent, Attendee } from '@/lib/api/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, QrCode, Settings, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type DisplayLayout = "vertical" | "horizontal";

export default function DisplayPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<CheckInEvent | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [lastAttendee, setLastAttendee] = useState<Attendee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastAttendeeRef = useRef<Attendee | null>(null);

  // Settings State
  const [layout, setLayout] = useState<DisplayLayout>("vertical");
  const [qrSize, setQrSize] = useState([400]);

  useEffect(() => {
    if (eventId) {
      QRCode.toDataURL(eventId, { width: 800, margin: 2 }) // Generate high-res QR
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error("Failed to generate QR Code", err));
    }
  }, [eventId]);

  const fetchEventData = useCallback(async () => {
    if (!eventId) return;

    try {
      const data = await getCheckInEventById(eventId);
      setEvent(data);

      if (data && data.attendees.length > 0) {
        const latestAttendee = data.attendees[data.attendees.length - 1];
        
        if (lastAttendeeRef.current?.id !== latestAttendee.id) {
          setLastAttendee(latestAttendee);
          lastAttendeeRef.current = latestAttendee;

          setTimeout(() => {
            setLastAttendee(null);
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Failed to fetch event data:", error);
      setEvent(null);
    } finally {
      // Always set loading to false after the first fetch attempt
      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [eventId, isLoading]);
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 's' && eventId) {
            console.log("Simulating a scan...");
            addAttendee(eventId, {
                id: `user-${Date.now()}`,
                name: "Tubagus Rifan",
                checkinTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                checkinMethod: "Barcode"
            }).then(() => {
                fetchEventData();
            });
        }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [eventId, fetchEventData]);

  useEffect(() => {
    fetchEventData();
    const interval = setInterval(fetchEventData, 2000);
    return () => clearInterval(interval);
  }, [fetchEventData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary text-primary-foreground flex flex-col items-center justify-center p-8">
        <Loader2 className="w-16 h-16 animate-spin mb-4" />
        <p className="text-xl">Memuat Layar Check-in...</p>
      </div>
    );
  }

  if (!event || !event.isActive) {
    return (
      <div className="min-h-screen bg-primary text-primary-foreground flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Acara Tidak Ditemukan atau Sudah Selesai</h1>
        <p className="text-xl opacity-80">Pastikan tautan yang Anda gunakan benar dan acara sedang berlangsung.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-primary-foreground flex flex-col items-center p-4 sm:p-8 relative">
       <div className="absolute top-4 right-4 z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white bg-white/10 hover:bg-white/20">
              <Settings className="w-6 h-6"/>
              <span className="sr-only">Pengaturan</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="text-foreground">
            <DialogHeader>
              <DialogTitle>Pengaturan Tampilan</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-6">
              <div className="space-y-3">
                <Label>Orientasi Tata Letak</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={layout === 'vertical' ? 'default' : 'outline'}
                    onClick={() => setLayout('vertical')}
                    className="w-full"
                  >
                    <RectangleVertical className="mr-2"/>
                    Vertikal
                  </Button>
                   <Button 
                    variant={layout === 'horizontal' ? 'default' : 'outline'}
                    onClick={() => setLayout('horizontal')}
                    className="w-full"
                  >
                    <RectangleHorizontal className="mr-2"/>
                    Horizontal
                  </Button>
                </div>
              </div>
               <div className="space-y-3">
                <Label>Ukuran Kode QR ({qrSize[0]}px)</Label>
                <Slider
                  defaultValue={qrSize}
                  onValueChange={setQrSize}
                  max={800}
                  min={200}
                  step={20}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className={cn("w-full h-full flex-grow flex items-center justify-between", 
        layout === 'vertical' ? 'flex-col' : 'flex-col sm:flex-row gap-8'
      )}>
        <header className="w-full text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold">{event.eventName}</h1>
          <p className="text-lg sm:text-xl opacity-80 mt-2">{new Date(event.eventDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <main className="flex flex-col items-center justify-center my-8">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl">
            {qrCodeDataUrl ? (
              <Image 
                src={qrCodeDataUrl} 
                alt="Event QR Code" 
                width={qrSize[0]} 
                height={qrSize[0]} 
                style={{ width: `${qrSize[0]}px`, height: `${qrSize[0]}px` }}
                className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transition-all"
              />
            ) : (
              <Skeleton className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96" />
            )}
          </div>
          <div className="flex items-center gap-4 mt-6 text-xl sm:text-2xl font-semibold">
            <QrCode className="w-8 h-8 sm:w-10 sm:h-10" />
            <span>Pindai untuk Check-in</span>
          </div>
        </main>

        <footer className="w-full h-24 sm:h-32 text-center flex items-center justify-center">
          {lastAttendee && (
            <div key={lastAttendee.id} className="animate-fade-in-up bg-background/10 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg">
                  <p className="text-2xl sm:text-3xl lg:text-4xl">
                    Selamat datang, <span className="font-bold">{lastAttendee.name}</span>, di {event.eventName}!
                  </p>
              </div>
          )}
        </footer>
      </div>
    </div>
  );
}
