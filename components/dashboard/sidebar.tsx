import React, { KeyboardEvent } from 'react';
"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  BarChart3,
  LayoutDashboard,
  Package,
  Settings,
  FileText,
  CreditCard,
  Users,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { signOut } from "next-auth/react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

interface User {
  name?: string | null
  email?: string | null
  role?: string | null
}

interface DashboardSidebarWrapperProps {
  children: React.ReactNode
  user: User
}

interface SidebarRoute {
  title: string;
  href: string;
  icon: React.ComponentType;
  variant: string;
  role?: UserRole;
}

type UserRole = 'admin' | 'user';

const SidebarHeaderComponent = () => (
  <SidebarHeader className="flex h-14 items-center border-b px-4">
    <Link href="/dashboard" className="flex items-center gap-2">
      <div className="relative h-6 w-6">
        <Image src="/android-chrome-192x192.png" alt="Nebula-Suite Logo" fill priority className="rounded-md object-contain" />
      </div>
      <span className="text-lg font-semibold">Nebula-Suite</span>
    </Link>
    <SidebarTrigger className="ml-auto h-8 w-8 lg:hidden" />
  </SidebarHeader>
);

const SidebarFooterComponent = () => (
  <SidebarFooter>
    <SidebarSeparator />
    <div className="p-4">
      <Button variant="outline" className="w-full justify-start" onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </Button>
    </div>
  </SidebarFooter>
);

const renderRoute = (route: SidebarRoute, pathname: string, userRole?: UserRole) => {
  if (route.role === 'admin' && userRole !== 'admin') return null;

  return (
    <SidebarMenuItem key={route.href}>
      <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.title}>
        <Link href={route.href}>
          <route.icon className="h-5 w-5" />
          <span>{route.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const DashboardSidebar = ({ user, className, ...props }: SidebarNavProps) => {
  const pathname = usePathname();

  const routes: SidebarRoute[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      variant: "default",
    },
    {
      title: "Analytics",
      href: "/analytics/ppc",
      icon: BarChart3,
      variant: "default",
    },
    {
      title: "Products",
      href: "/products",
      icon: Package,
      variant: "default",
    },
    {
      title: "Reports",
      href: "/reports",
      icon: FileText,
      variant: "default",
    },
    {
      title: "Billing",
      href: "/billing",
      icon: CreditCard,
      variant: "default",
      role: "admin",
    },
    {
      title: "Team",
      href: "/team",
      icon: Users,
      variant: "default",
      role: "admin",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      variant: "default",
    },
    {
      title: "Help",
      href: "/help",
      icon: HelpCircle,
      variant: "default",
    },
  ]

  return (
    <Sidebar className={cn("border-r", className)} {...props}>
      <SidebarHeaderComponent />
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <SidebarMenu>
            {routes.map((route) => renderRoute(route, pathname, user?.role as UserRole))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooterComponent />
    </Sidebar>
  )
}

export function DashboardSidebarWrapper({ children, user }: DashboardSidebarWrapperProps) {
  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <DashboardSidebar user={user} />
        <div className="flex flex-col">{children}</div>
      </div>
    </SidebarProvider>
  )
}
