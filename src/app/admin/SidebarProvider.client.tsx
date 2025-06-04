'use client'

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { FolderGit2 } from 'lucide-react'
import { useState } from 'react'

export function SidebarProviderClient({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  const menu = [
    {
      id: '0',
      title: 'Category',
      href: '/admin/category',
      icon: () => <FolderGit2 />,
    },
  ]
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar>
        <SidebarHeader />
        <SidebarGroupContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuSubButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroup />
        </SidebarGroupContent>
      </Sidebar>
      {children}
    </SidebarProvider>
  )
}
