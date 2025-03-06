"use client"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/dashboard/user-nav"
import { SidebarTrigger } from "@/components/ui/sidebar"
import React from "react"

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface HeaderProps {
  user: User
}

const SearchBar = () => (
  <form className="hidden md:block">
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
      />
    </div>
  </form>
)

const Notifications = () => (
  <Button variant="ghost" size="icon" className="relative">
    <Bell className="h-5 w-5" />
    <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-accent" />
    <span className="sr-only">Notifications</span>
  </Button>
)

const HeaderControls = ({ user }: { user: User }) => (
  <div className="flex items-center gap-2">
    <Notifications />
    <ModeToggle />
    <UserNav user={user} />
  </div>
)

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="lg:hidden" />
      <div className="w-full flex-1">
        <SearchBar />
      </div>
      <HeaderControls user={user} />
    </header>
  )
}
