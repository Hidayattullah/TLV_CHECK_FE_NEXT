"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CameraOff, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScannerPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const getCameraPermission = useCallback(async (deviceId?: string) => {
    try {
      // Stop any existing stream before starting a new one
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "environment" }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoDevices = (await navigator.mediaDevices.enumerateDevices()).filter(
        (device) => device.kind === "videoinput"
      );
      
      setDevices(videoDevices);
      if (!deviceId && videoDevices.length > 0) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }
      
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Akses Kamera Ditolak",
        description: "Mohon izinkan akses kamera di pengaturan browser Anda untuk menggunakan fitur ini.",
      });
    }
  }, [toast]);

  useEffect(() => {
    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [getCameraPermission]);

  const handleSwitchCamera = () => {
    if (devices.length < 2) {
      toast({
        title: "Tidak ada kamera lain",
        description: "Hanya satu kamera yang terdeteksi di perangkat ini.",
      });
      return;
    };
    const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDeviceId = devices[nextIndex].deviceId;
    setCurrentDeviceId(nextDeviceId);
    getCameraPermission(nextDeviceId);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
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
          </>
        )}
      </div>
      <div className="mt-4 w-full max-w-md space-y-4">
         {hasCameraPermission === true && devices.length > 1 && (
          <Button onClick={handleSwitchCamera} className="w-full">
            <RotateCw className="mr-2 h-4 w-4" /> Ganti Kamera
          </Button>
        )}
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
