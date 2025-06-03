'use client'

import { useRoute } from '@/composable/useRoute'
import MenuSidebar from '../MenuSidebar'
import { FolderGit2 } from 'lucide-react'

export default function ListMenu() {
  const route = useRoute()
  const menu = [
    {
      id: '0',
      name: 'Category',
      href: '/admin/category',
      icon: () => <FolderGit2 />,
    },
  ]

  return <MenuSidebar menu={menu} route={route} />
}
