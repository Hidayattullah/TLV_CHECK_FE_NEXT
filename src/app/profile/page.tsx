
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, LogOut } from "lucide-react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ProfilePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Profil</h1>
      </header>
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person portrait" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-3xl text-primary">John Doe</CardTitle>
            <p className="text-muted-foreground">Member</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-headline text-lg text-primary">Informasi Pribadi</h3>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">NIK</p>
                  <p>1234567890123456</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Nomor Telepon</p>
                  <p>+62 812 3456 7890</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Email</p>
                  <p>john.doe@example.com</p>
                </div>
                 <div>
                  <p className="font-medium text-muted-foreground">Tanggal Lahir</p>
                  <p>1 Januari 1990</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Jenis Kelamin</p>
                  <p>Laki-laki</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-medium text-muted-foreground">Alamat</p>
                  <p>Jl. Jenderal Sudirman No. 1, Jakarta</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-headline text-lg text-primary">Detail Keanggotaan</h3>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Anggota Sejak</p>
                  <p>15 Januari 2020</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Status</p>
                  <p>Aktif</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full"><Edit /> Edit Profil</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profil</DialogTitle>
                    <DialogDescription>
                      Perbarui informasi profil Anda di sini. Klik simpan jika sudah selesai.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                    <div className="space-y-2">
                      <Label htmlFor="nik">NIK</Label>
                      <Input id="nik" defaultValue="1234567890123456" />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="name">Nama</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input id="phone" defaultValue="+62 812 3456 7890" />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="alamat">Alamat</Label>
                      <Input id="alamat" defaultValue="Jl. Jenderal Sudirman No. 1, Jakarta" />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                      <Input id="tanggalLahir" type="date" defaultValue="1990-01-01" />
                    </div>
                    <div className="space-y-2">
                       <Label>Jenis Kelamin</Label>
                        <RadioGroup defaultValue="laki-laki" className="flex gap-4 pt-1">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="laki-laki" id="r1-edit" />
                            <Label htmlFor="r1-edit" className="font-normal">Laki-laki</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="perempuan" id="r2-edit" />
                            <Label htmlFor="r2-edit" className="font-normal">Perempuan</Label>
                          </div>
                        </RadioGroup>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                       <Button type="button" variant="secondary">Batal</Button>
                    </DialogClose>
                    <Button type="submit" onClick={() => setIsDialogOpen(false)}>Simpan Perubahan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
               <Link href="/login" passHref className="w-full">
                <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10 hover:text-primary"><LogOut /> Logout</Button>
               </Link>
            </div>
          </CardContent>
        </Card>
      </main>

       <footer className="w-full p-4 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Tubagus Rifan, All Rights Reserved
      </footer>
    </div>
  );
}
