import { getArticle, getArticleDetail } from '@/api/article'
import ArrayMap from '@/components/ArrayMap'
import { format } from 'date-fns'
import { use } from 'react'
import ListArticleOrther from './ListArticleOrther'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DetailArticle({ params }) {
  const data = use(getArticleDetail(params.article))
  const article = use(
    getArticle({
      category: data.categoryId,
    })
  )
  const articleOrther = article.data
    .filter((item) => item.id !== data.id)
    .slice(0, 3)

  return (
    <div id="article" className="lg:px-96 px-8 lg:py-20 py-10 min-h-screen">
      <h1>{data.title}</h1>
      <div className="mt-2">
        <span>{format(data.createdAt, 'dd/MM/yyyy')}</span>
      </div>
      <div>{data.user.username}</div>
      <div className="mt-5">
        <img
          src={data.imageUrl}
          width={1600}
          className="rounded"
          alt="article"
        />
      </div>
      <p
        className="mt-5 text-[16px]"
        dangerouslySetInnerHTML={{ __html: data.content }}
      ></p>
      <div className="p-1 border border-gray-300 w-fit rounded-lg text-[12px] mt-5">
        {data.category.name}
      </div>
      <ListArticleOrther articleOrther={articleOrther} />
      <div className="mt-10">
        <Link href={'/article'}>Back</Link>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

export const experimental_ppr = true
