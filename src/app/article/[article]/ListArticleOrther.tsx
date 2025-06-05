'use client'

import ArrayMap from '@/components/ArrayMap'
import { useRoute } from '@/composable/useRoute'
import { ListArticles } from '@/type/article'
import { format } from 'date-fns'

export default function ListArticleOrther({
  articleOrther,
}: {
  readonly articleOrther: ListArticles[]
}) {
  return (
    <div className="p-4 rounded mt-10">
      <h4>Other articles</h4>

      <div className="grid grid-cols-3 grid-rows-1 gap-5 mt-5">
        <ArrayMap
          of={articleOrther}
          render={(item, index) => (
            <a
              href={`/article/${item.id}?category=${item.category.name}`}
              key={index}
              className="hover:shadow-lg p-3 rounded-lg"
            >
              <div
                className="h-[240px] bg-gray-300 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              ></div>
              <small className="text-slate-600 text-sm">
                {format(item.createdAt, 'MMM dd, yyyy')}
              </small>
              <p
                className="my-2"
                dangerouslySetInnerHTML={{
                  __html: item.content.replace(/<[^>]+>/g, '').slice(0, 90),
                }}
              ></p>
              <div className="bg-blue-200 my-2 text-sm text-blue-900 rounded-full px-3 py-1 w-fit mt-2">
                {item.category.name}
              </div>
            </a>
          )}
        />
      </div>
    </div>
  )
}
