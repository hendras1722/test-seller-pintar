'use client'

import ArrayMap from '@/components/ArrayMap'
import { useRoute } from '@/composable/useRoute'
import { ListArticles } from '@/type/article'

export default function ListArticleOrther({
  articleOrther,
}: {
  readonly articleOrther: ListArticles[]
}) {
  const route = useRoute()
  return (
    <div className=" bg-gray-200 p-4 rounded mt-10">
      <h4>Article {route.searchParams.get('category')} lainnya:</h4>

      <div className="grid grid-cols-3 grid-rows-1 gap-5 mt-5">
        <ArrayMap
          of={articleOrther}
          render={(item, index) => (
            <a
              href={`/article/${item.id}?category=${item.category.name}`}
              key={index}
              className="hover:shadow-lg p-3 rounded-lg"
            >
              <img
                src={item.imageUrl}
                width={1600}
                className="rounded"
                alt="article-orther"
              />
              <h6 className="mt-2">{item.title}</h6>
            </a>
          )}
        />
      </div>
    </div>
  )
}
