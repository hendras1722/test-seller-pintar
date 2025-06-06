'use client'

import ContainerAdmin from '@/components/ContainerAdmin'
import List from './List'
import { Suspense } from 'react'

export default function AdminArticle() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContainerAdmin>
        <Suspense fallback={<div>Loading article list...</div>}>
          <List />
        </Suspense>
      </ContainerAdmin>
    </Suspense>
  )
}
