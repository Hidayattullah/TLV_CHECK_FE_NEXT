
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, ShieldCheck, UserPlus, User, Mail, CalendarDays, KeyRound, Loader2, Save, Phone, CheckCircle2, AlertTriangle, XCircle, Upload, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

type Permission = "read" | "edit" | "delete";
type Module = "members" | "attendance" | "prayers" | "questions";

type Member = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  joinedDate: string;
  isActive: boolean;
  phoneNumber: string;
  isVerified: boolean;
  permissions: Record<Module, Permission[]>;
};

const initialMembers: Member[] = [
  {
    id: "1",
    name: "Tubagus Rifan",
    email: "tubagus@example.com",
    avatarUrl: "",
    joinedDate: "2023-01-15",
    isActive: true,
    phoneNumber: "+6281234567890",
    isVerified: true,
    permissions: {
      members: ["read", "edit", "delete"],
      attendance: ["read", "edit"],
      prayers: ["read"],
      questions: ["read", "edit"],
    },
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    avatarUrl: "",
    joinedDate: "2023-02-20",
    isActive: false,
    phoneNumber: "+6281234567891",
    isVerified: false,
    permissions: {
      members: ["read"],
      attendance: [],
      prayers: [],
      questions: ["read"],
    },
  },
  {
    id: "3",
    name: "Admin Gereja",
    email: "admin@thelordsvineyard.org",
    avatarUrl: "",
    joinedDate: "2022-11-10",
    isActive: true,
    phoneNumber: "+6281234567892",
    isVerified: true,
    permissions: {
      members: ["read", "edit", "delete"],
      attendance: ["read", "edit", "delete"],
      prayers: ["read", "edit", "delete"],
      questions: ["read", "edit", "delete"],
    },
  },
];

const moduleLabels: Record<Module, string> = {
  members: "Manajemen Jemaat",
  attendance: "Pembuatan Absensi",
  prayers: "Pokok Doa",
  questions: "Pertanyaan Jemaat",
};

const permissionLabels: Record<Permission, string> = {
  read: "Baca",
  edit: "Edit",
  delete: "Hapus",
};

