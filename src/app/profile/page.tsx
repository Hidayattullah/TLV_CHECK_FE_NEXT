
"use client";

import { useState, useMemo, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, LogOut, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { BottomNav } from "@/components/common/bottom-nav";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import type { Member } from "@/lib/api/types";
import { getMemberById, updateMember } from "@/lib/repository_mock/members";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaveAlertOpen, setIsSaveAlertOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user, isLoading, logout, refetchUser } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Member>>({});
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    if (user) {
      setMember(user);
      setEditFormData(user);
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const userInitials = useMemo(() => member ? getInitials(member.name) : '', [member]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData(prev => ({...prev, [e.target.id]: e.target.value }));
  };

  const handleGenderChange = (value: string) => {
     setEditFormData(prev => ({...prev, gender: value as Member['gender'] }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      setIsUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      
      reader.onloadend = () => {
         setTimeout(() => {
          setEditFormData(prev => ({...prev, avatarUrl: reader.result as string }));
          setIsUploading(false);
          clearInterval(progressInterval);
        }, 500);
      };

      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = async () => {
    if (!member) return;
    setIsSaving(true);
    
    try {
      const updatedData = await updateMember(member.id, editFormData);
      setMember(updatedData);
      refetchUser(); // Refetch user data in context
      toast({
        title: "Berhasil!",
        description: "Profil Anda telah berhasil diperbarui.",
      });
      setIsDialogOpen(false);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan profil.",
      });
    } finally {
      setIsSaving(false);
      setIsSaveAlertOpen(false);
    }
  }

  const handleCancelChanges = () => {
    setEditFormData(member || {});
    setIsSaving(false);
    setIsDialogOpen(false);
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  }

  return (
    <div className="bg-background min-h-screen flex flex-col pb-20">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/" passHref>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Profil</h1>
      </header>
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="p-6">
              <div className="flex flex-col items-center">
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Separator className="my-6" />
              <div className="space-y-4">
                 <Skeleton className="h-6 w-32" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : member && (
            <>
            <CardHeader className="flex flex-col items-center text-center">
                <Dialog>
                <DialogTrigger asChild>
                    <Avatar className="w-24 h-24 mb-4 border-2 border-primary cursor-pointer">
                    {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />}
                    <AvatarFallback className="text-primary border-primary">{userInitials}</AvatarFallback>
                    </Avatar>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                    <DialogTitle>{member.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center items-center p-4 min-h-[100px]">
                    {member.avatarUrl ? (
                        <Image src={member.avatarUrl} alt={`Avatar of ${member.name}`} width={400} height={400} className="rounded-lg" data-ai-hint="person portrait"/>
                    ) : (
                        <p className="text-muted-foreground">{member.name} belum mengunggah foto.</p>
                    )}
                    </div>
                </DialogContent>
                </Dialog>

                <CardTitle className="font-headline text-3xl text-primary">{member.name}</CardTitle>
                <p className="text-muted-foreground">Member</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                <h3 className="font-headline text-lg text-primary">Informasi Pribadi</h3>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                    <p className="font-medium text-muted-foreground">Nomor Telepon</p>
                    <p>{member.phoneNumber}</p>
                    </div>
                    <div>
                    <p className="font-medium text-muted-foreground">Email</p>
                    <p>{member.email}</p>
                    </div>
                    <div>
                    <p className="font-medium text-muted-foreground">Tanggal Lahir</p>
                    <p>{new Date(member.dateOfBirth).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                    <p className="font-medium text-muted-foreground">Jenis Kelamin</p>
                    <p>{member.gender}</p>
                    </div>
                    <div className="sm:col-span-2">
                    <p className="font-medium text-muted-foreground">Alamat</p>
                    <p>{member.address}</p>
                    </div>
                </div>
                </div>
                <div className="space-y-4">
                <h3 className="font-headline text-lg text-primary">Detail Keanggotaan</h3>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                    <p className="font-medium text-muted-foreground">Anggota Sejak</p>
                    <p>{new Date(member.joinedDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                    <p className="font-medium text-muted-foreground">Status</p>
                    <p>{member.isActive ? 'Aktif' : 'Nonaktif'}</p>
                    </div>
                </div>
                </div>
                <div className="flex gap-4 pt-4">
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    if(!open && !isSaving) {
                    handleCancelChanges();
                    } else if(open) {
                    setIsDialogOpen(true);
                    }
                }}>
                    <DialogTrigger asChild>
                    <Button 
                        variant="management" 
                        className="w-full" 
                        disabled={isSaving}
                    >
                        <span className="inline-flex items-center gap-2">
                        <Edit />
                        Edit Profil
                        </span>
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Edit Profil</DialogTitle>
                        <DialogDescription>
                        Perbarui informasi profil Anda di sini. Klik simpan jika sudah selesai.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                        <div className="flex flex-col items-center gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                            <Avatar className="w-24 h-24 mb-2 border-2 border-primary cursor-pointer">
                                {editFormData.avatarUrl && <AvatarImage src={editFormData.avatarUrl} alt="User" />}
                                <AvatarFallback className="text-primary border-primary">{userInitials}</AvatarFallback>
                            </Avatar>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>{member.name}</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center items-center p-4 min-h-[100px]">
                                {editFormData.avatarUrl ? (
                                <Image src={editFormData.avatarUrl} alt={`Avatar of ${member.name}`} width={400} height={400} className="rounded-lg" data-ai-hint="person portrait"/>
                                ) : (
                                <p className="text-muted-foreground">{member.name} belum mengunggah foto.</p>
                                )}
                            </div>
                            </DialogContent>
                        </Dialog>
                        {isUploading && (
                            <div className="w-full px-4">
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-xs text-center text-muted-foreground mt-1">{uploadProgress}%</p>
                            </div>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={isUploading || isSaving}
                            onClick={() => {
                            document.getElementById("photo-upload")?.click();
                            }}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {isUploading ? "Mengunggah..." : "Ganti Foto"}
                        </Button>
                        <Input 
                            id="photo-upload" 
                            type="file" 
                            className="sr-only" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            disabled={isUploading || isSaving} 
                        />
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" value={editFormData.name || ''} onChange={handleInputChange} disabled={isSaving} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={editFormData.email || ''} onChange={handleInputChange} disabled={isSaving} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                        <Input id="phoneNumber" value={editFormData.phoneNumber || ''} onChange={handleInputChange} disabled={isSaving} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="address">Alamat</Label>
                        <Input id="address" value={editFormData.address || ''} onChange={handleInputChange} disabled={isSaving} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                        <Input id="dateOfBirth" type="date" value={editFormData.dateOfBirth || ''} onChange={handleInputChange} disabled={isSaving} />
                        </div>
                        <div className="space-y-2">
                        <Label>Jenis Kelamin</Label>
                            <RadioGroup value={editFormData.gender} onValueChange={handleGenderChange} className="flex gap-4 pt-1" disabled={isSaving}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Laki-laki" id="r1-edit" disabled={isSaving} />
                                <Label htmlFor="r1-edit" className="font-normal">Laki-laki</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Perempuan" id="r2-edit" disabled={isSaving} />
                                <Label htmlFor="r2-edit" className="font-normal">Perempuan</Label>
                            </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                        <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={handleCancelChanges}
                            disabled={isSaving}
                        >
                            Batal
                        </Button>
                        </DialogClose>
                        <AlertDialog open={isSaveAlertOpen} onOpenChange={setIsSaveAlertOpen}>
                        <AlertDialogTrigger asChild>
                            <Button 
                            type="button"
                            disabled={isSaving}
                            >
                            Simpan Perubahan
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Perubahan</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menyimpan perubahan pada profil Anda?
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel disabled={isSaving}>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSaveChanges} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving ? "Menyimpan..." : "Lanjutkan & Simpan"}
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
                
                    <Button 
                    variant="outline" 
                    className="w-full text-primary border-primary hover:bg-primary/10 hover:text-primary"
                    onClick={handleLogout}
                    >
                    <span className="inline-flex items-center gap-2">
                        <LogOut />
                        Logout
                    </span>
                    </Button>
                
                </div>
            </CardContent>
            </>
          )}
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}
