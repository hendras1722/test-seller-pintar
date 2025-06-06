'use client'

import ArrayMap from '@/components/ArrayMap'
import { useRoute } from '@/composable/useRoute'
import { ListCategory as InterfaceCategory } from '@/type/category'
import { useRouter } from 'next/navigation'

export default function ListCategory({
  category,
}: {
  readonly category: InterfaceCategory[]
}) {
  const router = useRouter()
  const route = useRoute()
  const handleSearch = (item) => {
    if (route.searchParams.get('q')) {
      router.push(
        '/article?category=' + item.id + '&q=' + route.searchParams.get('q')
      )
    }
    router.push('/article?category=' + item.id)
  }
  return (
    <ArrayMap
      of={category}
      render={(item, index) => (
        <li
          onClick={() => handleSearch(item)}
          key={index}
          className="min-w-auto p-2 text-[12px] text-center border-r border-gray-400 pr-3"
        >
          {item.name}
        </li>
      )}
    />
  )
}
