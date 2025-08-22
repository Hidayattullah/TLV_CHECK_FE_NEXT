

"use client";

import React, { useState, useEffect, useMemo, useTransition, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, ShieldCheck, UserPlus, User, Mail, CalendarDays, KeyRound, Loader2, Save, Phone, CheckCircle2, AlertTriangle, XCircle, Upload, ListChecks, Nfc, RotateCcw, Settings, HomeIcon, VenetianMask, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import type { Member, Module, Permission, RfidType, Gender } from "@/lib/api/types";
import { getMembers, addMember, updateMember, deleteMember as removeMember, setMemberPermissions } from "@/lib/repository/members";
import { useAuth } from "@/hooks/use-auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const moduleLabels: Record<Module, string> = {
  members: "Manajemen Jemaat",
  checkin: "Pembuatan Check In",
  prayers: "Pokok Doa",
  questions: "Pertanyaan Jemaat",
  tickets: "Tiket Dukungan",
};

const permissionLabels: Record<Permission, string> = {
  create: "Buat",
  read: "Baca",
  update: "Update",
  delete: "Hapus",
  write: "Tulis",
};

const addMemberFormSchema = z.object({
  name: z.string().min(1, { message: "Nama tidak boleh kosong." }),
  email: z.string().email({ message: "Format email tidak valid." }).optional().or(z.literal('')),
  phoneNumber: z.string().min(1, { message: "Nomor telepon tidak boleh kosong." }),
  address: z.string().min(1, { message: "Alamat tidak boleh kosong." }),
  dateOfBirth: z.string().min(1, { message: "Tanggal lahir tidak boleh kosong." }),
  gender: z.enum(["Laki-laki", "Perempuan"], { required_error: "Jenis kelamin harus dipilih." }),
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
});

type AddMemberFormValues = z.infer<typeof addMemberFormSchema>;

