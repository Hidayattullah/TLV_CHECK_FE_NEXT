import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p>This is a temporary home page.</p>
      <div className="flex gap-4">
        <Link href="/login" passHref>
          <Button>Go to Login</Button>
        </Link>
        <Link href="/register" passHref>
          <Button variant="outline">Go to Register</Button>
        </Link>
      </div>
    </div>
  );
}
