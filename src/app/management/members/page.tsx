
"use client";

import React, { useState } from "react";
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
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, ShieldCheck, UserPlus, User, Mail, CalendarDays, KeyRound, Loader2, Save, Phone, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

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
    avatarUrl: "https://placehold.co/40x40.png",
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
    avatarUrl: "https://placehold.co/40x40.png",
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
    avatarUrl: "https://placehold.co/40x40.png",
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
  onOpenChange, 
  onSave, 
  onPermissionsSave,
  onPermissionDialogOpen,
  onStatusChange,
}: { 
  member: Member | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSave: (updatedMember: Member) => void; 
  onPermissionsSave: (id: string, permissions: Record<Module, Permission[]>) => void;
  onPermissionDialogOpen: (id: string, open: boolean) => void;
  onStatusChange: (id: string, isActive: boolean) => void;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(member);

  React.useEffect(() => {
    setFormData(member);
    if (!open) {
      setIsEditMode(false);
    }
  }, [member, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };
  
  const handleStatusToggle = () => {
    if (formData) {
       const newStatus = !formData.isActive;
       setFormData({ ...formData, isActive: newStatus });
       onStatusChange(formData.id, newStatus);
    }
  };

  const handleSave = () => {
    if (formData) {
      setIsSaving(true);
      // Simulate API call
      setTimeout(() => {
        onSave(formData);
        setIsSaving(false);
        setIsEditMode(false);
        onOpenChange(false);
      }, 1500);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Jemaat</DialogTitle>
          <DialogDescription>
            Lihat atau perbarui informasi jemaat di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="name" value={formData?.name} onChange={handleInputChange} disabled={!isEditMode || isSaving} className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" value={formData?.email} onChange={handleInputChange} disabled={!isEditMode || isSaving} className="pl-9" />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="phoneNumber">No. Telepon</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="phoneNumber" type="tel" value={formData?.phoneNumber} onChange={handleInputChange} disabled={!isEditMode || isSaving} className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="joinedDate">Tanggal Bergabung</Label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="joinedDate" type="date" value={formData?.joinedDate} onChange={handleInputChange} disabled={!isEditMode || isSaving} className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status Verifikasi</Label>
             <div className="flex items-center">
              <Badge variant={formData?.isVerified ? "default" : "secondary"}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {formData?.isVerified ? 'Terverifikasi OTP' : 'Belum Verifikasi'}
              </Badge>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:justify-between sm:gap-0">
          {isEditMode ? (
            <>
            <div>
              <Button type="button" variant={formData?.isActive ? "destructive" : "default"} onClick={handleStatusToggle} disabled={isSaving}>
                {formData?.isActive ? 'Nonaktifkan' : 'Aktifkan'} User
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsEditMode(false)} disabled={isSaving}>
                Batal
              </Button>
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
            </>
          ) : (
            <>
              <div>
                <Button type="button" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </Button>
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
      </DialogContent>
    </Dialog>
  );
}


export default function MembersManagementPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPermissionDialogs, setOpenPermissionDialogs] = useState<Record<string, boolean>>({});
  const [viewingMember, setViewingMember] = useState<Member | null>(null);

  const handleStatusChange = (id: string, isActive: boolean) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id ? { ...member, isActive } : member
      )
    );
  };

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
    setViewingMember(member);
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
                        <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{member.name}</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center items-center p-4">
                        <Image src={member.avatarUrl.replace('40x40', '400x400')} alt={`Avatar of ${member.name}`} width={400} height={400} className="rounded-lg" data-ai-hint="person portrait"/>
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
                    <Badge variant={member.isActive ? "default" : "secondary"} className="w-[60px] justify-center">
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
      onOpenChange={(open) => !open && setViewingMember(null)}
      onSave={handleMemberSave}
      onPermissionsSave={handlePermissionsSave}
      onPermissionDialogOpen={handlePermissionDialogOpener}
      onStatusChange={handleStatusChange}
    />
    </>
  );
}
