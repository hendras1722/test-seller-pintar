'use client'

import React, { Fragment, Suspense, useEffect, useState } from 'react'
import { TableComponent } from '@/components/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { ListArticles, ResutGetArticles } from '@/type/article'
import { debounce } from 'radash'
import { useAxios } from '@/composable/useAxios'
import { notify } from '@/utils/Notify'
import { Else, If } from '@/components/if'
import PaginationComponents from '@/components/client/PaginationComponents'
import { getCategory } from '@/api/category'
import { ResultGetCategory } from '@/type/category'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ArrayMap from '@/components/ArrayMap'
import { format } from 'date-fns'
import LoadingPages from '@/components/server/LoadingPages'
import { useRouter } from 'next/navigation'
import { getArticle } from '@/api/article'
import AlertModal from '@/components/client/AlertModal'

export default function ArticleList() {
  const [data, setData] = React.useState<ResutGetArticles>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
  })
  const [params, setParams] = React.useState({
    page: 1,
    limit: 10,
    title: '',
    category: '',
  })
  const [openModal, setOpenModal] = useState({
    show: false,
    id: '',
  })
  const [categoryItem, setCategoryItem] = React.useState<ResultGetCategory>()
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const axios = useAxios()

  const fields = [
    {
      label: 'Thumbnails',
      key: 'imageUrl',
      render: (item, index) => (
        <div className="w-[300px] truncate">
          <If condition={!!item.imageUrl}>
            <img src={item.imageUrl} alt={index} className="w-[100px]" />
            <Else key={index}>Image not found</Else>
          </If>
        </div>
      ),
    },
    {
      label: 'title',
      key: 'title',
    },

    {
      label: 'Category',
      key: 'category',
      render: (item) => item.category.name,
    },
    {
      label: 'Created At',
      key: 'createdAt',
      render: (item) =>
        format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm:ss'),
    },

    {
      label: 'Actions',
      key: 'actions',
      render: (item) => {
        return (
          <div className="flex flex-row gap-2">
            <Button
              className="underline bg-transparent text-underline text-blue-600 shadow-none  hover:bg-transparent hover:text-blue-600"
              onClick={() => onPreview(item)}
            >
              Preview
            </Button>{' '}
            <Button
              className="underline bg-transparent text-underline text-blue-600 shadow-none  hover:bg-transparent hover:text-blue-600"
              onClick={() => onEdit(item)}
            >
              Edit
            </Button>{' '}
            <Button
              className="underline bg-transparent text-underline text-red-500 shadow-none  hover:bg-transparent hover:text-red-500"
              onClick={() =>
                setOpenModal({
                  show: true,
                  id: item.id,
                })
              }
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    localStorage.removeItem('preview')
    getCategory().then((res) => {
      setCategoryItem(res)
    })
  }, [])

  function getListArticle(e?: number) {
    setIsLoading(true)
    if (params.category === 'All') params.category = ''
    getArticle({
      ...params,
      page: e ?? params.page,
    })
      .then((res) => {
        setData(res)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    getListArticle()
  }, [params])

  const onDelete = async () => {
    const { error } = await axios('/articles/' + openModal.id, {
      method: 'DELETE',
    })
    if (!error) {
      await notify({
        variant: 'success',
        title: 'Success',
        description: `Article deleted successfully`,
        duration: 3000,
        className: 'border border-green-500 bg-white text-green-800',
      })
      getListArticle()
      return
    }
    await notify({
      variant: 'error',
      title: 'Error',
      description: error?.message,
      duration: 3000,
      className: 'border border-red-500 bg-white text-red-800',
    })
  }

  const onChangeSearch = debounce({ delay: 500 }, async (event) => {
    setParams({
      limit: 10,
      page: 1,
      title: event.target.value,
      category: params.category,
    })
  })

  function onPreview(e: ListArticles) {
    const data = {
      imageUrl: e.imageUrl,
      title: e.title,
      content: e.content,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      id: e.id,
      userId: e.userId,
      categoryId: e.categoryId,
      category: e.category.name,
      user: e.user.username,
    }
    localStorage.setItem('preview', JSON.stringify(data))
    window.open(
      '/article/preview',
      'articlePreview',
      'height=768,width=1366,left=10,top=10,titlebar=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
    )
  }

  function onEdit(e: ListArticles) {
    localStorage.removeItem('preview')
    router.push('/admin/article/edit/' + e.id)
  }

  return (
    <Suspense fallback={<LoadingPages />}>
      <Fragment>
        <If condition={isLoading}>
          <LoadingPages />
        </If>
        <div className=" px-6 py-[26px]">
          <h6>Total Article: {data.total}</h6>
        </div>
        <div className="flex justify-between items-center flex-wrap  border-t border-b border-slate-200 py-[26px] px-6 gap-2">
          <div className="flex flex-row gap-2">
            <Suspense>
              <Select
                value={params.category}
                onValueChange={(e) => setParams({ ...params, category: e })}
              >
                <SelectTrigger className="md:w-[180px] w-full text-foreground bg-white">
                  <SelectValue
                    placeholder={'Select a category'}
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent>
                  <If
                    condition={!!(categoryItem && categoryItem.data.length > 0)}
                  >
                    <SelectGroup>
                      <SelectItem value={'All'}>All</SelectItem>
                      <ArrayMap
                        of={
                          (categoryItem &&
                            categoryItem.data.filter((e) => e.id)) ||
                          []
                        }
                        render={(e) => (
                          <SelectItem key={e.id} value={e.id ?? ''}>
                            {e.name || 'No categories available'}
                          </SelectItem>
                        )}
                      />
                    </SelectGroup>
                    <Else key={'none'}>
                      <SelectItem value="none">Select an option</SelectItem>
                    </Else>
                  </If>
                </SelectContent>
              </Select>
            </Suspense>
            <div className="relative w-full ">
              <Suspense>
                <Input onChange={onChangeSearch} className="pl-10 w-full" />
                <Search className="absolute top-0 left-2 w-5 translate-y-1 text-gray-400" />
              </Suspense>
            </div>
          </div>
          <Suspense>
            <Button
              className="bg-blue-500 lg:w-fit w-full"
              onClick={() => router.push('/admin/article/create')}
            >
              Add Article
            </Button>
          </Suspense>
        </div>
        <div>
          <div className="sm:flex gap-4 items-center"></div>
          <Suspense>
            <TableComponent fields={fields} items={data.data || []} />
          </Suspense>
          <div className="mt-5">
            <Suspense>
              <PaginationComponents
                page={params.page}
                setParams={setParams}
                pageSize={params.limit ?? 10}
                totalCount={data.total}
              />
            </Suspense>
          </div>
        </div>
        <Suspense>
          <AlertModal
            title="Delete Articles"
            open={openModal.show}
            onOpenChange={setOpenModal}
          >
            <AlertModal.Description>
              Deleting this article is permanent and cannot be undone. All
              related content will be removed.
            </AlertModal.Description>
            <AlertModal.Cancel
              asChild
              className="bg-transparent hover:bg-transparent mt-2 sm:!mt-0 text-black"
            >
              Cancel
            </AlertModal.Cancel>
            <AlertModal.Action
              asChild
              className="bg-red-500 hover:bg-red-500"
              onClick={onDelete}
            >
              Delete
            </AlertModal.Action>
          </AlertModal>
        </Suspense>
      </Fragment>
    </Suspense>
  )
}
