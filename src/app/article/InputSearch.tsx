'use client'

import { Input } from '@/components/ui/input'
import { useRoute } from '@/composable/useRoute'
import { useRouter } from 'next/navigation'
import { title } from 'process'
import { debounce, select } from 'radash'
import React, { useEffect } from 'react'

export default function InputSearch() {
  const router = useRouter()
  const route = useRoute()
  const [search, setSearch] = React.useState('')

  const handleSearch = debounce({ delay: 300 }, async (e) => {
    setSearch(e.target.value)
  })
  useEffect(() => {
    fetchData(search)
  }, [search])
  async function fetchData(e) {
    const searchParams = new URLSearchParams(route.searchParams)
    if (searchParams.get('page') === null) searchParams.set('page', '')
    if (searchParams.get('title') === null) searchParams.set('title', '')
    if (searchParams.get('category') === null) searchParams.set('category', '')

    searchParams.set('title', e ?? search)
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`
    router.push(newUrl)
  }
  return (
    <Input
      onChange={handleSearch}
      placeholder={'Search'}
      className=" bg-white pl-10 w-full"
    />
  )
}
