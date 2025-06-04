'use client'

import React, { Fragment, useEffect, useState } from 'react'
import BreadcrumbClient from '@/components/client/Breadcumb'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ArrayMap from '@/components/ArrayMap'
import RichTextEditor from '@/components/client/tiptap'

export default function List({
  article,
}: Readonly<{ article: ResutGetArticles }>) {
  const [date, setDate] = React.useState<Date>()
  const [data, setData] = React.useState(article)
  const [params, setParams] = React.useState({ page: 1, limit: 10, title: '' })
  const [open, setOpen] = React.useState(false)
  const [edit, setEdit] = React.useState({
    isEdit: false,
    data: {} as ListArticles,
  })
  const [categoryItem, setCategoryItem] = React.useState<ResultGetCategory>()

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open])

  const handleUploadImage = async (file: File): Promise<string> => {
    // Simulate image upload - in real app, upload to your server
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file))
      }, 1000)
    })
  }

  const axios = useAxios()

  const formSchema = z.object({
    title: z.string().min(2, {
      message: 'Title must be at least 3 characters.',
    }),
    content: z.string().refine(
      (value: string) => {
        return !!value.replace(/<[^>]*>/gm, '')
      },
      {
        message: 'Content required',
      }
    ),
    categoryId: z.string().refine((value: string) => !!value, {
      message: 'Category required',
    }),
  })

  const listBreadcrumb = [
    { label: 'Dashboard', href: '/admin/dashboard', disabled: true },
    { label: 'Article', href: '/admin/article' },
  ]
  const fields = [
    {
      label: 'Article Id',
      key: 'id',
    },
    {
      label: 'title',
      key: 'title',
    },
    {
      label: 'Content',
      key: 'content',
      render: (item) => (
        <div className="w-[300px] truncate">
          <div
            dangerouslySetInnerHTML={{
              __html:
                item.content.length > 60
                  ? item.content.substring(0, 60) + '...'
                  : item.content,
            }}
            className="truncate "
          ></div>
        </div>
      ),
    },
    {
      label: 'Image',
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
      label: 'Actions',
      key: 'actions',
      render: (item) => {
        return (
          <div className="flex flex-row gap-2">
            <Button className="bg-blue-500 mr-5" onClick={() => onEdit(item)}>
              {' '}
              <Pencil />
              Edit
            </Button>{' '}
            <Button className="bg-red-500" onClick={() => onDelete(item.id)}>
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
    if (open) {
      getCategory().then((res) => {
        setCategoryItem(res)
      })
    }
  }, [open])

  function getListArticle(e?: number) {
    getArticle({
      ...params,
      page: e ?? params.page,
    }).then((res) => {
      setData(res)
    })
  }

  const onDelete = async (e) => {
    const { error } = await axios('/categories/' + e, {
      method: 'DELETE',
    })
    if (!error) {
      await notify({
        variant: 'success',
        title: 'Success',
        description: `Article deleted successfully`,
        duration: 3000,
        className: 'border border-green-500 bg-transparent text-green-800',
      })
      getListArticle()
      return
    }
    await notify({
      variant: 'error',
      title: 'Error',
      description: error?.message,
      duration: 3000,
      className: 'border border-red-500 bg-transparent text-red-800',
    })
  }

  const onChangeSearch = debounce({ delay: 3000 }, async (event) => {
    setParams({
      limit: 10,
      page: 1,
      title: event.target.value,
    })
    const res = await getArticle({
      ...params,
      title: event.target.value,
    })
    setData(res)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      content: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (edit.isEdit) {
      const { error } = await editArticle(values, edit.data.id)
      if (!error) {
        await notify({
          variant: 'success',
          title: 'Success',
          description: 'Article has been updated',
          duration: 3000,
          className: 'border border-green-500 bg-transparent text-green-800',
        })
        setOpen(false)
        getListArticle()
        form.reset()
        setEdit({ isEdit: false, data: {} as ListArticles })
        return
      }
      await notify({
        variant: 'error',
        title: 'Error',
        description: error?.message,
        duration: 3000,
        className: 'border border-red-500 bg-transparent text-red-800',
      })
      return
    }
    const { error } = await axios(apiEndpoint.POST_ARTICLE, {
      method: 'POST',
      body: values,
    })
    if (!error) {
      await notify({
        variant: 'success',
        title: 'Success',
        description: 'Article created successfully',
        duration: 3000,
        className: 'border border-green-500 bg-transparent text-green-800',
      })
      setOpen(false)
      getListArticle()
      form.reset()
      return
    }
    await notify({
      variant: 'error',
      title: 'Error',
      description: error?.message,
      duration: 3000,
      className: 'border border-red-500 bg-transparent text-red-800',
    })
  }

  function onEdit(e: ListArticles) {
    // form.setValue('name', e.)
    setEdit({
      isEdit: true,
      data: e,
    })
    setOpen(true)
  }

  return (
    <Fragment>
      <BreadcrumbClient items={listBreadcrumb} />
      <div className="mt-8">
        <div className="sm:flex gap-4 items-center mb-5">
          <div className="relative w-full">
            <Input onChange={onChangeSearch} className="pl-10 w-full" />
            <Search className="absolute top-0 left-2 w-5 translate-y-1 text-gray-400" />
          </div>
          <DatePicker selected={date} onSelect={setDate} className="mb-5" />
          <ModalComponent
            open={open}
            onOpenChange={setOpen}
            title={'Add Article'}
          >
            <ModalComponent.ButtonModal>
              <Button className="bg-blue-500">Add Article</Button>
            </ModalComponent.ButtonModal>
            <ModalComponent.Description>
              <div>
                <Form {...form}>
                  <form id="my-form">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field, formState }) => (
                        <FormItem>
                          <FormLabel>title</FormLabel>
                          <FormControl>
                            <Input
                              className={twMerge(
                                form.formState.errors.title &&
                                  'border border-red-500 '
                              )}
                              placeholder="title"
                              {...field}
                            />
                          </FormControl>
                          <If condition={!!formState.errors.title?.message}>
                            <FormMessage className="text-red-500">
                              {form.formState.errors.title?.message}
                            </FormMessage>
                          </If>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field, formState }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                              uploadImageFn={handleUploadImage}
                            />
                            {/* <Input
                              className={twMerge(
                                form.formState.errors.content &&
                                  'border border-red-500 '
                              )}
                              placeholder="content"
                              {...field}
                            /> */}
                          </FormControl>
                          <If condition={!!formState.errors.content?.message}>
                            <FormMessage className="text-red-500">
                              {form.formState.errors.content?.message}
                            </FormMessage>
                          </If>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field, formState }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              {...field}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className={twMerge(
                                    form.formState.errors.categoryId &&
                                      '!border !border-red-500 '
                                  )}
                                >
                                  <SelectValue
                                    placeholder={
                                      field.value
                                        ? undefined
                                        : 'Select a category'
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <ArrayMap
                                  of={
                                    categoryItem?.data?.filter(
                                      (item) => item.id && item.id.trim() !== ''
                                    ) ?? []
                                  }
                                  render={(e) => (
                                    <SelectItem key={e.id} value={e.id}>
                                      {e.name}
                                    </SelectItem>
                                  )}
                                />
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <If
                            condition={!!formState.errors.categoryId?.message}
                          >
                            <FormMessage className="text-red-500">
                              {form.formState.errors.categoryId?.message}
                            </FormMessage>
                          </If>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            </ModalComponent.Description>

            <ModalComponent.Footer>
              <div className=" w-full grid place-items-center">
                <Button
                  color="green"
                  type="submit"
                  className="w-full bg-green-500 mt-3 hover:bg-green-700 shadow-none"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Submit
                </Button>
                <Button
                  className="bg-blue-500 mt-3 bg-transparent text-black hover:bg-transparent shadow-none"
                  onClick={() => setOpen(false)}
                >
                  close
                </Button>
              </div>
            </ModalComponent.Footer>
          </ModalComponent>
        </div>
        <TableComponent fields={fields} items={data.data || []} />
        <PaginationComponents
          model={getListArticle}
          page={params.page}
          setParams={setParams}
          pageSize={params.limit ?? 10}
          totalCount={data.total}
        />
      </div>
    </Fragment>
  )
}
