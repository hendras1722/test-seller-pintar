'use client'

import { getCategory } from '@/api/category'
import List from './List'
import { Suspense, use } from 'react'
import Loading from '@/components/server/loading'

export default function Category() {
  return (
    <Suspense fallback={<Loading />}>
      <List
        category={{ data: [], totalData: 0, currentPage: 0, totalPages: 0 }}
      />
    </Suspense>
  )
}

export const dynamic = 'force-dynamic'

export const experimental_ppr = true
