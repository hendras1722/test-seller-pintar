'use client'

import { getCategory } from '@/api/category'
import ArrayMap from '@/components/ArrayMap'
import RichTextEditor from '@/components/client/tiptap'
import UploadPhoto from '@/components/client/UploadPhoto'
import ContainerAdmin from '@/components/ContainerAdmin'
import { If } from '@/components/if'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import LoadingPages from '@/components/server/LoadingPages'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAxios } from '@/composable/useAxios'
import { ResultGetCategory } from '@/type/category'
import { apiEndpoint } from '@/type/endpoint'
import { notify } from '@/utils/Notify'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function ArticleCreate() {
  const [categoryItem, setCategoryItem] = React.useState<ResultGetCategory>()
  const [readyUpload, setReadyUpload] = React.useState(true)
  const getMe = Cookies.get('me')

  const router = useRouter()

  const handleUploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file))
      }, 1000)
    })
  }

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
    imageUrl: z.string().optional(),
  })

  useEffect(() => {
    getCategory().then((res) => {
      setCategoryItem(res)
    })
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      content: '',
      imageUrl: '',
    },
  })

  const axios = useAxios()
  async function onSubmit(values: z.infer<typeof formSchema>) {
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
        className: 'border border-green-500 bg-white text-green-800',
      })
      form.reset()
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

  function onPreview() {
    const data = {
      imageUrl: form.getValues('imageUrl'),
      title: form.getValues('title'),
      content: form.getValues('content'),
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '123123',
      userId: '123123',
      categoryId:
        form.getValues('categoryId') &&
        categoryItem?.data.find(
          (item) => item.id === form.getValues('categoryId')
        )?.id,
      category:
        form.getValues('categoryId') &&
        categoryItem?.data.find(
          (item) => item.id === form.getValues('categoryId')
        )?.name,
      user: getMe && JSON.parse(getMe).username,
    }
    setReadyUpload(false)
    Cookies.set('preview', JSON.stringify(data))
    window.open(
      '/article/preview',
      'articlePreview',
      'height=768,width=1366,left=10,top=10,titlebar=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
    )
  }

  return (
    <ContainerAdmin className="px-[20px] py-[22px]">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => router.push('/admin/article')}
          className="p-0 bg-transparent text-underline text-black shadow-none hover:shadow-none hover:bg-transparent hover:text-black"
        >
          <ArrowLeft />
        </Button>{' '}
        <span>Create Articles</span>
      </div>
      <div className="mt-6">
        <Form {...form}>
          <form id="my-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Thumbnails</FormLabel>
                  <FormControl>
                    <UploadPhoto setImage={field.onChange} />
                  </FormControl>
                  <If condition={!!formState.errors.imageUrl?.message}>
                    <FormMessage className="text-red-500">
                      {form.formState.errors.imageUrl?.message}
                    </FormMessage>
                  </If>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      className={twMerge(
                        form.formState.errors.title && 'border border-red-500'
                      )}
                      placeholder="Enter article title"
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
              name="categoryId"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Suspense>
                      <>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={twMerge(
                                form.formState.errors.categoryId &&
                                  '!border !border-red-500'
                              )}
                            >
                              <SelectValue
                                placeholder={
                                  field.value ? undefined : 'Select a category'
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
                        <small>
                          The existing category list can be seen in the{' '}
                          <Link
                            className="text-blue-500 underline"
                            href="/admin/category"
                          >
                            category
                          </Link>{' '}
                          menu
                        </small>
                      </>
                    </Suspense>
                  </FormControl>
                  <If condition={!!formState.errors.title?.message}>
                    <FormMessage className="text-red-500">
                      {form.formState.errors.title?.message}
                    </FormMessage>
                  </If>
                </FormItem>
              )}
            />
            <div className="mt-10 flex items-center gap-4 justify-end">
              <Button
                onClick={() => {
                  form.reset()
                  router.push('/admin/article')
                }}
                type="button"
                className="bg-white text-black hover:bg-white "
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-slate-200 text-black hover:bg-slate-200"
                onClick={onPreview}
              >
                Preview
              </Button>
              <Button
                disabled={readyUpload}
                type="submit"
                className="bg-blue-500 hover:bg-blue-500"
              >
                Upload
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ContainerAdmin>
  )
}
