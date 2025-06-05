'use client'

import { getArticle } from '@/api/article'
import ArrayMap from '@/components/ArrayMap'
import PaginationComponents from '@/components/client/PaginationComponents'
import { Else, If } from '@/components/if'
import { useRoute } from '@/composable/useRoute'
import { useBreakpoints } from '@/configs/useMediaQuery'
import { ListArticles, ResutGetArticles } from '@/type/article'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'

export default function List() {
  const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }
  const { md } = useBreakpoints(breakpoints)
  const route = useRoute()
  const router = useRouter()
  const [item, setItem] = useState<ResutGetArticles>({
    data: [],
    total: 0,
    page: 0,
    limit: 0,
  })
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' })

  function handlePagination() {
    const searchParams = new URLSearchParams(route.searchParams)

    if (searchParams.get('page') === null) searchParams.set('page', '')
    if (searchParams.get('title') === null) searchParams.set('title', '')
    if (searchParams.get('category') === null) searchParams.set('category', '')
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`
    router.push(newUrl)
  }

  async function fetchData() {
    let searchParams = {
      page: route.searchParams.get('page') ?? undefined,
      title: route.searchParams.get('title') ?? undefined,
      category: route.searchParams.get('category') ?? undefined,
    }
    const result = await getArticle({
      page: searchParams.page ?? undefined,
      title: searchParams.title ?? undefined,
      category: searchParams.category ?? undefined,
    })
    console.log(result)
    setItem(result)
  }
  useEffect(() => {
    fetchData()
  }, [route])

  return (
    <Fragment>
      <If condition={md}>
        <div className="grid md:grid-cols-3 grid-cols-1 grid-rows-1 gap-10 px-[100px] py-[40px] min-h-[122px]">
          <ArrayMap
            of={item.data}
            render={(item, index) => (
              <Link
                href={`/article/${item.id}?category=${item.category.name}`}
                key={index}
              >
                <If condition={!!item.imageUrl}>
                  <div
                    className=" h-[240px] bg-gray-500 rounded-lg"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  ></div>
                  <Else key={index}>
                    <div className=" h-[240px] bg-gray-500 rounded-lg"></div>
                  </Else>
                </If>
                <small className="text-slate-600">
                  {format(item.createdAt, 'MMM dd, yyyy')}
                </small>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-[16px] mt-3 font-normal">
                  {item.content.replace(/<[^>]+>/g, '').slice(0, 200)}
                </p>
                <div className="bg-blue-200 text-sm text-blue-900 rounded-full px-3 py-1 w-fit mt-2">
                  {item.category.name}
                </div>
              </Link>
            )}
          />
        </div>

        <Else key={'artcile'}>
          <div className="rounded mt-8 px-4">
            <ArrayMap
              of={item.data}
              render={(item, index) => (
                <Link
                  href={`/article/${item.id}?category=${item.category.name}`}
                  key={index}
                  className="mt-5 first:mt-0"
                >
                  <If condition={!!item.imageUrl}>
                    <img
                      src={item.imageUrl}
                      className="rounded"
                      alt="photo_article"
                      width={1600}
                    />
                  </If>
                  <h4 className="mt-2 font-bold">{item.title}</h4>
                  <p className="text-[16px] mt-3 font-normal">
                    {item.content.replace(/<[^>]+>/g, '').slice(0, 200)}
                  </p>
                  <div className="mt-5">
                    <h6>{item.user.username}</h6>
                    <h6>{format(item.createdAt, 'MMM dd, yyyy')}</h6>
                  </div>
                  <div className="mt-3">
                    <hr />
                  </div>
                </Link>
              )}
            />
          </div>
        </Else>
      </If>
      <div className="mt-5">
        <PaginationComponents
          model={handlePagination}
          page={params.page}
          setParams={setParams}
          pageSize={params.limit ?? 10}
          totalCount={item.total}
        />
      </div>
    </Fragment>
  )
}

export const dynamic = 'force-dynamic'
