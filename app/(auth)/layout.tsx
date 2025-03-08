import React from "react";
import Image from "next/image"
import Link from "next/link"
import { ModeToggle } from "../../components/mode-toggle"

'use client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
