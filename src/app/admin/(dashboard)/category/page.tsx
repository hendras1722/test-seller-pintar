import { getCategory } from '@/api/category'
import List from './List'
import { Suspense, use } from 'react'

export default function Category() {
  const resultCategory = use(getCategory())
  return (
    <Suspense fallback={<div>Loading categories...</div>}>
      <List category={resultCategory} />
    </Suspense>
  )
}
