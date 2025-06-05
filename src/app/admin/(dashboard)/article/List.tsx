'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { TableComponent } from '@/components/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DatePicker from '@/components/client/Datepicker'
import { Pencil, Search, Trash2 } from 'lucide-react'
import { ListArticles, ResutGetArticles } from '@/type/article'
import { debounce } from 'radash'
import { editArticle, getArticle } from '@/api/article'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import ModalComponent from '@/components/client/Modal'
import { useAxios } from '@/composable/useAxios'
import { apiEndpoint } from '@/type/endpoint'
import { notify } from '@/utils/Notify'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { twMerge } from 'tailwind-merge'
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
import RichTextEditor from '@/components/client/tiptap'
import { format, subDays } from 'date-fns'
import LoadingPages from '@/components/server/LoadingPages'
import { useRouter } from 'next/navigation'

export default function List() {
  const yesterday = subDays(new Date(), 1)
  const formattedYesterday = format(yesterday, 'yyyy-MM-dd')

  const [data, setData] = React.useState<ResutGetArticles>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
  })
  const [params, setParams] = React.useState({ page: 1, limit: 10, title: '' })
  const [open, setOpen] = React.useState(false)
  const [edit, setEdit] = React.useState({
    isEdit: false,
    data: {} as ListArticles,
  })
  const [categoryItem, setCategoryItem] = React.useState<ResultGetCategory>()
  const [isLoading, setIsLoading] = useState(false)
  const [payload, setPayload] = React.useState({
    title: '',
    categoryId: '',
  })
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
              className="bg-transparent text-underline text-blue-600 shadow-none hover:shadow-none hover:bg-transparent hover:text-blue-600"
              onClick={() => onEdit(item)}
            >
              Preview
            </Button>{' '}
            <Button
              className="bg-transparent text-underline text-blue-600 shadow-none hover:shadow-none hover:bg-transparent hover:text-blue-600"
              onClick={() => onEdit(item)}
            >
              Edit
            </Button>{' '}
            <Button
              className="bg-transparent text-underline text-red-500 shadow-none hover:shadow-none hover:bg-transparent hover:text-red-500"
              onClick={() => onDelete(item.id)}
            >
              {' '}
              <Trash2 />
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    getCategory().then((res) => {
      setCategoryItem(res)
    })
  }, [])

  function getListArticle(e?: number) {
    setIsLoading(true)
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

  const onDelete = async (e) => {
    const { error } = await axios('/articles/' + e, {
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
    })
  })

  function onEdit(e: ListArticles) {
    // form.setValue('title', e.title)
    // form.setValue('content', e.content)
    // form.setValue('categoryId', e.categoryId)
    // setEdit({
    //   isEdit: true,
    //   data: e,
    // })
    // setOpen(true)
  }

  return (
    <Fragment>
      <If condition={isLoading}>
        <LoadingPages />
      </If>
      <div className=" px-6 py-[26px]">
        <h6>Total Article: {data.total}</h6>
      </div>
      <div className="flex justify-between items-center  border-t border-b border-slate-200 py-[26px] px-6">
        <div className="flex flex-row gap-2">
          <Select
            value={payload.categoryId}
            onValueChange={(e) => setPayload({ ...payload, categoryId: e })}
          >
            <SelectTrigger className="md:w-[180px] w-full text-foreground bg-white">
              <SelectValue
                placeholder={'Select a category'}
                className="text-black"
              />
            </SelectTrigger>
            <SelectContent>
              <If condition={!!(categoryItem && categoryItem.data.length > 0)}>
                <SelectGroup>
                  <ArrayMap
                    of={
                      (categoryItem && categoryItem.data.filter((e) => e.id)) ||
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
          <div className="relative w-full">
            <Input onChange={onChangeSearch} className="pl-10 w-full" />
            <Search className="absolute top-0 left-2 w-5 translate-y-1 text-gray-400" />
          </div>
        </div>
        <Button
          className="bg-blue-500"
          onClick={() => router.push('/admin/article/create')}
        >
          Add Article
        </Button>
      </div>
      <div>
        <div className="sm:flex gap-4 items-center"></div>
        <TableComponent fields={fields} items={data.data || []} />
        <div className="mt-5">
          <PaginationComponents
            page={params.page}
            setParams={setParams}
            pageSize={params.limit ?? 10}
            totalCount={data.total}
          />
        </div>
      </div>
    </Fragment>
  )
}
