import { Fragment, Suspense, use } from 'react'
import List from '@/app/article/List'
import { getArticle } from '@/api/article'
import { getCategory } from '@/api/category'
import ListCategory from '@/app/article/ListCategory'
import InputSearch from '@/app/article/InputSearch'
import Loading from '@/components/server/loading'

export default function Landing() {
  const data = use(getArticle())
  const categories = use(getCategory())

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

      <Suspense fallback={<Loading />}>
        <List data={data} />
      </Suspense>
    </Fragment>
  )
}

export const dynamic = 'force-dynamic'
