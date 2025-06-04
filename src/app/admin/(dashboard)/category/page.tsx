import { getCategory } from '@/api/category'
import List from './List'
import { Suspense, use } from 'react'
import Loading from '@/components/server/loading'

export default function Category() {
  const resultCategory = use(getCategory())
  return (
    <Suspense fallback={<Loading />}>
      <List category={resultCategory} />
    </Suspense>
  )
}
