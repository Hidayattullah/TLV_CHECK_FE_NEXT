
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CameraOff, RotateCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsQR from "jsqr";
import { addAttendee, getCheckInEventById } from "@/lib/repository_mock/check-in";
import { useAuth } from "@/hooks/use-auth";

export default function ScannerPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | undefined>(undefined);
  const [isScanning, setIsScanning] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const getStream = async (deviceId?: string) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "environment" }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error getting stream:", err);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Akses Kamera Ditolak",
        description: "Tidak dapat memulai kamera dengan perangkat yang dipilih.",
      });
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
          handleQrCode(code.data);
        }
      }
    }
    requestAnimationFrame(scanQrCode);
  }, [isScanning]);

  const handleQrCode = async (eventId: string) => {
    if (!user) {
      toast({ variant: "destructive", title: "Gagal", description: "Anda harus login untuk check-in." });
      setTimeout(() => setIsScanning(true), 2000);
      return;
    }

    try {
      const event = await getCheckInEventById(eventId);
      if (event && event.isActive) {
        await addAttendee(eventId, {
          id: user.id,
          name: user.name,
          checkinTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          checkinMethod: "Barcode"
        });
        toast({
          title: "Check-in Berhasil!",
          description: `Selamat datang, ${user.name}, di ${event.eventName}!`,
          action: <CheckCircle className="text-green-500" />,
        });
      } else if (event && !event.isActive) {
         toast({ variant: "destructive", title: "Gagal", description: `Acara "${event.eventName}" sudah selesai.` });
      } 
      else {
        toast({ variant: "destructive", title: "Gagal", description: "Kode QR tidak valid atau acara tidak ditemukan." });
      }
    } catch (error) {
       toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan saat check-in." });
    } finally {
       setTimeout(() => setIsScanning(true), 3000); // Re-enable scanning after a delay
    }
  };


  useEffect(() => {
    const getCameraDevices = async () => {
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoDevices = (await navigator.mediaDevices.enumerateDevices()).filter(
          (device) => device.kind === "videoinput"
        );
        
        if (videoDevices.length === 0) throw new Error("Tidak ada kamera ditemukan.");

        setDevices(videoDevices);
        setHasCameraPermission(true);
        
        const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear'));
        const initialDeviceId = rearCamera ? rearCamera.deviceId : videoDevices[0]?.deviceId;
        setCurrentDeviceId(initialDeviceId);
        
        tempStream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Akses Kamera Ditolak",
          description: "Mohon izinkan akses kamera di pengaturan browser Anda.",
        });
      }
    };

    getCameraDevices();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  useEffect(() => {
    if (currentDeviceId) {
      getStream(currentDeviceId);
    }
  }, [currentDeviceId]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(scanQrCode);
    return () => cancelAnimationFrame(animationFrame);
  }, [scanQrCode]);

  const handleSwitchCamera = () => {
    if (devices.length < 2) {
      toast({ title: "Tidak ada kamera lain", description: "Hanya satu kamera yang terdeteksi." });
      return;
    }
    const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    setCurrentDeviceId(devices[nextIndex].deviceId);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <canvas ref={canvasRef} className="hidden" />
      <div className="relative w-full max-w-md aspect-square bg-black rounded-lg overflow-hidden shadow-lg">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        {hasCameraPermission === false && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
            <CameraOff className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-bold">Kamera Tidak Tersedia</h2>
            <p className="text-center">Pastikan Anda telah memberikan izin akses kamera.</p>
          </div>
        )}
         {hasCameraPermission === true && (
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
        {hasCameraPermission === false && (
            <Alert variant="destructive">
              <AlertTitle>Akses Kamera Diperlukan</AlertTitle>
              <AlertDescription>
                Mohon izinkan akses kamera untuk menggunakan fitur ini.
              </AlertDescription>
            </Alert>
        )}
        {hasCameraPermission === true && (
            <p className="text-center text-muted-foreground">Posisikan kode QR di dalam bingkai untuk memindai.</p>
        )}
         {hasCameraPermission === null && (
            <p className="text-center text-muted-foreground">Meminta izin kamera...</p>
        )}
      </div>
    </div>
  );
}
