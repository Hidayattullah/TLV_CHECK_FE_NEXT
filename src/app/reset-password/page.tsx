import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <div className="bg-background min-h-screen">
       <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/login" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Lupa Password</h1>
      </header>
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-sm mt-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Reset Password</CardTitle>
            <CardDescription>Masukkan NIK Anda untuk menerima kode reset password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nik">NIK</Label>
              <Input id="nik" type="text" placeholder="Masukkan NIK terdaftar" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Kirim Kode Reset</Button>
            <p className="text-sm text-center text-muted-foreground">
              Kembali ke halaman{" "}
              <Link href="/login" prefetch={false} className="underline text-primary/80 hover:text-primary">
                Login
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
