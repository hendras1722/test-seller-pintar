'use client'

import { Fragment, Suspense, useEffect, useState } from 'react'
import { getArticle } from '@/api/article'
import { getCategory } from '@/api/category'
import { ResutGetArticles } from '@/type/article'
import { ResultGetCategory } from '@/type/category'
import InputSearch from './article/InputSearch'
import ListCategory from './article/ListCategory'
import List from './article/List'

export default function Landing() {
  const [categories, setCategories] = useState<ResultGetCategory>({
    data: [],
    totalData: 0,
    currentPage: 0,
    totalPages: 0,
  })
  useEffect(() => {
    async function getCategoryList() {
      const categories = await getCategory()
      setCategories(categories)
    }
    getCategoryList()
  }, [])
  // const data = await getArticle()
  return (
    <Fragment>
      <header className="p-3">
        <div className="w-full  flex justify-center">
          <div className="grid place-items-center">
            <Suspense>
              <InputSearch />
            </Suspense>
            <div className="w-full overflow-auto ">
              <ul className="flex gap-3 mt-5 w-full">
                <Suspense>
                  <ListCategory category={categories.data} />
                </Suspense>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <hr className="w-full" />
      <h1 className="grid place-items-center mt-10">Article</h1>

      <Suspense>
        <List data={{ data: [], limit: 10, page: 1, total: 0 }} />
      </Suspense>
    </Fragment>
  )
}

export const dynamic = 'force-dynamic'
