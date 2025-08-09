
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { History, Church, QrCode, Home, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NavLink = ({ href, icon: Icon, label }: { href: string, icon: React.ElementType, label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={cn("flex flex-col items-center justify-center w-16 text-center hover:text-primary", isActive ? "text-primary" : "text-foreground/70")}>
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-xs">{label}</span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const scanIsActive = pathname === '/scanner';

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border/50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        <NavLink href="/" icon={Home} label="Home" />
        <NavLink href="/attendance" icon={History} label="Absenku" />
        
        <div className="relative w-16 h-full flex items-center justify-center">
           <Link href="/scanner" className="absolute bottom-5 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-card rounded-full transform scale-110"></div>
                 <Button 
                    size="icon" 
                    className={cn(
                        "relative w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200",
                        "hover:bg-card hover:text-primary",
                        "active:bg-primary/90 active:scale-95"
                    )}
                 >
                  <QrCode className="w-9 h-9" />
                </Button>
              </div>
            <span className={cn("text-xs mt-2", scanIsActive ? "text-primary" : "text-foreground/70")}>Scan</span>
          </Link>
        </div>
        
        <NavLink href="/services" icon={Church} label="Tentang" />
        <NavLink href="/profile" icon={UserCircle} label="Profil" />
      </div>
    </nav>
  );
}