function PermissionsDialog({ member, onSave, onOpenChange, children }: { member: Member; onSave: (id: string, permissions: Record<Module, Permission[]>) => void; onOpenChange: (open: boolean) => void; children: React.ReactNode; }) {
  const [currentPermissions, setCurrentPermissions] = useState(member.permissions);
  
  const handlePermissionChange = (module: Module, permission: Permission, checked: boolean) => {
    setCurrentPermissions(prev => {
      const newPermissions = new Set(prev[module]);
      if (checked) {
        newPermissions.add(permission);
      } else {
        newPermissions.delete(permission);
      }
      return { ...prev, [module]: Array.from(newPermissions) };
    });
  };

  const handleSave = () => {
    onSave(member.id, currentPermissions);
    onOpenChange(false);
  };
  
  const handleDialogStateChange = (open: boolean) => {
    if(!open) {
      // Reset permissions to original if dialog is closed without saving
      setCurrentPermissions(member.permissions);
    }
    onOpenChange(open);
  }

  return (
    <Dialog onOpenChange={handleDialogStateChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Kelola Hak Akses untuk {member.name}</DialogTitle>
          <DialogDescription>
            Atur izin untuk setiap modul yang dapat diakses oleh pengguna.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          {Object.keys(moduleLabels).map((moduleKey) => {
            const module = moduleKey as Module;
            return (
              <div key={module} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">{moduleLabels[module]}</h4>
                <div className="flex items-center space-x-6">
                  {Object.keys(permissionLabels).map((permissionKey) => {
                    const permission = permissionKey as Permission;
                    return (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${member.id}-${module}-${permission}`}
                          checked={currentPermissions[module].includes(permission)}
                          onCheckedChange={(checked) => handlePermissionChange(module, permission, !!checked)}
                        />
                        <Label htmlFor={`${member.id}-${module}-${permission}`} className="font-normal">
                          {permissionLabels[permission]}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
           <Button type="button" variant="secondary" onClick={() => handleDialogStateChange(false)}>Batal</Button>
          <Button type="button" onClick={handleSave}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MemberDetailDialog({ 
  member, 
  open, 
  isLoading,
  onOpenChange, 
  onSave, 
  onPermissionsSave,
  onPermissionDialogOpen,
  onDelete,
}: { 
  member: Member | null; 
  open: boolean; 
  isLoading: boolean;
  onOpenChange: (open: boolean) => void; 
  onSave: (updatedMember: Member) => void; 
  onPermissionsSave: (id: string, permissions: Record<Module, Permission[]>) => void;
  onPermissionDialogOpen: (id: string, open: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Member | null>(member);
  const [originalDataOnEdit, setOriginalDataOnEdit] = useState<Member | null>(null);
  const { toast } = useToast();
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [isSaveAlertOpen, setIsSaveAlertOpen] = useState(false);
  const [changesSummary, setChangesSummary] = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState(member?.avatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setFormData(member);
    setAvatarPreview(member?.avatarUrl);
    if (!open) {
      setIsEditMode(false);
      setIsSaveAlertOpen(false); // Close save alert if main dialog closes
      setIsCancelAlertOpen(false); // Close cancel alert
    }
  }, [member, open]);
  
  useEffect(() => {
    if (open && isEditMode && !originalDataOnEdit) {
      setOriginalDataOnEdit(formData);
    }
    if (!isEditMode) {
      setOriginalDataOnEdit(null);
    }
  }, [open, isEditMode, formData, originalDataOnEdit]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };
  
  const handleStatusToggle = (checked: boolean) => {
    if (formData) {
       setFormData({ ...formData, isActive: checked });
    }
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
          setAvatarPreview(reader.result as string);
          if (formData) {
            setFormData({ ...formData, avatarUrl: reader.result as string });
          }
          setIsUploading(false);
          clearInterval(progressInterval);
        }, 500); 
      };

      reader.readAsDataURL(file);
    }
  };

  const checkForChanges = () => {
    if (!formData || !originalDataOnEdit) return [];
    
    const changes: string[] = [];

    if (formData.name !== originalDataOnEdit.name) changes.push("Nama");
    if (formData.email !== originalDataOnEdit.email) changes.push("Email");
    if (formData.phoneNumber !== originalDataOnEdit.phoneNumber) changes.push("No. Telepon");
    if (formData.joinedDate !== originalDataOnEdit.joinedDate) changes.push("Tanggal Bergabung");
    if (formData.isActive !== originalDataOnEdit.isActive) changes.push("Status Keaktifan");
    if (avatarPreview !== originalDataOnEdit.avatarUrl) changes.push("Foto Avatar");
    
    return changes;
  };

  const handleSaveClick = () => {
    const detectedChanges = checkForChanges();
    if (detectedChanges.length === 0) {
      toast({
        title: "Tidak Ada Perubahan",
        description: "Anda tidak membuat perubahan apapun.",
      });
      return;
    }

    setChangesSummary(detectedChanges);
    setIsSaveAlertOpen(true);
  };

  const executeSave = () => {
    if (formData) {
      setIsSaving(true);
      setTimeout(() => {
        try {
          if (Math.random() < 0.2) { 
             throw new Error("Simulated network error");
          }
          
          const updatedMember = { ...formData, avatarUrl: avatarPreview || formData.avatarUrl };
          onSave(updatedMember);
          setIsSaving(false);
          setIsEditMode(false);
          onOpenChange(false);
          toast({
            title: "Berhasil!",
            description: `Perubahan pada ${formData.name} berhasil dilakukan.`,
          });
        } catch(error) {
           setIsSaving(false);
           toast({
            variant: "destructive",
            title: "Gagal!",
            description: `Gagal menyimpan perubahan untuk ${formData.name}, periksa koneksi Anda.`,
          });
        } finally {
           setIsSaveAlertOpen(false);
        }
      }, 1500);
    }
  };
  
  const handleCancelClick = () => {
    setIsCancelAlertOpen(true);
  };
  
  const handleCancelConfirm = () => {
    setIsEditMode(false);
    setFormData(member);
    setAvatarPreview(member?.avatarUrl);
    setIsCancelAlertOpen(false);
  };
  
  const handleDialogCloseAttempt = (isOpen: boolean) => {
    if (!isOpen) {
      if (isEditMode) {
        handleCancelClick();
        return; 
      }
      onOpenChange(false);
    } else {
       onOpenChange(true);
    }
  };
  
  if (!member) return null;

  const userInitials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const currentAvatar = isEditMode ? avatarPreview : member.avatarUrl;

  return (
    <>
    <Dialog open={open} onOpenChange={handleDialogCloseAttempt}>
      <DialogContent 
        className="sm:max-w-md"
        onInteractOutside={(e) => {
           if(isEditMode) {
             e.preventDefault();
             handleCancelClick();
           }
        }}
        onEscapeKeyDown={(e) => {
          if(isEditMode) {
             e.preventDefault();
             handleCancelClick();
           }
        }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Detail Jemaat</DialogTitle>
              <DialogDescription>
                Lihat atau perbarui informasi jemaat di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
              <div className="flex flex-col items-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Avatar className="w-24 h-24 mb-2 border-2 border-primary cursor-pointer">
                      {currentAvatar ? (
                        <AvatarImage src={currentAvatar} alt={member.name} />
                      ) : (
                         <AvatarFallback>{userInitials}</AvatarFallback>
                      )}
                    </Avatar>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{member.name}</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center items-center p-4 min-h-[100px]">
                        {currentAvatar ? (
                          <Image src={currentAvatar} alt={`Avatar of ${member.name}`} width={400} height={400} className="rounded-lg" data-ai-hint="person portrait"/>
                        ) : (
                          <p className="text-muted-foreground">{member.name} belum mengunggah foto.</p>
                        )}
                      </div>
                    </DialogContent>
                </Dialog>
                
                {isEditMode && (
                  <>
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
                      onClick={() => document.getElementById("photo-upload")?.click()}
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
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" value={formData?.name || ''} onChange={handleInputChange} disabled={!isEditMode || isSaving} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={formData?.email || ''} onChange={handleInputChange} disabled={!isEditMode || isSaving} className="pl-9" />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="phoneNumber">No. Telepon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phoneNumber" type="tel" value={formData?.phoneNumber || ''} onChange={handleInputChange} disabled={!isEditMode || isSaving} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinedDate">Tanggal Bergabung</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="joinedDate" type="date" value={formData?.joinedDate || ''} onChange={handleInputChange} disabled={!isEditMode || isSaving} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status Verifikasi</Label>
                 <div className="flex items-center pt-1">
                  <Badge variant={formData?.isVerified ? "default" : "secondary"}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {formData?.isVerified ? 'Terverifikasi OTP' : 'Belum Verifikasi'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status Keaktifan</Label>
                {isEditMode ? (
                  <div className="flex items-center space-x-2 pt-1">
                    <Switch
                      id="status-toggle"
                      checked={formData?.isActive}
                      onCheckedChange={handleStatusToggle}
                      disabled={isSaving}
                    />
                    <Label htmlFor="status-toggle" className="font-normal">
                      {formData?.isActive ? "Aktif" : "Nonaktif"}
                    </Label>
                  </div>
                ) : (
                  <div className="flex items-center pt-1">
                    <Badge variant={formData?.isActive ? "default" : "destructive"}>
                      {formData?.isActive ? (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      ) : (
                        <AlertTriangle className="mr-2 h-4 w-4" />
                      )}
                      {formData?.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2 sm:justify-between sm:gap-0">
              {isEditMode ? (
                <>
                <div>
                  {/* This space is now empty */}
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" disabled={isSaving} onClick={handleCancelClick}>
                    Batal
                  </Button>
                  <Button type="button" onClick={handleSaveClick} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
                </>
              ) : (
                <>
                  <div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data jemaat <strong>{member.name}</strong> secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(member.id)}>Lanjutkan Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditMode(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                     <PermissionsDialog 
                        member={member} 
                        onSave={onPermissionsSave}
                        onOpenChange={(open) => onPermissionDialogOpen(member.id, open)}
                      >
                      <Button type="button" variant="secondary">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Hak Akses
                      </Button>
                    </PermissionsDialog>
                  </div>
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
    
    <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive"/> Konfirmasi Pembatalan
          </AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin membatalkan perubahan? Semua yang belum disimpan akan hilang.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Kembali</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancelConfirm}>Lanjutkan</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
    <AlertDialog open={isSaveAlertOpen} onOpenChange={setIsSaveAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ListChecks className="text-primary"/> Konfirmasi Perubahan
          </AlertDialogTitle>
          <div className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin menyimpan perubahan berikut?
             <ul className="mt-2 list-disc list-inside text-sm text-foreground/80 bg-secondary/50 p-3 rounded-md">
              {changesSummary.map(change => <li key={change}>{change}</li>)}
            </ul>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSaving}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={executeSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Menyimpan..." : "Lanjutkan & Simpan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    </>
  );
}


export default function MembersManagementPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPermissionDialogs, setOpenPermissionDialogs] = useState<Record<string, boolean>>({});
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const { toast } = useToast();

  const handlePermissionsSave = (id: string, permissions: Record<Module, Permission[]>) => {
     setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id ? { ...member, permissions } : member
      )
    );
  };
  
  const handleMemberSave = (updatedMember: Member) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  const handlePermissionDialogOpener = (id: string, open: boolean) => {
    setOpenPermissionDialogs(prev => ({ ...prev, [id]: open }));
  };

  const handleViewMember = (member: Member) => {
    setIsDetailLoading(true);
    setViewingMember(member);
    // Simulate fetching data
    setTimeout(() => {
      setIsDetailLoading(false);
    }, 1000); // 1 second delay
  };
  
  const handleDeleteMember = (id: string) => {
    const memberToDelete = members.find(m => m.id === id);
    if (!memberToDelete) return;
    
    setMembers(prev => prev.filter(member => member.id !== id));
    setViewingMember(null); // Close the dialog after deletion
    
    toast({
      title: "Berhasil Dihapus",
      description: `Jemaat dengan nama ${memberToDelete.name} telah dihapus.`,
      variant: "destructive"
    });
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl mb-2 text-primary">Manajemen Jemaat</h1>
        <p className="text-muted-foreground max-w-2xl">
          Kelola data anggota jemaat, status keaktifan, dan hak akses sistem.
        </p>
      </header>
      
      <div className="flex justify-between items-center mb-4 gap-4">
        <Input 
          placeholder="Cari jemaat..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm bg-card"
        />
        <Button>
          <UserPlus className="mr-2 h-4 w-4"/>
          Tambah Jemaat
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map(member => (
              <TableRow key={member.id}>
                 <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Avatar className="cursor-pointer">
                        {member.avatarUrl ? (
                           <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                        ) : (
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                        )}
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
                </TableCell>
                <TableCell className="font-medium">
                  <span className="cursor-pointer hover:underline" onClick={() => handleViewMember(member)}>
                    {member.name}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                    <Badge variant={member.isActive ? "default" : "destructive"} className="w-[100px] justify-center">
                       {member.isActive ? (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        ) : (
                          <AlertTriangle className="mr-2 h-4 w-4" />
                        )}
                      {member.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    <MemberDetailDialog 
      member={viewingMember}
      open={!!viewingMember}
      isLoading={isDetailLoading}
      onOpenChange={(open) => !open && setViewingMember(null)}
      onSave={handleMemberSave}
      onPermissionsSave={handlePermissionsSave}
      onPermissionDialogOpen={handlePermissionDialogOpener}
      onDelete={handleDeleteMember}
    />
    </>
  );
}



    
