'use client'

import React, { Fragment, useEffect } from 'react'
import BreadcrumbClient from '@/components/client/Breadcumb'
import { TableComponent } from '@/components/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DatePicker from '@/components/client/Datepicker'
import { Pencil, Search, Trash2 } from 'lucide-react'
import { ListCategory, ResultGetCategory } from '@/type/category'
import { debounce } from 'radash'
import { getCategory } from '@/api/category'

interface ItemType {
  name: string
  category: string
  price: string
  created_at: Date
  actions?: string
}

export default function List({
  category,
}: Readonly<{ category: ResultGetCategory }>) {
  const [date, setDate] = React.useState<Date>()
  const [data, setData] = React.useState(category)
  const [params, setParams] = React.useState({ page: 1, limit: 10, search: '' })

  const listBreadcrumb = [
    { label: 'Dashboard', href: '/admin/dashboard', disabled: true },
    { label: 'Category', href: '/admin/category' },
  ]
  const fields = [
    {
      label: 'Category Id',
      key: 'id',
    },
    {
      label: 'title',
      key: 'name',
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (item) => {
        return (
          <>
            <Button className="bg-blue-500 mr-5">
              {' '}
              <Pencil />
              Edit
            </Button>{' '}
            <Button className="bg-red-500">
              {' '}
              <Trash2 />
              Delete
            </Button>
          </>
        )
      },
    },
  ]

  const onChangeSearch = debounce({ delay: 3000 }, async (event) => {
    setParams(() => {
      return {
        limit: 10,
        page: 1,
        search: event.target.value,
      }
    })
    const res = await getCategory({
      ...params,
      search: event.target.value,
    })
    setData(res)
  })

  return (
    <Fragment>
      <BreadcrumbClient items={listBreadcrumb} />
      <div className="mt-8">
        <div className="flex gap-4 items-center mb-5">
          <div className="relative w-full">
            <Input onChange={onChangeSearch} className="pl-10 w-full" />
            <Search className="absolute top-0 left-2 w-5 translate-y-1 text-gray-400" />
          </div>
          <DatePicker selected={date} onSelect={setDate} />
          <Button className="bg-blue-500">Add Category</Button>
        </div>
        <TableComponent fields={fields} items={data.data || []} />
      </div>
    </Fragment>
  )
}
