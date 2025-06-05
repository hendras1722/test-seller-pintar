'use client'

import List from './List'
import { Suspense, use } from 'react'
import { getArticle } from '@/api/article'
import { format, subDays } from 'date-fns'
import Loading from '@/components/server/loading'

export default function Category() {
  return (
    <Suspense fallback={<Loading />}>
      <List article={{ data: [], limit: 0, page: 0, total: 0 }} />
    </Suspense>
  )
}

export const dynamic = 'force-dynamic'

export const experimental_ppr = true
