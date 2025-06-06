'use client'

import Body from '@/components/client/Body'
import { LogOut, Newspaper, Tag } from 'lucide-react'
import ArrayMap from '@/components/ArrayMap'
import RouteLink from '@/components/route'
import Cookies from 'js-cookie'
import { cn } from '@/utils/lib'
import { Else, If } from '@/components/if'
import { IconLogoWhite } from '@/components/Icon'
import { Suspense } from 'react'
import ListMenu from '@/components/ListMenu'
import Profile from '@/components/client/Profile'

export default function RootLayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const getMe = Cookies.get('me')
  const menu = [
    {
      id: '0',
      title: 'Article',
      href: '/admin/article',
      icon: () => <Newspaper />,
    },
    {
      id: '1',
      title: 'Category',
      href: '/admin/category',
      icon: () => <Tag />,
    },
    {
      id: '2',
      title: 'Logout',
      href: '/login',
      icon: () => <LogOut />,
    },
  ]

  return (
    <Body>
      <div className="min-h-screen  flex w-full">
        <div className="w-[267px] bg-blue-600 min-h-screen px-4 py-6">
          <div className="flex justify-start w-full pl-5">
            <IconLogoWhite />
          </div>
          <div className="mt-6">
            <ul>
              <Suspense>
                <ListMenu menu={menu} />
              </Suspense>
            </ul>
          </div>
        </div>
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
          <div className="p-2 flex justify-between items-center px-6 py-[21px] w-full">
            <h5>Articles</h5>
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
