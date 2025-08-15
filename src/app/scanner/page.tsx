
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CameraOff, RotateCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsQR from "jsqr";
import { addAttendee, getCheckInEventById } from "@/lib/repository_mock/check-in";
import { useAuth } from "@/hooks/use-auth";

export default function ScannerPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | undefined>(undefined);
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  const getStream = useCallback(async (deviceId?: string) => {
    stopStream(); 

    const constraints: MediaStreamConstraints = {
      video: deviceId 
        ? { deviceId: { exact: deviceId } } 
        : { facingMode: "environment" }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);

      const currentTrack = stream.getVideoTracks()[0];
      const currentSettings = currentTrack.getSettings();
      setCurrentDeviceId(currentSettings.deviceId);
      
    } catch (err) {
      console.error("Error getting stream:", err);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Akses Kamera Ditolak",
        description: "Tidak dapat memulai kamera. Mohon izinkan akses di pengaturan browser Anda.",
      });
    }
  }, [toast]);

  const handleQrCode = async (eventId: string) => {
    if (!user) {
      toast({ variant: "destructive", title: "Gagal", description: "Anda harus login untuk check-in." });
      setIsProcessing(false);
      setIsScanning(true);
      return;
    }

    try {
      const event = await getCheckInEventById(eventId);
      
      if (event && event.isActive) {
        const alreadyCheckedIn = Array.isArray(event.attendees) && event.attendees.some(attendee => attendee.id === user.id);
        
        if (alreadyCheckedIn) {
          router.push(`/scanner-duplicate?eventName=${encodeURIComponent(event.eventName)}&userName=${encodeURIComponent(user.name)}`);
          return;
        }

        await addAttendee(eventId, {
          id: user.id,
          name: user.name,
          checkinTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          checkinMethod: "Barcode"
        });
        router.push(`/scanner-success?eventName=${encodeURIComponent(event.eventName)}&userName=${encodeURIComponent(user.name)}`);
      
      } else if (event && !event.isActive) {
         toast({ variant: "destructive", title: "Gagal", description: `Acara "${event.eventName}" sudah selesai.` });
         setTimeout(() => {
           setIsProcessing(false);
           setIsScanning(true);
         }, 3000);
      } 
      else {
        toast({ variant: "destructive", title: "Gagal", description: "Kode QR tidak valid atau acara tidak ditemukan." });
        setTimeout(() => {
          setIsProcessing(false);
          setIsScanning(true);
        }, 3000);
      }
    } catch (error) {
       toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan saat check-in." });
       setTimeout(() => {
         setIsProcessing(false);
         setIsScanning(true);
       }, 3000);
    }
  };

  const scanQrCode = useCallback(() => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current && isScanning) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          setIsScanning(false);
          setIsProcessing(true);
          handleQrCode(code.data);
        }
      }
    }
    if (isScanning) {
      requestAnimationFrame(scanQrCode);
    }
  }, [isScanning, handleQrCode]);


  useEffect(() => {
    const initializeCamera = async () => {
        await getStream();
        try {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
        } catch (error) {
            console.error("Tidak dapat menghitung perangkat media:", error);
        }
    };

    initializeCamera();

    return () => {
      stopStream();
    };
  }, [getStream]);

  useEffect(() => {
    let animationFrameId: number;
    if (isScanning && hasCameraPermission) {
       animationFrameId = requestAnimationFrame(scanQrCode);
    }
    return () => {
      if(animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    }
  }, [scanQrCode, isScanning, hasCameraPermission]);
  
  useEffect(() => {
    const handleFocus = () => {
      if (!isScanning && !isProcessing) {
        console.log("Re-enabling scanning on window focus.");
        setIsProcessing(false);
        setIsScanning(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isScanning, isProcessing]);

  const handleSwitchCamera = () => {
    if (devices.length < 2) {
      toast({ title: "Tidak ada kamera lain", description: "Hanya satu kamera yang terdeteksi." });
      return;
    }
    const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDeviceId = devices[nextIndex].deviceId;
    setCurrentDeviceId(nextDeviceId);
    getStream(nextDeviceId);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <canvas ref={canvasRef} className="hidden" />
      <div className="relative w-full max-w-md aspect-square bg-black rounded-lg overflow-hidden shadow-lg">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        {isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
            <Loader2 className="w-12 h-12 mb-4 animate-spin" />
            <p>Harap tunggu, sedang memproses...</p>
          </div>
        )}
        {hasCameraPermission === false && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
            <CameraOff className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-bold">Kamera Tidak Tersedia</h2>
            <p className="text-center">Pastikan Anda telah memberikan izin akses kamera.</p>
          </div>
        )}
         {hasCameraPermission === true && !isProcessing && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 border-4 border-dashed border-white/50 rounded-lg" />
            </div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="scanner-line absolute top-0 left-0 w-full h-1 bg-blue-400 rounded-full shadow-[0_0_10px_theme(colors.blue.400)]" />
            </div>
            {devices.length > 1 && (
              <Button onClick={handleSwitchCamera} size="icon" variant="ghost" className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 text-white hover:text-white">
                <RotateCw className="h-6 w-6" />
              </Button>
            )}
          </>
        )}
      </div>
      <div className="mt-4 w-full max-w-md space-y-4">
        {hasCameraPermission === false ? (
             <p className="text-center text-destructive">Akses kamera diperlukan untuk memindai.</p>
        ) : hasCameraPermission === true ? (
            <p className="text-center text-muted-foreground">Posisikan kode QR di dalam bingkai untuk memindai.</p>
        ) : (
            <p className="text-center text-muted-foreground">Meminta izin kamera...</p>
        )}
      </div>
    </div>
  );
}
