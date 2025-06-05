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

export default function List({ data }: { readonly data: ResutGetArticles }) {
  console.log(data, 'inidata')
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

  function transformData(data: ListArticles[]) {
    const hasil = [] as ListArticles[][]
    let i = 0

    while (i < data.length) {
      if (hasil.length % 2 === 0) {
        const subArray = [] as ListArticles[]
        if (data[i]) {
          subArray.push(data[i])
        }
        hasil.push(subArray)
        i += 1
      } else {
        const subArray = [] as ListArticles[]
        if (data[i]) {
          subArray.push(data[i])
        }
        if (data[i + 1]) {
          subArray.push(data[i + 1])
        }
        hasil.push(subArray)
        i += 2
      }
    }
    return hasil
  }

  function handlePagination() {
    if (
      !route.searchParams.get('title') &&
      !route.searchParams.get('category')
    ) {
      router.push(`/article?page=${params.page + 1}`)
      return
    }
    router.push(
      `/article?page=${params.page + 1}&title=${route.searchParams.get(
        'title'
      )}&category=${route.searchParams.get('category')}`
    )
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
    setItem(result)
  }
  useEffect(() => {
    fetchData()
  }, [router])
  return (
    <Fragment>
      <If condition={md}>
        <div className="rounded mt-8 lg:px-[263px] py-3">
          <ArrayMap
            of={transformData(item.data)}
            render={(item: any[], index: number) => (
              <div key={index} className="mt-5">
                <If condition={item.length === 1}>
                  <Link
                    href={`/article/${item[0].id}?category=${item[0].category.name}`}
                    className="flex gap-3 items-start hover:shadow-lg hover:p-3 rounded-lg cursor-pointer"
                  >
                    <If condition={item[0].imageUrl}>
                      <img
                        src={item[0].imageUrl}
                        className="rounded"
                        alt="photo_article"
                        width={500}
                      />
                    </If>

                    <div>
                      <h4 className="mt-2 font-bold">{item[0].title}</h4>
                      <p className="text-[16px] mt-3 font-normal">
                        {item[0].content.replace(/<[^>]+>/g, '').slice(0, 200)}
                      </p>
                      <div className="mt-5">
                        <h6>{item[0].user.username}</h6>
                        <h6>{format(item[0].createdAt, 'MMM dd, yyyy')}</h6>
                      </div>
                    </div>
                  </Link>
                  <hr className="mt-5" />
                  <Else key={'articleelse'}>
                    <div className="grid grid-cols-2 place-items-center grid-rows-1 gap-4 mt-5">
                      <ArrayMap
                        of={item}
                        render={(list, index) => (
                          <Link
                            href={`/article/${list.id}?category=${list.category.name}`}
                            key={'list' + index}
                            className="hover:shadow-lg hover:p-3 rounded-lg cursor-pointer"
                          >
                            <If condition={list.imageUrl}>
                              <img
                                src={list.imageUrl}
                                className="rounded"
                                width={500}
                                height={300}
                                alt="photo_article"
                              />
                            </If>
                            <h4 className="mt-2 font-bold">{list.title}</h4>
                            <p className="text-[16px] mt-5 font-normal">
                              {list.content
                                .replace(/<[^>]+>/g, '')
                                .slice(0, 200)}
                            </p>
                            <div className="mt-5">
                              <h6>{list.user.username}</h6>
                              <h6>{format(list.createdAt, 'MMM dd, yyyy')}</h6>
                            </div>
                          </Link>
                        )}
                      />

                      <hr className="mt-5" />
                    </div>
                    <hr className="mt-5" />
                  </Else>
                </If>
              </div>
            )}
          />
        </div>
        <Else key={'artcile'}>
          <div className="rounded mt-8 px-4">
            <ArrayMap
              of={data.data}
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
