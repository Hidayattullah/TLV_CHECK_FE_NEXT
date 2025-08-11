
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { Edit, Trash2, ShieldCheck, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Permission = "read" | "edit" | "delete";
type Module = "members" | "attendance" | "prayers" | "questions";

type Member = {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  isActive: boolean;
  permissions: Record<Module, Permission[]>;
};

const initialMembers: Member[] = [
  {
    id: "1",
    name: "Tubagus Rifan",
    email: "tubagus@example.com",
    joinedDate: "2023-01-15",
    isActive: true,
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
    joinedDate: "2023-02-20",
    isActive: false,
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
    joinedDate: "2022-11-10",
    isActive: true,
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

function PermissionsDialog({ member, onSave }: { member: Member; onSave: (id: string, permissions: Record<Module, Permission[]>) => void; }) {
  const [currentPermissions, setCurrentPermissions] = useState(member.permissions);
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    if(!open) {
      // Reset permissions to original if dialog is closed without saving
      setCurrentPermissions(member.permissions);
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <ShieldCheck className="mr-2 h-4 w-4" />
          Kelola Akses
        </Button>
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
           <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>Batal</Button>
          <Button type="button" onClick={handleSave}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function MembersManagementPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");

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
  
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tgl Bergabung</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map(member => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.joinedDate}</TableCell>
                <TableCell className="text-center">
                   <div className="flex flex-col items-center">
                    <Switch
                      checked={member.isActive}
                      onCheckedChange={(checked) => handleStatusChange(member.id, checked)}
                      aria-label="User status"
                    />
                    <Badge variant={member.isActive ? "default" : "secondary"} className="mt-1 w-[60px] justify-center">
                      {member.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <PermissionsDialog member={member} onSave={handlePermissionsSave} />
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
