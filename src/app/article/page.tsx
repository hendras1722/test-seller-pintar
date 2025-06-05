'use client'

import { Fragment, Suspense, use, useEffect, useState } from 'react'
import List from './List'
import { getArticle } from '@/api/article'
import { getCategory } from '@/api/category'
import ListCategory from './ListCategory'
import InputSearch from './InputSearch'
import Loading from '@/components/server/loading'
import { ResutGetArticles } from '@/type/article'
import { ResultGetCategory } from '@/type/category'

export default function Landing() {
  const [data, setData] = useState<ResutGetArticles>({
    data: [],
    limit: 0,
    page: 0,
    total: 0,
  })
  const [categories, setCategories] = useState<ResultGetCategory>({
    data: [],
    totalData: 0,
    currentPage: 0,
    totalPages: 0,
  })
  useEffect(() => {
    async function getData() {
      const data = await getArticle()
      setData(data)
    }
    async function getCategoryList() {
      const categories = await getCategory()
      setCategories(categories)
    }
    getData()
    getCategoryList()
  }, [])
  // const data = await getArticle()
  return (
    <Fragment>
      <header className="p-3">
        <div className="w-full  flex justify-center">
          <div className="grid place-items-center">
            <InputSearch />
            <div className="w-full overflow-auto ">
              <ul className="flex gap-3 mt-5 w-full">
                <ListCategory category={categories.data} />
              </ul>
            </div>
          </div>
        </div>
      </header>
      <hr className="w-full" />
      <h1 className="grid place-items-center mt-10">Article</h1>

      <List data={{ data: [], limit: 10, page: 1, total: 0 }} />
    </Fragment>
  )
}

export const dynamic = 'force-dynamic'
