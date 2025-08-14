
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { History, Church, HeartHandshake, MessageSquareQuote, ClipboardList, Loader2 } from "lucide-react";
import { UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomNav } from "@/components/common/bottom-nav";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useMemo } from "react";
import { AuthGuard } from "@/components/common/auth-guard";

const mainMenuItems = [
  { href: "/check-in", label: "Check In", icon: History },
  { href: "/services", label: "Tentang Kita", icon: Church },
  { href: "/faq", label: "Pertanyaan", icon: MessageSquareQuote },
  { href: "/prayer-support", label: "Dukungan Doa", icon: HeartHandshake },
];

const managementMenuItem = { 
  href: "/management", 
  label: "Manajemen", 
  icon: ClipboardList,
  requiredPermission: true 
};

const MenuItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => (
  <Link href={href} passHref>
    <Card className="bg-card hover:bg-accent/50 transition-colors duration-200 aspect-square flex flex-col items-center justify-center p-4 text-center rounded-2xl shadow-md">
      <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
        <Icon className="w-10 h-10 text-primary" />
        <p className="text-sm font-semibold text-foreground/80">{label}</p>
      </CardContent>
    </Card>
  </Link>
);


function DashboardContentPage() {
  const { user, isLoading } = useAuth();
  
  const hasManagementAccess = useMemo(() => {
    if (!user || !user.permissions) return false;
    // Check if user has any permission in any of the management modules
    return Object.values(user.permissions).some(modulePermissions => modulePermissions.length > 0);
  }, [user]);

  const userName = user?.name || "Guest";
  const userInitials = userName.split(' ').map(n => n[0]).join('');
  const userAvatarUrl = user?.avatarUrl || "";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <Loader2 className="w-12 h-12 animate-spin text-primary-foreground" />
      </div>
    )
  }

  return (
    <div className="bg-primary min-h-screen flex flex-col relative overflow-hidden pb-24">
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-0 w-full h-1/2">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/10 rounded-full" />
        <div className="absolute top-10 right-0 w-3/4 h-1/2 bg-white/5 rounded-full" />
      </div>

      <header className="p-4 flex items-center justify-between text-white relative z-10">
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Avatar className="w-12 h-12 cursor-pointer">
                {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt={userName} data-ai-hint="person portrait" />}
                <AvatarFallback className="text-primary-foreground border-primary-foreground">{userInitials}</AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{userName}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center items-center p-4 min-h-[100px]">
                  {userAvatarUrl ? (
                    <Image src={userAvatarUrl} alt={`Avatar of ${userName}`} width={400} height={400} className="rounded-lg" data-ai-hint="person portrait"/>
                  ) : (
                    <p className="text-muted-foreground">{userName} belum mengunggah foto.</p>
                  )}
                </div>
              </DialogContent>
          </Dialog>
          <div>
            <p className="text-sm">Shalom,</p>
            <h1 className="font-bold text-lg">{userName}</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full mt-4 z-10">
        <div className="bg-card w-full flex-grow p-6 rounded-3xl shadow-lg space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mainMenuItems.map((item) => (
              <MenuItem key={item.href} {...item} />
            ))}
            {hasManagementAccess && <MenuItem {...managementMenuItem} />}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}


export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContentPage />
    </AuthGuard>
  );
}
