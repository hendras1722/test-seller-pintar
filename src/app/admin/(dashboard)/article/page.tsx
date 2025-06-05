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
