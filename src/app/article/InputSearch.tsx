'use client'

import { Input } from '@/components/ui/input'
import { useRoute } from '@/composable/useRoute'
import { useRouter } from 'next/navigation'
import { title } from 'process'
import { debounce } from 'radash'
import React from 'react'

export default function InputSearch() {
  const router = useRouter()
  const route = useRoute()
  const [search, setSearch] = React.useState('')

  const handleSearch = debounce({ delay: 200 }, async (e) => {
    setSearch(e.target.value)
  })
  async function fetchData(e) {
    if (e.key !== 'Enter') return
    if (route.searchParams.get('category') || route.searchParams.get('page')) {
      let searchParams = {
        page: route.searchParams.get('page') ?? undefined,
        title: route.searchParams.get('title') ?? undefined,
        category: route.searchParams.get('category') ?? undefined,
      }
      router.push(
        '/article?category=' +
          searchParams.category +
          '&title=' +
          search +
          '&page=1&title=' +
          title
      )
      return
    }
    if (!search) return router.push('/article')
    router.push('/article?title=' + search)
  }
  return (
    <Input
      onChange={handleSearch}
      onKeyDown={fetchData}
      placeholder={'Search'}
      className="lg:w-[30%] w-full "
    />
  )
}
