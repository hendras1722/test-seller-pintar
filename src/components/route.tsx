'use client'

import Link from 'next/link'
import { cn } from '@/utils/lib'

export default function RouteLink({
  href,
  children,
  active,
  className,
}: Readonly<{
  href: string
  children: React.ReactNode
  active?: boolean
  className?: string
}>) {
  const cnActive = active
    ? 'text-blue-600 bg-blue-500 text-black font-bold'
    : ''
  return (
    <Link href={href} className={cn(cnActive, ' no-underline ', className)}>
      {children}
    </Link>
  )
}
