import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { Metadata } from 'next'
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import type React from "react"



import { Header } from "@/components/dashboard/header"
import { DashboardSidebarWrapper } from "@/components/dashboard/sidebar"

export const metadata: Metadata = {
  title: "Seller Tools | SellSmart-Pro",
  description: "Interactive tools to help Amazon sellers optimize their business",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardSidebarWrapper user={session.user}>
      <Header user={session.user} />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </DashboardSidebarWrapper>
  )
}

