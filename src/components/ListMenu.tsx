'use client'

import { Suspense } from 'react'
import { Else, If } from './if'
import ArrayMap from './ArrayMap'
import { cn } from '@/utils/lib'
import RouteLink from './route'
import { useRoute } from '@/composable/useRoute'

interface MenuItem {
  name: string
  href?: string
  icon: () => React.ReactElement
  children?: MenuItem[]
}

interface DropdownItem {
  title: string
  href: string
  icon: () => React.ReactElement
  children?: MenuItem[]
  id?: string // Tambahkan id
}

export default function ListMenu({ menu }: Readonly<{ menu: DropdownItem[] }>) {
  const route = useRoute()
  return (
    <ArrayMap
      of={menu}
      render={(item, index) => (
        <If condition={index === 2} key={'menu' + index}>
          <button
            key={'menu' + index}
            className="mt-2 rounded-lg px-4 py-2 text-white  text-[16px] flex items-center gap-5"
          >
            <item.icon /> <span>{item.title}</span>
          </button>
          <Else key={'else'}>
            <li key={'menu' + index}>
              <RouteLink
                href={item.href}
                className={cn(
                  'rounded-lg py-2 px-4 text-white text-[16px] flex items-center gap-5',
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
  )
}
