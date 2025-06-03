'use client'

import { cn } from '@/utils/lib'
import ArrayMap from './ArrayMap'
import RouteLink from '@/components/route'
import { useRoute } from '@/composable/useRoute'
import { useState } from 'react'
import { Else, If } from './if'
import MenuDropdown from './MenuDropdown'

interface MenuItem {
  id?: string
  name: string
  href?: string
  icon: () => React.ReactElement
}

interface DropdownItem {
  id?: string
  name: string
  href?: string
  icon: () => React.ReactElement
  children?: MenuItem[]
}

export default function MenuSidebar({
  menu,
  route,
}: Readonly<{
  menu: DropdownItem[]
  route: ReturnType<typeof useRoute>
}>) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id))
  }

  return (
    <div className="mt-8 relative">
      <ArrayMap
        of={menu}
        render={(item, index) => (
          <If
            key={index}
            condition={!!(item.children && item.children.length > 0)}
          >
            <MenuDropdown
              item={item}
              isOpen={openDropdownId === item.id}
              onToggle={toggleDropdown}
            />
            <Else key={index}>
              <RouteLink
                href={item.href ?? ''}
                className={cn(
                  'py-3 px-5 first:mt-0 mt-2 flex gap-3 items-center cursor-pointer transition-all duration-200',
                  route.pathname === item.href
                    ? 'bg-gray-200 border-l-4 border-gray-400 dark:bg-transparent dark:border-transparent dark:text-white'
                    : 'hover:bg-gray-100 hover:border-l-4 hover:border-gray-400 hover:dark:bg-transparent hover:dark:border-none hover:dark:border-transparent'
                )}
                active={route.pathname === item.href}
              >
                <div className="text-nowrap text-lg flex w-full h-full items-center gap-3 pl-1">
                  <div>{item.icon()}</div>
                  {item.name}
                </div>
              </RouteLink>
            </Else>
          </If>
        )}
      />
    </div>
  )
}
