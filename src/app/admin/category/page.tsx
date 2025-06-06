'use client'

import ContainerAdmin from '@/components/ContainerAdmin'
import List from './List'
import { Suspense } from 'react'
import LoadingPages from '@/components/server/LoadingPages'

export default function AdminCategory() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContainerAdmin>
        <Suspense fallback={<LoadingPages />}>
          <List />
        </Suspense>
      </ContainerAdmin>
    </Suspense>
  )
}
