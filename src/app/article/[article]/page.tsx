'use client'
import { getArticle, getArticleDetail } from '@/api/article'
import { format } from 'date-fns'
import { Suspense, useEffect, useState } from 'react'
import ListArticleOrther from './ListArticleOrther'
import Link from 'next/link'
import { ListArticles } from '@/type/article'
import { useRoute } from '@/composable/useRoute'

export default function DetailArticle() {
  const [data, setData] = useState<ListArticles>()
  const [article, setArticle] = useState<ListArticles[]>([])
  const route = useRoute()

  useEffect(() => {
    async function getData() {
      const data = await getArticleDetail(route.pathname.split('/').pop())
      setData(data)
      const article = await getArticle({
        category: data.categoryId,
      })

      const articleOrther = article.data
        .filter((item) => item.id !== data.id)
        .slice(0, 3)
      setArticle(articleOrther)
    }
    getData()
  }, [])
  // const data = use(getArticleDetail(params.article))
  // const article = use(
  //   getArticle({
  //     category: data.categoryId,
  //   })
  // )1

  return (
    <div id="article" className="lg:px-96 px-8 lg:py-20 py-10 min-h-screen">
      <h1>{data?.title}</h1>
      <div className="mt-2">
        <span>{data?.createdAt && format(data.createdAt, 'dd/MM/yyyy')}</span>
      </div>
      <div>{data?.user.username}</div>
      <div className="mt-5">
        <img
          src={data?.imageUrl}
          width={1600}
          className="rounded"
          alt="article"
        />
      </div>
      <p
        className="mt-5 text-[16px]"
        dangerouslySetInnerHTML={{ __html: data?.content ?? '' }}
      ></p>
      <div className="p-1 border border-gray-300 w-fit rounded-lg text-[12px] mt-5">
        {data?.category.name}
      </div>
      <Suspense>
        <ListArticleOrther articleOrther={article} />
      </Suspense>
      <div className="mt-10">
        <Link href={'/article'}>Back</Link>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

export const experimental_ppr = true
