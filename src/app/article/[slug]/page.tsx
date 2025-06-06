'use client'
import { getArticle, getArticleDetail } from '@/api/article'
import { format } from 'date-fns'
import { Suspense, useEffect, useState } from 'react'
import ListArticleOrther from './ListArticleOrther'
import { ListArticles } from '@/type/article'
import { useRoute } from '@/composable/useRoute'
import Cookies from 'js-cookie'
import { If } from '@/components/if'
import { IconLogoLight, IconLogoWhite } from '@/components/Icon'
import { useRouter } from 'next/navigation'
import Profile from '@/components/client/Profile'

export default function DetailArticle() {
  const cookieStore = Cookies.get('me')
  const getMe = cookieStore
  const [data, setData] = useState<ListArticles>()
  const [article, setArticle] = useState<ListArticles[]>([])
  const route = useRoute()
  const router = useRouter()

  useEffect(() => {
    if (route.pathname.includes('preview')) {
      console.log(localStorage)
      const cookieStore = localStorage.getItem('preview')
      if (cookieStore) {
        const data = JSON.parse(cookieStore)

        async function getData() {
          const article = await getArticle({
            category: data.categoryId,
          })

          const articleOrther = article.data
            .filter((item) => item.id !== data.id)
            .slice(0, 3)
          setArticle(articleOrther)
        }
        getData()
        setData({
          imageUrl: data.imageUrl,
          title: data.title,
          content: data.content,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          id: data.id,
          userId: data.userId,
          categoryId: data.categoryId,
          category: data.category,
          user: data.user,
        })
      }
      return
    }
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

  return (
    <div id="article" className="min-h-screen">
      <header className="p-3 md:px-[60px] px-5 py-[36px] border-b border-slate-200">
        <div className="w-full  flex justify-between">
          <button onClick={() => router.push('/article')}>
            <IconLogoLight />
          </button>

          <Suspense>
            <Profile>
              <span className="!text-black">
                {getMe && JSON.parse(getMe).username}
              </span>
            </Profile>
          </Suspense>
        </div>
      </header>
      <div className="md:px-[60px] px-5 py-[40px] min-h-[450px]">
        <div className="text-center">
          <span>
            {data?.createdAt && format(data.createdAt, 'MMM dd, yyyy')} •
            created by {data?.user.username}
          </span>
        </div>
        <h1 className="text-[31px] text-center mt-4">{data?.title}</h1>
        <div className="mt-5">
          <If condition={!!data?.imageUrl}>
            <img
              src={data?.imageUrl}
              width={1600}
              className="rounded-xl"
              alt="article"
            />
          </If>
        </div>
        <p
          className="mt-5 text-[16px]"
          dangerouslySetInnerHTML={{ __html: data?.content ?? '' }}
        ></p>

        <Suspense>
          <ListArticleOrther articleOrther={article} />
        </Suspense>
      </div>
      <footer className="bg-[linear-gradient(rgba(37,99,235,0.86),rgba(37,99,235,0.86))] w-full flex md:flex-row flex-col justify-center gap-3   md:px-[506px] px-[62.5px] py-[37px] mt-[100px]">
        <div className="grid place-items-center md:block">
          <IconLogoWhite />
        </div>
        <small className="text-[16px] text-white text-nowrap">
          © 2025 Blog genzet. All rights reserved.
        </small>
      </footer>
    </div>
  )
}

// export const dynamic = 'force-dynamic'

// export const experimental_ppr = true
