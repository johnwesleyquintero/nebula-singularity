import React from 'react';
import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import authOptions from "@/pages/api/auth/[...nextauth].js"
import { DashboardSidebarWrapper } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

interface User {
  id: string;
  name?: string | null;
  // Add other user properties as needed
}

interface Session {
  user?: User;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session: Session | null = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  return (
    <DashboardSidebarWrapper user={session.user}>
      <Header user={session.user} />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </DashboardSidebarWrapper>
  )
}
