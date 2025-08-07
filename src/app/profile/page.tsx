
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
              <h3 className="font-headline text-lg text-primary">Contact Information</h3>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Phone Number</p>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Email Address</p>
                  <p>john.doe@example.com</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-headline text-lg text-primary">Membership Details</h3>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Member Since</p>
                  <p>January 15, 2020</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Status</p>
                  <p>Active</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full"><Edit /> Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" defaultValue="John Doe" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">Phone</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                       <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={() => setIsDialogOpen(false)}>Save changes</Button>
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
