
"use client";

import { AuthGuard } from "@/components/common/auth-guard";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
