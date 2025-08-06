import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center text-accent">TLV Check-in</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-gray-900/50 rounded-lg overflow-hidden border-2 border-dashed border-accent/50 flex items-center justify-center">
            <QrCode className="w-24 h-24 text-accent/20" />
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="scanner-line absolute top-0 left-0 w-full h-0.5 bg-accent shadow-[0_0_10px_theme(colors.accent.DEFAULT)]"></div>
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            Position the QR code within the frame to check-in or check-out.
          </p>
          <div className="flex gap-4 w-full">
            <Button className="w-full" size="lg">Check-in</Button>
            <Button variant="secondary" className="w-full" size="lg">Check-out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
