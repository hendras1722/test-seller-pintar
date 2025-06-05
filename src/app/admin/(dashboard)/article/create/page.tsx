'use client'
import { getCategory } from '@/api/category'
import ArrayMap from '@/components/ArrayMap'
import RichTextEditor from '@/components/client/tiptap'
import ContainerAdmin from '@/components/ContainerAdmin'
import { If } from '@/components/if'
import { Button } from '@/components/ui/button'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAxios } from '@/composable/useAxios'
import { ResultGetCategory } from '@/type/category'
import { apiEndpoint } from '@/type/endpoint'
import { notify } from '@/utils/Notify'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ImagePlus } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export default function ArticleCreate() {
  const [categoryItem, setCategoryItem] = React.useState<ResultGetCategory>()
  const inputFile = React.useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = React.useState<string>('')

  const handleUploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file))
      }, 1000)
    })
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const imageUrl = await handleUploadImage(file)
        setSelectedImage(imageUrl)
        form.setValue('imageUrl', imageUrl)
        form.clearErrors('imageUrl')
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }
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
    imageUrl: z.string().refine((value: string) => !!value, {
      message: 'Image required',
    }),
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
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('categoryId', values.categoryId)
    formData.append('content', values.content)
    formData.append('imageUrl', values.imageUrl)

    const { error } = await axios(apiEndpoint.POST_ARTICLE, {
      method: 'POST',
      body: formData,
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
      setSelectedImage('')
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

  return (
    <ContainerAdmin className="px-[20] py-[22]">
      <div className="flex items-center gap-2">
        <Button className="p-0 bg-transparent text-underline text-black shadow-none hover:shadow-none hover:bg-transparent hover:text-black">
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
                    <Suspense>
                      <Input
                        ref={inputFile}
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        className={twMerge(
                          'border border-dashed border-gray-400 flex items-center justify-center h-[163px] w-[223px] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                          form.formState.errors.imageUrl && 'border-red-500'
                        )}
                        onClick={() => inputFile.current?.click()}
                        tabIndex={0}
                        aria-label="Select image file"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            inputFile.current?.click()
                          }
                        }}
                      >
                        {selectedImage ? (
                          <img
                            src={selectedImage}
                            alt="Selected thumbnail"
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="grid place-items-center mt-3 mb-6">
                            <ImagePlus />
                            <p className="underline">Click to Select Files</p>
                            <p>Support File Type : jpg or png</p>
                          </div>
                        )}
                      </button>
                    </Suspense>
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
                  <If condition={!!formState.errors.categoryId?.message}>
                    <FormMessage className="text-red-500">
                      {form.formState.errors.categoryId?.message}
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
                  </FormControl>
                  <If condition={!!formState.errors.content?.message}>
                    <FormMessage className="text-red-500">
                      {form.formState.errors.content?.message}
                    </FormMessage>
                  </If>
                </FormItem>
              )}
            />
            <div>
              <Button type="button">Cancel</Button>
              <Button type="button">Preview</Button>
              <Button type="submit">Upload</Button>
            </div>
          </form>
        </Form>
      </div>
    </ContainerAdmin>
  )
}
