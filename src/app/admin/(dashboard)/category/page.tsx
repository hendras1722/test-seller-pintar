'use client'

import List from './List'
import { Suspense } from 'react'

export default function Category() {
  return (
    <Suspense>
      <List
        category={{ data: [], totalData: 0, currentPage: 0, totalPages: 0 }}
      />
    </Suspense>
  )
}
