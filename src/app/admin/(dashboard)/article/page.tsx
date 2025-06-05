import List from './List'
import { Suspense, use } from 'react'
import { getArticle } from '@/api/article'
import { format, subDays } from 'date-fns'
import Loading from '@/components/server/loading'

export default function Category() {
  const yesterday = subDays(new Date(), 1)

  const formattedYesterday = format(yesterday, 'yyyy-MM-dd')
  const resultArticle = use(
    getArticle({
      createdAtStart: format(formattedYesterday, 'yyyy-MM-dd'),
      createdAtEnd: format(new Date(), 'yyyy-MM-dd'),
    })
  )
  return (
    <Suspense fallback={<Loading />}>
      <List article={resultArticle} />
    </Suspense>
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = false
