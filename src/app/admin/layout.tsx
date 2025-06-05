'use client'

import Body from '@/components/client/Body'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { FolderGit2, Newspaper } from 'lucide-react'
import ArrayMap from '@/components/ArrayMap'
import Profile from './Profile'
import Cookies from 'js-cookie'

export default async function RootLayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = Cookies.get('token')
  const getMe = cookieStore
  const menu = [
    {
      id: '0',
      title: 'Category',
      href: '/admin/category',
      icon: () => <FolderGit2 />,
    },
    {
      id: '1',
      title: 'Article',
      href: '/admin/article',
      icon: () => <Newspaper />,
    },
  ]

  return (
    <Body>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader />
          <SidebarContent>
            <SidebarGroupContent>
              <SidebarMenu>
                <ArrayMap
                  of={menu}
                  render={(item, index) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                />
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroup />
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="p-2 flex justify-between w-full">
            <SidebarTrigger />
            <div className="flex gap-3">
              <div className="block">
                <p className="text-[16px]">
                  {getMe ? JSON.parse(getMe).username : null}
                </p>
                <small> {getMe ? JSON.parse(getMe).role : null}</small>
              </div>
              <Profile />
            </div>
          </div>
          <hr className="-ml-5 -mr-5" />
          <div className=" flex-1 p-5">{children}</div>
        </main>
      </SidebarProvider>
    </Body>
  )
}
