import Body from '@/components/client/Body'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Generated by create next app',
}

export default function RootLayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Body>
      <div className="min-h-screen">{children}</div>
    </Body>
  )
}
