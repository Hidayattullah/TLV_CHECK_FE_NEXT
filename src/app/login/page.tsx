import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">Login</CardTitle>
          <CardDescription>Enter your phone number to receive a one-time password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
              <Button variant="secondary">Send OTP</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp">One-Time Password</Label>
            <Input id="otp" type="text" placeholder="Enter OTP" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">Login</Button>
           <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" prefetch={false} className="underline text-primary/80 hover:text-primary">
              Register here
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
