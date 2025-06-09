'use client'

import React, { Suspense, useEffect } from 'react'
import { LogOut, Newspaper, Tag } from 'lucide-react'
import { cn } from '@/utils/lib'
import { IconLogoWhite } from './Icon'
import ListMenu from './ListMenu'
import { useClickOutside } from '@msa_cli/react-composable'
import { getBreakpointValue } from '@/composable/useTailwind'

export default function SidebarComponent({
  show,
  setShow,
}: Readonly<{ show: boolean; setShow: (value: boolean) => void }>) {
  const sidebarRef = React.useRef<HTMLDivElement>(null)

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

  const isLg = getBreakpointValue('lg')
  const handleClickOutside = (event: PointerEvent | FocusEvent) => {
    setShow(false)
  }

  const modalRef = useClickOutside<HTMLDivElement>(handleClickOutside, {
    ignore: ['.ignore-me'],
    detectIframe: true,
  })

  useEffect(() => {
    if (modalRef.current) {
      sidebarRef.current = modalRef.current
    }
    const handleResize = () => {
      if (isLg <= window.innerWidth) {
        modalRef.current = null
        setShow(true)
      } else {
        modalRef.current = sidebarRef.current as HTMLDivElement
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [isLg])

  return (
    <div
      ref={modalRef}
      className={cn(
        'w-[267px] bg-blue-600 lg:block ease-in-out duration-300 min-h-screen px-4 py-6 lg:static fixed z-[9999]',
        show ? 'translate-x-0' : '-translate-x-full'
      )}
    >
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
  )
}
