"use client"

import { useSession } from "next-auth/react"
import type { ReactNode } from "react"

interface RoleGateProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}

export function RoleGate({ children, allowedRoles, fallback }: RoleGateProps) {
  const { data: session } = useSession()

  if (!session?.user?.role) {
    return fallback || null
  }

  const isAllowed = allowedRoles.includes(session.user.role)

  if (!isAllowed) {
    return fallback || null
  }

  return <>{children}</>
}

