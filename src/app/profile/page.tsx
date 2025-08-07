
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
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
              <h3 className="font-headline text-lg text-primary/80">Contact Information</h3>
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
              <h3 className="font-headline text-lg text-primary/80">Membership Details</h3>
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
               <Button variant="outline" className="w-full"><Edit /> Edit Profile</Button>
               <Button variant="secondary" className="w-full"><LogOut /> Logout</Button>
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
