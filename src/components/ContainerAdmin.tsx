'use client'

import { cn } from '@/utils/lib'

export default function ContainerAdmin({
  children,
  className,
}: Readonly<{
  children: React.ReactNode
  className?: string
}>) {
  return (
    <div
      className={cn(
        'border border-slate-200 rounded-lg bg-white pb-5',
        className
      )}
    >
      {children}
    </div>
  )
}
