import List from './List'
import { Suspense, use } from 'react'
import { getArticle } from '@/api/article'

export default function Category() {
  const resultArticle = use(getArticle())
  return (
    <Suspense fallback={<div>Loading article...</div>}>
      <List article={resultArticle} />
    </Suspense>
  )
}
