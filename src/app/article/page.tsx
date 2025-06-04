import { Input } from '@/components/ui/input'
import { Fragment, Suspense, use } from 'react'
import List from './List'
import { getArticle } from '@/api/article'
import ArrayMap from '@/components/ArrayMap'
import { getCategory } from '@/api/category'
import ListCategory from './ListCategory'
import InputSearch from './InputSearch'

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

      <Suspense fallback={<div>Loading article...</div>}>
        <List data={data} />
      </Suspense>
    </Fragment>
  )
}
