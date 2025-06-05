'use client'

import List from './List'
import { Suspense } from 'react'

export default function Category() {
  return (
    <Suspense>
      <List article={{ data: [], limit: 0, page: 0, total: 0 }} />
    </Suspense>
  )
}

export const dynamic = 'force-dynamic'

export const experimental_ppr = true
