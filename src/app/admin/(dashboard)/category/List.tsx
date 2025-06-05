'use client'

import React, { Fragment, useEffect } from 'react'
import BreadcrumbClient from '@/components/client/Breadcumb'
import { TableComponent } from '@/components/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil, Search, Trash2 } from 'lucide-react'
import { ListCategory, ResultGetCategory } from '@/type/category'
import { debounce } from 'radash'
import { editCategory, getCategory } from '@/api/category'
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
  // FormMessage,
} from '@/components/ui/form'
import { twMerge } from 'tailwind-merge'
import { If } from '@/components/if'
import PaginationComponents from '@/components/client/PaginationComponents'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Category must be at least 3 characters.',
  }),
})

export default function List({
  category,
}: Readonly<{ category: ResultGetCategory }>) {
  const [data, setData] = React.useState<ResultGetCategory>({
    data: [],
    totalData: 0,
    currentPage: 0,
    totalPages: 0,
  })
  const [params, setParams] = React.useState({ page: 1, limit: 10, search: '' })
  const [open, setOpen] = React.useState(false)
  const [edit, setEdit] = React.useState({
    isEdit: false,
    data: {} as ListCategory,
  })

  const axios = useAxios()

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open])

  const listBreadcrumb = [
    { label: 'Dashboard', href: '', disabled: true },
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
          </>
        )
      },
    },
  ]

  function getListCategory(e?: number) {
    getCategory({
      ...params,
      page: e ?? params.page,
    }).then((res) => {
      setData(res)
    })
  }

  useEffect(() => {
    getListCategory()
  }, [params])

  const onDelete = async (e) => {
    const { error } = await axios('/categories/' + e, {
      method: 'DELETE',
    })
    if (!error) {
      await notify({
        variant: 'success',
        title: 'Success',
        description: `Category deleted successfully`,
        duration: 3000,
        className: 'border border-green-500 bg-white text-green-800',
      })
      getListCategory()
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
    setParams(() => {
      return {
        limit: 10,
        page: 1,
        search: event.target.value,
      }
    })
    try {
      const res = await getCategory({
        ...params,
        search: event.target.value,
      })
      setData(res)
    } catch (error) {
      setParams(() => {
        return {
          limit: 10,
          page: 1,
          search: event.target.value,
        }
      })
      setData((prevState) => {
        return {
          ...prevState,
          data: prevState.data.filter((item) =>
            item.name.toLowerCase().includes(event.target.value.toLowerCase())
          ),
        }
      })
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (edit.isEdit) {
      const { error } = await editCategory(values, edit.data.id)
      if (!error) {
        await notify({
          variant: 'success',
          title: 'Success',
          description: 'Category has been updated',
          duration: 3000,
          className: 'border border-green-500 bg-white text-green-800',
        })
        setOpen(false)
        getListCategory()
        form.reset()
        setEdit({ isEdit: false, data: {} as ListCategory })
        return
      }
      await notify({
        variant: 'error',
        title: 'Error',
        description: error?.message,
        duration: 3000,
        className: 'border border-red-500 bg-white text-red-800',
      })
      return
    }
    const { error } = await axios('/categories', {
      method: 'POST',
      body: values,
    })
    if (!error) {
      await notify({
        variant: 'success',
        title: 'Success',
        description: 'Category created successfully',
        duration: 3000,
        className: 'border border-green-500 bg-white text-green-800',
      })
      setOpen(false)
      getListCategory()
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

  function onEdit(e: ListCategory) {
    form.setValue('name', e.name)
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
          <ModalComponent
            open={open}
            onOpenChange={setOpen}
            title={'Add Category'}
          >
            <ModalComponent.ButtonModal>
              <Button className="bg-blue-500">Add Category</Button>
            </ModalComponent.ButtonModal>
            <ModalComponent.Description>
              <div>
                <Form {...form}>
                  <form id="my-form">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field, formState }) => (
                        <FormItem>
                          <FormLabel>name</FormLabel>
                          <FormControl>
                            <Input
                              className={twMerge(
                                form.formState.errors.name &&
                                  'border border-red-500 '
                              )}
                              placeholder="name"
                              {...field}
                            />
                          </FormControl>
                          <If condition={!!formState.errors.name?.message}>
                            <FormMessage className="text-red-500">
                              {form.formState.errors.name?.message}
                            </FormMessage>
                          </If>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
              {/* <FormCategory form={form}></FormCategory> */}
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
        <div className="mt-5">
          <PaginationComponents
            page={params.page}
            setParams={setParams}
            pageSize={params.limit ?? 10}
            totalCount={data.totalData}
          />
        </div>
      </div>
    </Fragment>
  )
}
