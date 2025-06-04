'use client'

import { Input } from '@/components/ui/input'
import { useRoute } from '@/composable/useRoute'
import { useRouter } from 'next/navigation'
import { debounce } from 'radash'
import React from 'react'

export default function InputSearch() {
  const router = useRouter()
  const route = useRoute()
  const [search, setSearch] = React.useState('')

  const handleSearch = debounce({ delay: 500 }, async (e) => {
    setSearch(e.target.value)
  })
  async function fetchData(e) {
    if (e.key !== 'Enter') return
    if (route.searchParams.get('category') || route.searchParams.get('page')) {
      router.push(
        '/article?category=' +
          route.searchParams.get('category') +
          '&title=' +
          search +
          '&page=1'
      )
      return
    }
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
