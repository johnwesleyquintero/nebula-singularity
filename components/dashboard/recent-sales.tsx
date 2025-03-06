"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from 'react'

interface Sale {
  name: string
  email: string
  amount: string
  initials: string
}

const SaleItem = ({ sale }: { sale: Sale }) => (
  <div className="flex items-center">
    <Avatar className="h-9 w-9">
      <AvatarFallback>{sale.initials}</AvatarFallback>
    </Avatar>
    <div className="ml-4 space-y-1">
      <p className="text-sm font-medium leading-none">{sale.name}</p>
      <p className="text-sm text-muted-foreground">{sale.email}</p>
    </div>
    <div className="ml-auto font-medium">{sale.amount}</div>
  </div>
)

export function RecentSales() {
  const sales: Sale[] = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      amount: '+$249.00',
      initials: 'JD'
    },
    {
      name: 'Jane Miller',
      email: 'jane.miller@example.com',
      amount: '+$149.00',
      initials: 'JM'
    },
    {
      name: 'Robert Williams',
      email: 'robert.williams@example.com',
      amount: '+$99.00',
      initials: 'RW'
    },
    {
      name: 'Sarah Davis',
      email: 'sarah.davis@example.com',
      amount: '+$39.00',
      initials: 'SD'
    }
  ]

  return (
    <div className="space-y-8">
      {sales.map((sale) => (
        <SaleItem key={sale.email} sale={sale} />
      ))}
    </div>
  )
}
