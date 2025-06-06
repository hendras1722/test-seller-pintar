'use client'

import Body from '@/components/client/Body'
import { LogOut, Newspaper, Tag } from 'lucide-react'
import ArrayMap from '@/components/ArrayMap'
import Profile from './Profile'
import { useRoute } from '@/composable/useRoute'
import RouteLink from '@/components/route'
import Cookies from 'js-cookie'
import { cn } from '@/utils/lib'
import { Else, If } from '@/components/if'
import { IconLogoLight } from '@/components/Icon'

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
  const route = useRoute()

  return (
    <Body>
      <div className="min-h-screen  flex w-full">
        <div className="w-[267px] bg-blue-600 min-h-screen px-4 py-6">
          <IconLogoLight />
          <div className="mt-6">
            <ul>
              <ArrayMap
                of={menu}
                render={(item, index) => (
                  <If condition={index === 2} key={'menu' + index}>
                    <button
                      key={'menu' + index}
                      className="mt-2 rounded-lg px-4 py-2 text-white flex items-center gap-2"
                    >
                      <item.icon /> <span>{item.title}</span>
                    </button>
                    <Else key={'else'}>
                      <li key={'menu' + index}>
                        <RouteLink
                          href={item.href}
                          className={cn(
                            'rounded-lg py-2 px-4 text-white flex items-center gap-2',
                            index === 1 && 'my-2'
                          )}
                          active={route.pathname === item.href}
                        >
                          <item.icon /> <span>{item.title}</span>
                        </RouteLink>
                      </li>
                    </Else>
                  </If>
                )}
              />
            </ul>
          </div>
        </div>
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
          <div className="p-2 flex justify-between items-center px-6 py-[21px] w-full">
            <h5>Articles</h5>
            <Profile>
              <span className="text-black">
                {getMe && JSON.parse(getMe).username}
              </span>
            </Profile>
          </div>
          <hr className="-ml-5 -mr-5" />
          <div className="flex-1 p-5 bg-slate-100">{children}</div>
        </main>
      </div>
    </Body>
  )
}
