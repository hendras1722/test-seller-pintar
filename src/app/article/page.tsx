import { Fragment, Suspense, use } from 'react'
import List from './List'
import { getArticle } from '@/api/article'
import { getCategory } from '@/api/category'
import ListCategory from './ListCategory'
import InputSearch from './InputSearch'
import Loading from '@/components/server/loading'

export default async function Landing() {
  const data = await getArticle()
  const categories = await getCategory()

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
export const revalidate = 0
