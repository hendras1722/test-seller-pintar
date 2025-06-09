'use client'

import Body from '@/components/client/Body'
import Cookies from 'js-cookie'
import React, { Suspense } from 'react'
import Profile from '@/components/client/Profile'
import SidebarComponent from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export default function RootLayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const getMe = Cookies.get('me')
  // const menu = [
  //   {
  //     id: '0',
  //     title: 'Article',
  //     href: '/admin/article',
  //     icon: () => <Newspaper />,
  //   },
  //   {
  //     id: '1',
  //     title: 'Category',
  //     href: '/admin/category',
  //     icon: () => <Tag />,
  //   },
  //   {
  //     id: '2',
  //     title: 'Logout',
  //     href: '/login',
  //     icon: () => <LogOut />,
  //   },
  // ]

  const [show, setShow] = React.useState(false)

  return (
    <Body>
      <div className="min-h-screen  flex w-full">
        <SidebarComponent show={show} setShow={setShow} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
          <div className="p-2 flex justify-between items-center px-6 py-[21px] w-full">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShow(!show)}
                className="lg:hidden block border border-gray-300 bg-transparent hover:bg-transparent text-black shadow-none focus:ring-0"
              >
                <Menu />
              </Button>

              <h5>Articles</h5>
            </div>
            <Suspense>
              <Profile>
                <span className="text-black">
                  {getMe && JSON.parse(getMe).username}
                </span>
              </Profile>
            </Suspense>
          </div>
          <hr className="-ml-5 -mr-5" />
          <div className="flex-1 p-5 bg-slate-100">{children}</div>
        </main>
      </div>
    </Body>
  )
}