function AddMemberDialog({ open, onOpenChange, onAddMember }: { open: boolean; onOpenChange: (open: boolean) => void; onAddMember: (newMember: Member) => void; }) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<AddMemberFormValues | null>(null);

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
      password: "",
    },
  });

  async function onConfirmSubmit() {
    if (!formData) return;

    setIsSaving(true);
    try {
      const newMemberData = await addMember({
        ...formData,
      });
      onAddMember(newMemberData);
      toast({
        title: "Berhasil Ditambahkan!",
        description: `Jemaat baru dengan nama ${formData.name} telah ditambahkan.`,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menambahkan jemaat baru.";
       toast({
        variant: "destructive",
        title: "Gagal Menambahkan",
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
      setIsConfirmOpen(false);
      setFormData(null);
    }
  }
  
  function onFormSubmit(values: AddMemberFormValues) {
    setFormData(values);
    setIsConfirmOpen(true);
  }

  const handleDialogStateChange = (isOpen: boolean) => {
    if (isSaving) return;
    if (!isOpen) {
      form.reset();
      setFormData(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={handleDialogStateChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4"/>
          Tambah Jemaat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Jemaat Baru</DialogTitle>
          <DialogDescription>
            Isi formulir di bawah untuk mendaftarkan anggota jemaat baru.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contoh@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="08..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan alamat lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-2 pt-2">
                  <FormLabel>Jenis Kelamin</FormLabel>
                   <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-6 pt-2"
                        disabled={isSaving}
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="Laki-laki" id="laki-laki" />
                          </FormControl>
                          <FormLabel htmlFor="laki-laki" className="font-normal">Laki-laki</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                           <FormControl>
                            <RadioGroupItem value="Perempuan" id="perempuan" />
                           </FormControl>
                          <FormLabel htmlFor="perempuan" className="font-normal">Perempuan</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Sementara</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Buat password untuk jemaat" 
                        {...field}
                      />
                    </FormControl>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 text-foreground/60 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                   <FormMessage />
                </FormItem>
              )}
            />

             <DialogFooter className="pt-4 pr-4">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={isSaving}>Batal</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                  Tambah Jemaat
                </Button>
             </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penambahan Jemaat</AlertDialogTitle>
            <AlertDialogDescription>
                <div>Apakah Anda yakin ingin menambahkan jemaat baru dengan detail berikut?</div>
                <div className="mt-4 space-y-2 text-sm text-foreground bg-secondary/50 p-3 rounded-md">
                    <div><strong>Nama:</strong> {formData?.name}</div>
                    <div><strong>No. Telepon:</strong> {formData?.phoneNumber}</div>
                </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving} onClick={() => setFormData(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmSubmit} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSaving ? "Menambahkan..." : "Lanjutkan & Tambah"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}


function RfidManagementDialog({ member, onSave, children }: { member: Member; onSave: (id: string, rfid: Member['rfid']) => void; children: React.ReactNode; }) {
  const [rfidId, setRfidId] = useState(member.rfid?.id || '');
  const [rfidType, setRfidType] = useState<RfidType | null>(member.rfid?.type || null);
  const [isEditingRfid, setIsEditingRfid] = useState(!member.rfid?.id);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [isSaveAlertOpen, setSaveAlertOpen] = useState(false);
  const [isResetAlertOpen, setResetAlertOpen] = useState(false);
  
  const { toast } = useToast();
  
  const onOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when closing dialog
      setRfidId(member.rfid?.id || '');
      setRfidType(member.rfid?.type || null);
      setIsEditingRfid(!member.rfid?.id);
    }
  }

  const handleSave = async () => {
    if (!rfidId || !rfidType) {
       toast({
        variant: "destructive",
        title: "Data Tidak Lengkap",
        description: "Harap isi ID RFID dan pilih tipe RFID.",
      });
      setSaveAlertOpen(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateMember(member.id, { rfid: { id: rfidId, type: rfidType } });
      onSave(member.id, { id: rfidId, type: rfidType });
      toast({
        title: "Berhasil!",
        description: `RFID untuk ${member.name} berhasil disimpan.`,
      });
      onOpenChange(false);
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan RFID.";
       toast({ variant: "destructive", title: "Gagal!", description: errorMessage });
    } finally {
        setIsSaving(false);
        setSaveAlertOpen(false);
    }
  };
  
  const handleReset = async () => {
    setIsResetting(true);
    try {
        await updateMember(member.id, { rfid: { id: null, type: null } });
        onSave(member.id, { id: null, type: null });
        toast({
            title: "Berhasil Dihapus",
            description: `RFID untuk ${member.name} telah dihapus.`,
            variant: "destructive"
        });
        onOpenChange(false);
    } catch (error) {
         const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat mereset RFID.";
         toast({ variant: "destructive", title: "Gagal!", description: errorMessage });
    } finally {
        setIsResetting(false);
        setResetAlertOpen(false);
    }
  };

  const handleToggleEdit = () => {
    if(isEditingRfid) {
      // If cancelling edit, revert to original state
      setRfidId(member.rfid?.id || '');
      setRfidType(member.rfid?.type || null);
    }
    setIsEditingRfid(!isEditingRfid);
  }

  return (
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kelola RFID untuk {member.name}</DialogTitle>
            <DialogDescription>
              Instal atau reset data RFID untuk anggota jemaat ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
             <div className="space-y-2">
              <Label htmlFor="rfid-id">ID RFID</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="rfid-id" 
                  value={rfidId} 
                  onChange={(e) => setRfidId(e.target.value)} 
                  placeholder="Scan atau masukkan ID RFID" 
                  className="pl-9" 
                  disabled={!isEditingRfid || isSaving}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tipe RFID</Label>
              <RadioGroup 
                value={rfidType || ''} 
                onValueChange={(value) => setRfidType(value as RfidType)} 
                className="flex gap-4 pt-1"
                disabled={!isEditingRfid || isSaving}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Card" id="rfid-card" />
                  <Label htmlFor="rfid-card" className="font-normal">Card</Label>
                </div>
                 <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Tag" id="rfid-tag" />
                  <Label htmlFor="rfid-tag" className="font-normal">Tag</Label>
                </div>
                 <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Stiker" id="rfid-stiker" />
                  <Label htmlFor="rfid-stiker" className="font-normal">Stiker</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-2 justify-between">
              {member.rfid?.id && (
                <Button variant="outline" onClick={handleToggleEdit}>
                  {isEditingRfid ? 'Batal Ubah' : 'Ubah/Reset RFID'}
                </Button>
              )}
               {isEditingRfid && member.rfid?.id && (
                <AlertDialog open={isResetAlertOpen} onOpenChange={setResetAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus RFID
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini akan menghapus data RFID yang terhubung dengan {member.name}. Apakah Anda yakin?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isResetting}>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReset} disabled={isResetting} className="bg-destructive hover:bg-destructive/90">
                        {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isResetting ? "Menghapus..." : "Lanjutkan & Hapus"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
             <AlertDialog open={isSaveAlertOpen} onOpenChange={setSaveAlertOpen}>
               <AlertDialogTrigger asChild>
                <Button type="button" disabled={!isEditingRfid || isSaving} onClick={() => setSaveAlertOpen(true)}>Simpan</Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle>Konfirmasi Penyimpanan</AlertDialogTitle>
                   <AlertDialogDescription>
                     Apakah Anda yakin ingin menyimpan perubahan RFID untuk {member.name}?
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel disabled={isSaving}>Batal</AlertDialogCancel>
                   <AlertDialogAction onClick={handleSave} disabled={isSaving}>
                     {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     {isSaving ? "Menyimpan..." : "Lanjutkan & Simpan"}
                   </AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}


function PermissionsDialog({ open, member, onSave, onOpenChange, children }: { open: boolean; member: Member; onSave: (id: string, permissions: Record<Module, Permission[]>) => void; onOpenChange: (open: boolean) => void; children: React.ReactNode; }) {
  const [currentPermissions, setCurrentPermissions] = useState(member.permissions);
  const [originalPermissions, setOriginalPermissions] = useState(member.permissions);
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [isSaveAlertOpen, setIsSaveAlertOpen] = useState(false);
  const [changesSummary, setChangesSummary] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setCurrentPermissions(member.permissions);
      setOriginalPermissions(member.permissions);
    }
  }, [open, member.permissions]);

  const handlePermissionChange = (module: Module, permission: Permission, checked: boolean) => {
    setCurrentPermissions(prev => {
      const newPermissions = new Set(prev[module]);
      if (checked) {
        newPermissions.add(permission);
        if (permission !== 'read') {
          // Automatically add 'read' if any other permission is checked
          newPermissions.add('read');
        }
      } else {
        newPermissions.delete(permission);
        // If 'read' is unchecked, clear all other permissions for that module
        if (permission === 'read') {
          newPermissions.clear();
        }
      }
      return { ...prev, [module]: Array.from(newPermissions) };
    });
  };

  const checkForChanges = () => {
    const changes: string[] = [];
    (Object.keys(moduleLabels) as Module[]).forEach(module => {
      const original = new Set(originalPermissions[module]);
      const current = new Set(currentPermissions[module]);
      if (original.size !== current.size || ![...original].every(p => current.has(p))) {
        changes.push(moduleLabels[module]);
      }
    });
    return changes;
  };

  const handleSaveClick = () => {
    const detectedChanges = checkForChanges();
    if (detectedChanges.length === 0) {
      onOpenChange(false);
      return;
    }
    setChangesSummary(detectedChanges);
    setIsSaveAlertOpen(true);
  };

  const executeSave = async () => {
    setIsSaving(true);
    try {
      await setMemberPermissions(member.id, currentPermissions);
      onSave(member.id, currentPermissions);
      toast({
        title: "Berhasil!",
        description: `Hak akses untuk ${member.name} berhasil diperbarui.`,
      });
      onOpenChange(false);
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan hak akses.";
       toast({ variant: "destructive", title: "Gagal!", description: errorMessage });
    } finally {
      setIsSaving(false);
      setIsSaveAlertOpen(false);
    }
  };

  const handleCancelClick = () => {
    if (checkForChanges().length > 0) {
      setIsCancelAlertOpen(true);
    } else {
      onOpenChange(false);
    }
  };
  
  const handleCancelConfirm = () => {
    setIsCancelAlertOpen(false);
    onOpenChange(false);
  };

  const handleDialogStateChange = (isOpen: boolean) => {
    if (!isOpen && !isSaving && !isSaveAlertOpen && !isCancelAlertOpen) {
      handleCancelClick();
      return;
    }
    if (!isOpen) {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogStateChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent 
          className="sm:max-w-[600px]"
          onInteractOutside={(e) => {
             if(checkForChanges().length > 0 && !isSaving && !isSaveAlertOpen && !isCancelAlertOpen) {
               e.preventDefault();
               handleCancelClick();
             }
          }}
          onEscapeKeyDown={(e) => {
            if(checkForChanges().length > 0 && !isSaving && !isSaveAlertOpen && !isCancelAlertOpen) {
               e.preventDefault();
               handleCancelClick();
             }
          }}
        >
          <DialogHeader>
            <DialogTitle>Kelola Hak Akses untuk {member.name}</DialogTitle>
            <DialogDescription>
              Atur izin untuk setiap modul yang dapat diakses oleh pengguna.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
            {(Object.keys(moduleLabels) as Module[]).map((module) => {
              const hasReadAccess = currentPermissions[module].includes("read");
              return (
                <div key={module} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">{moduleLabels[module]}</h4>
                  <div className="flex items-center space-x-6">
                    {(Object.keys(permissionLabels) as (keyof typeof permissionLabels)[]).map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${member.id}-${module}-${permission}`}
                          checked={currentPermissions[module].includes(permission)}
                          onCheckedChange={(checked) => handlePermissionChange(module, permission, !!checked)}
                          disabled={isSaving || (permission !== 'read' && !hasReadAccess)}
                        />
                        <Label
                          htmlFor={`${member.id}-${module}-${permission}`}
                          className="font-normal capitalize"
                        >
                          {permissionLabels[permission]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCancelClick} disabled={isSaving}>Batal</Button>
            <Button type="button" onClick={handleSaveClick} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive"/> Konfirmasi Pembatalan
            </AlertDialogTitle>
            <AlertDialogDescription>
              Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin membatalkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Kembali</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm}>Lanjutkan & Batalkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isSaveAlertOpen} onOpenChange={setIsSaveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ListChecks className="text-primary"/> Konfirmasi Perubahan Hak Akses
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div>Anda akan mengubah hak akses untuk modul berikut:</div>
               <ul className="mt-2 list-disc list-inside text-foreground/80 bg-secondary/50 p-3 rounded-md">
                {changesSummary.map(change => <li key={change}>{change}</li>)}
              </ul>
            </AlertDialogDescription>
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


function MemberDetailDialog({ 
  member, 
  open, 
  isLoading,
  onOpenChange, 
  onSave, 
  onRfidSave,
  onPermissionsSave,
  onPermissionDialogOpen,
  onDelete,
  openPermissionDialogs = {}
}: { 
  member: Member | null; 
  open: boolean; 
  isLoading: boolean;
  onOpenChange: (open: boolean) => void; 
  onSave: (id: string, updatedData: Partial<Member>) => void; 
  onRfidSave: (id: string, rfid: Member['rfid']) => void;
  onPermissionsSave: (id: string, permissions: Record<Module, Permission[]>) => void;
  onPermissionDialogOpen: (id: string, open: boolean) => void;
  onDelete: (id: string) => void;
  openPermissionDialogs?: Record<string, boolean>;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Member | null>(null);
  const [originalDataOnEdit, setOriginalDataOnEdit] = useState<Member | null>(null);
  const { toast } = useToast();
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [isSaveAlertOpen, setIsSaveAlertOpen] = useState(false);
  const [changesSummary, setChangesSummary] = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { user: currentUser } = useAuth();
  
  const canEdit = useMemo(() => {
    const permissions = currentUser?.permissions?.members || [];
    return permissions.includes("update") || permissions.includes("write");
  }, [currentUser]);
  
  const canDelete = useMemo(() => currentUser?.permissions?.members?.includes("delete"), [currentUser]);
  const canManage = canEdit || canDelete;

  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    if (member) {
      const formattedMember = {
        ...member,
        dateOfBirth: formatDateForInput(member.dateOfBirth),
        joinedDate: formatDateForInput(member.joinedDate),
      };
      setFormData(formattedMember);
      setAvatarPreview(member.avatarUrl);
    }
  }, [member]);
  
  useEffect(() => {
    if (isEditMode && formData && !originalDataOnEdit) {
      setOriginalDataOnEdit(JSON.parse(JSON.stringify(formData)));
    }
  }, [isEditMode, formData, originalDataOnEdit]);
  
  useEffect(() => {
    if (!open) {
      setIsEditMode(false);
      setOriginalDataOnEdit(null);
    }
    if (!open && !isSaveAlertOpen) {
      setIsCancelAlertOpen(false);
    }
  }, [open, isSaveAlertOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleGenderChange = (value: Gender) => {
    if (formData) {
      setFormData({ ...formData, gender: value });
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
          if (formData) {
            const newAvatarUrl = reader.result as string;
            setAvatarPreview(newAvatarUrl);
            setFormData({ ...formData, avatarUrl: newAvatarUrl });
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
    if (formData.address !== originalDataOnEdit.address) changes.push("Alamat");
    if (formData.dateOfBirth !== originalDataOnEdit.dateOfBirth) changes.push("Tanggal Lahir");
    if (formData.gender !== originalDataOnEdit.gender) changes.push("Jenis Kelamin");
    if (formData.joinedDate !== originalDataOnEdit.joinedDate) changes.push("Tanggal Bergabung");
    if (formData.isActive !== originalDataOnEdit.isActive) changes.push("Status Keaktifan");
    if (formData.avatarUrl !== originalDataOnEdit.avatarUrl) changes.push("Foto Avatar");
    
    return changes;
  };

  const handleSaveClick = () => {
    const detectedChanges = checkForChanges();
    if (detectedChanges.length === 0) {
      toast({
        title: "Tidak Ada Perubahan",
        description: "Anda tidak membuat perubahan apapun.",
      });
      setIsEditMode(false);
      return;
    }

    setChangesSummary(detectedChanges);
    setIsSaveAlertOpen(true);
  };

  const executeSave = async () => {
    if (formData) {
      setIsSaving(true);
      try {
        await updateMember(formData.id, formData);
        onSave(formData.id, formData);

        setIsEditMode(false);
        setOriginalDataOnEdit(null);
        onOpenChange(false);
        toast({
          title: "Berhasil!",
          description: `Perubahan pada ${formData.name} berhasil dilakukan.`,
        });
      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan perubahan.";
         toast({
          variant: "destructive",
          title: "Gagal!",
          description: errorMessage,
        });
      } finally {
         setIsSaving(false);
         setIsSaveAlertOpen(false);
      }
    }
  };
  
  const handleCancelClick = () => {
    if (isSaving) return;
    
    const changes = checkForChanges();
    if (changes.length > 0) {
      setIsCancelAlertOpen(true);
    } else {
      setIsEditMode(false);
      setOriginalDataOnEdit(null);
    }
  };
  
  const handleCancelConfirm = () => {
    setIsEditMode(false);
    setIsCancelAlertOpen(false);
    setOriginalDataOnEdit(null);
  };
  
  const handleDialogCloseAttempt = (isOpen: boolean) => {
     if (!isOpen && isEditMode && !isSaving && !isSaveAlertOpen && !isCancelAlertOpen) {
      handleCancelClick();
      return;
    }
    onOpenChange(isOpen);
  };
  
  if (!member) return null;

  const userInitials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const currentAvatar = isEditMode ? avatarPreview : member.avatarUrl;

  const manageButton = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full" disabled={!canManage}>
            <Settings className="mr-2 h-4 w-4" />
            Kelola
          </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {canEdit && (
          <DropdownMenuItem onSelect={() => setIsEditMode(true)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Profil</span>
          </DropdownMenuItem>
        )}

        {canEdit && (
          <RfidManagementDialog
            member={member}
            onSave={onRfidSave}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Nfc className="mr-2 h-4 w-4" />
                <span>Kelola RFID</span>
            </DropdownMenuItem>
          </RfidManagementDialog>
        )}
        
        {canEdit && (
          <PermissionsDialog 
            member={member} 
            onSave={onPermissionsSave}
            open={openPermissionDialogs[member.id] || false}
            onOpenChange={(open) => onPermissionDialogOpen(member.id, open)}
          >
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onPermissionDialogOpen(member.id, true); }}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span>Hak Akses</span>
            </DropdownMenuItem>
          </PermissionsDialog>
        )}

        {canDelete && (
          <>
            {canEdit && <DropdownMenuSeparator />}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Hapus Jemaat</span>
                </DropdownMenuItem>
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
                  <AlertDialogAction onClick={() => onDelete(member.id)} className="bg-destructive hover:bg-destructive/90">Lanjutkan Hapus</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogCloseAttempt}>
        <DialogContent 
          className="sm:max-w-md"
           onInteractOutside={(e) => {
             if(isEditMode && !isSaving && !isSaveAlertOpen && !isCancelAlertOpen) {
               e.preventDefault();
               handleCancelClick();
             }
          }}
          onEscapeKeyDown={(e) => {
            if(isEditMode && !isSaving && !isSaveAlertOpen && !isCancelAlertOpen) {
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
                           <AvatarFallback className="text-primary border-primary">{userInitials}</AvatarFallback>
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
                  <Label htmlFor="address">Alamat</Label>
                  <div className="relative">
                    <HomeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="address" value={formData?.address || ''} onChange={handleInputChange} disabled={!isEditMode || isSaving} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="dateOfBirth" type="date" value={formData?.dateOfBirth || ''} onChange={handleInputChange} disabled={!isEditMode || isSaving} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                   <Label>Jenis Kelamin</Label>
                   {isEditMode ? (
                      <RadioGroup 
                        value={formData?.gender} 
                        onValueChange={(value) => handleGenderChange(value as Gender)} 
                        className="flex gap-4 pt-1"
                        disabled={isSaving}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Laki-laki" id="gender-male" />
                          <Label htmlFor="gender-male" className="font-normal">Laki-laki</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Perempuan" id="gender-female" />
                          <Label htmlFor="gender-female" className="font-normal">Perempuan</Label>
                        </div>
                      </RadioGroup>
                   ) : (
                    <div className="flex items-center pt-1">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <VenetianMask className="h-4 w-4 text-muted-foreground"/>
                        <span>{formData?.gender}</span>
                      </div>
                    </div>
                   )}
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
                      {formData?.isVerified ? (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
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
                   <div className="w-full flex gap-2">
                    {!canManage ? (
                       <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="w-full">
                            {manageButton}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Anda memerlukan akses untuk memanfaatkan fitur ini dari Admin</p>
                          </TooltipContent>
                        </Tooltip>
                       </TooltipProvider>
                    ) : (
                      manageButton
                    )}
                      <DialogClose asChild>
                        <Button type="button" variant="secondary" className="w-full">Close</Button>
                      </DialogClose>
                    </div>
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
            <AlertDialogDescription>
              <div>Apakah Anda yakin ingin menyimpan perubahan berikut?</div>
               <ul className="mt-2 list-disc list-inside text-foreground/80 bg-secondary/50 p-3 rounded-md">
                {changesSummary.map(change => <li key={change}>{change}</li>)}
              </ul>
            </AlertDialogDescription>
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

const ITEMS_PER_PAGE = 5;

export default function MembersManagementPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPermissionDialogs, setOpenPermissionDialogs] = useState<Record<string, boolean>>({});
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();

  const canCreate = useMemo(() => user?.permissions?.members?.includes("create"), [user]);

  const loadMembers = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const { data, pagination: pagInfo } = await getMembers(page, ITEMS_PER_PAGE, search);
      setMembers(data);
      setPagination(pagInfo);
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "Tidak dapat memuat data jemaat.";
      toast({
        variant: "destructive",
        title: "Gagal Memuat Data",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadMembers(currentPage, searchTerm);
  }, [currentPage, searchTerm, loadMembers]);

  const handlePermissionsSave = (id: string, permissions: Record<Module, Permission[]>) => {
     setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id ? { ...member, permissions } : member
      )
    );
     if (viewingMember && viewingMember.id === id) {
      setViewingMember(prev => prev ? { ...prev, permissions } : null);
    }
  };
  
  const handleMemberSave = (id: string, updatedData: Partial<Member>) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id ? { ...member, ...updatedData } : member
      )
    );
    if (viewingMember && viewingMember.id === id) {
        setViewingMember(prev => prev ? { ...prev, ...updatedData } : null);
    }
  };
  
  const handleRfidSave = (id: string, rfid: Member['rfid']) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id ? { ...member, rfid } : member
      )
    );
    if (viewingMember && viewingMember.id === id) {
      setViewingMember(prev => prev ? { ...prev, rfid } : null);
    }
  };


  const handlePermissionDialogOpen = (id: string, open: boolean) => {
    setOpenPermissionDialogs(prev => ({ ...prev, [id]: open }));
  };

  const handleViewMember = (member: Member) => {
    setIsDetailLoading(true);
    setViewingMember(null);
    setTimeout(() => {
      setViewingMember(member); 
      setIsDetailLoading(false);
    }, 500);
  };
  
  const handleDeleteMember = async (id: string) => {
    const memberToDelete = members.find(m => m.id === id);
    if (!memberToDelete) return;
    
    try {
        await removeMember(id);
        setMembers(prev => prev.filter(member => member.id !== id));
        setViewingMember(null);
        toast({
            title: "Berhasil Dihapus",
            description: `Jemaat dengan nama ${memberToDelete.name} telah dihapus.`,
            variant: "destructive"
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus jemaat.";
        toast({
            variant: "destructive",
            title: "Gagal Menghapus",
            description: errorMessage,
        });
    }
  };

  const handleAddNewMember = (newMember: Member) => {
    setMembers(prev => [newMember, ...prev]);
  };
  
  const totalPages = pagination ? (pagination as any).totalPages : 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    startTransition(() => {
      setCurrentPage(newPage);
    });
  };

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
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="max-w-sm bg-card"
        />
        {canCreate && (
          <AddMemberDialog 
            open={isAddMemberDialogOpen}
            onOpenChange={setIsAddMemberDialogOpen}
            onAddMember={handleAddNewMember}
          />
        )}
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
            {isLoading || isPending ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                </TableRow>
              ))
            ) : members.length > 0 ? (
              members.map(member => (
              <TableRow key={member.id} className="h-16">
                 <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Avatar className="cursor-pointer">
                        {member.avatarUrl ? (
                           <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                        ) : (
                          <AvatarFallback className="text-primary border-primary">{member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
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
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                  Tidak ada jemaat yang cocok dengan pencarian Anda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading || isPending}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading || isPending}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}
    </div>
    
    <MemberDetailDialog 
      member={viewingMember}
      open={!!viewingMember}
      isLoading={isDetailLoading}
      onOpenChange={(open) => {
          if (!open) {
              setViewingMember(null);
          }
      }}
      onSave={handleMemberSave}
      onRfidSave={handleRfidSave}
      onPermissionsSave={handlePermissionsSave}
      onPermissionDialogOpen={handlePermissionDialogOpen}
      onDelete={handleDeleteMember}
      openPermissionDialogs={openPermissionDialogs}
    />
    </>
  );
}
