"use client";

import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, LogOut, Upload } from "lucide-react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { BottomNav } from "@/components/common/bottom-nav";

export default function ProfilePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(profileImage);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userName, setUserName] = useState("Tubagus Rifan");
  const [isSaving, setIsSaving] = useState(false);

  // State untuk tracking pressed buttons (simulasi active state)
  const [pressedButtons, setPressedButtons] = useState<{[key: string]: boolean}>({});

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const userInitials = useMemo(() => getInitials(userName), [userName]);

  // Handler untuk button press states
  const handleButtonPress = (buttonId: string) => {
    setPressedButtons(prev => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setPressedButtons(prev => ({ ...prev, [buttonId]: false }));
    }, 150); // Reset after 150ms
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      reader.onloadstart = () => {
         setUploadProgress(20);
      };

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
           if(progress > 20) setUploadProgress(progress);
        }
      };
      
      reader.onloadend = () => {
         setTimeout(() => {
          setProfileImagePreview(reader.result as string);
          setIsUploading(false);
          clearInterval(progressInterval);
        }, 500); // Give time for the progress bar to reach 100%
      };

      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = async () => {
    handleButtonPress('save-button');
    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProfileImage(profileImagePreview);
    const newName = (document.getElementById("name") as HTMLInputElement).value;
    setUserName(newName);
    setIsSaving(false);
    setIsDialogOpen(false);
  }

  const handleCancelChanges = () => {
    handleButtonPress('cancel-button');
    setProfileImagePreview(profileImage); // Reset preview to original image
    setIsSaving(false);
    setIsDialogOpen(false);
  }

  return (
    <div className="bg-background min-h-screen flex flex-col pb-20">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/" passHref>
          <Button 
            variant="ghost" 
            size="icon"
            pressed={pressedButtons['back-button']}
            onClick={() => handleButtonPress('back-button')}
          >
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Profil</h1>
      </header>
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
              {profileImage && <AvatarImage src={profileImage} alt="User" data-ai-hint="person portrait" />}
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-3xl text-primary">{userName}</CardTitle>
            <p className="text-muted-foreground">Member</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-headline text-lg text-primary">Informasi Pribadi</h3>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Nomor Telepon</p>
                  <p>+62 812 3456 7890</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Email</p>
                  <p>tubagusrifan@gmail.com</p>
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
                    pressed={pressedButtons['edit-button']}
                    onClick={() => handleButtonPress('edit-button')}
                  >
                    <span>
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
                      <Avatar className="w-24 h-24 mb-2 border-2 border-primary">
                        {profileImagePreview && <AvatarImage src={profileImagePreview} alt="User" />}
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                      {isUploading && (
                        <div className="w-full px-4">
                          <Progress value={uploadProgress} className="w-full" />
                          <p className="text-xs text-center text-muted-foreground mt-1">{uploadProgress}%</p>
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        loading={isUploading}
                        disabled={isSaving}
                        pressed={pressedButtons['upload-button']}
                        onClick={() => {
                          handleButtonPress('upload-button');
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
                      <Input id="name" defaultValue={userName} disabled={isSaving} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="tubagusrifan@gmail.com" disabled={isSaving} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input id="phone" defaultValue="+62 812 3456 7890" disabled={isSaving} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="alamat">Alamat</Label>
                      <Input id="alamat" defaultValue="Jl. Jenderal Sudirman No. 1, Jakarta" disabled={isSaving} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                      <Input id="tanggalLahir" type="date" defaultValue="1990-01-01" disabled={isSaving} />
                    </div>
                    <div className="space-y-2">
                       <Label>Jenis Kelamin</Label>
                        <RadioGroup defaultValue="laki-laki" className="flex gap-4 pt-1" disabled={isSaving}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="laki-laki" id="r1-edit" disabled={isSaving} />
                            <Label htmlFor="r1-edit" className="font-normal">Laki-laki</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="perempuan" id="r2-edit" disabled={isSaving} />
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
                         pressed={pressedButtons['cancel-button']}
                       >
                         Batal
                       </Button>
                    </DialogClose>
                    <Button 
                      type="submit" 
                      onClick={handleSaveChanges}
                      loading={isSaving}
                      pressed={pressedButtons['save-button']}
                      className="btn-default-focus-override"
                    >
                      {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
               <Link href="/login" passHref className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full text-primary border-primary hover:bg-primary/10 hover:text-primary"
                  pressed={pressedButtons['logout-button']}
                  onClick={() => handleButtonPress('logout-button')}
                >
                  <span>
                    <LogOut />
                    Logout
                  </span>
                </Button>
               </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}
