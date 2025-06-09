'use client'

import React, { Fragment, Suspense, useEffect, useCallback } from 'react'
import { TableComponent } from '@/components/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { ListCategory, ResultGetCategory } from '@/type/category'
import { debounce } from 'radash'
import { editCategory, getCategory } from '@/api/category'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import ModalComponent from '@/components/client/Modal'
import { useAxios } from '@/composable/useAxios'
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
import { If } from '@/components/if'
import PaginationComponents from '@/components/client/PaginationComponents'
import { format } from 'date-fns'
import AlertModal from '@/components/client/AlertModal'
import LoadingPages from '@/components/server/LoadingPages'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Category must be at least 3 characters.',
  }),
})

export default function CategoryList() {
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
  const [openModal, setOpenModal] = React.useState({
    show: false,
    id: '',
    category: '',
  })
  const [isLoading, setIsLoading] = React.useState(false)

  const axios = useAxios()

  useEffect(() => {
    if (!open) {
      form.reset()
      setEdit({
        isEdit: false,
        data: {} as ListCategory,
      })
    }
  }, [open])

  const fields = [
    {
      label: 'title',
      key: 'name',
      render: (item) => item.name,
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
          <>
            <Button
              className="bg-transparent text-underline text-blue-600 shadow-none  hover:bg-transparent hover:text-blue-600 underline"
              onClick={() => onEdit(item)}
            >
              Edit
            </Button>{' '}
            <Button
              className="bg-transparent text-underline text-red-500 shadow-none  hover:bg-transparent hover:text-red-500 underline"
              onClick={() =>
                setOpenModal({ show: true, id: item.id, category: item.name })
              }
            >
              Delete
            </Button>
          </>
        )
      },
    },
  ]

  function getListCategory(e?: number) {
    setIsLoading(true)
    getCategory({
      ...params,
      page: e ?? params.page,
    })
      .then((res) => {
        setData(res)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    getListCategory()
  }, [params])

  const onDelete = async () => {
    const { error } = await axios('/categories/' + openModal.id, {
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

  const onChangeSearch = useCallback(
    debounce({ delay: 500 }, async (event) => {
      const searchValue = event.target.value
      setParams((prevParams) => ({
        ...prevParams,
        page: 1,
        search: searchValue,
      }))
      try {
        const res = await getCategory({
          ...params,
          search: searchValue,
        })
        setData(res)
      } catch (error) {
        setData((prevState) => ({
          ...prevState,
          data: prevState.data.filter((item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase())
          ),
        }))
      }
    }),
    [params]
  )

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
      <If condition={isLoading}>
        <LoadingPages />
      </If>
      <div className=" px-6 py-[26px]">
        <h6>Total Article: {data.totalData}</h6>
      </div>
      <div className="flex justify-between items-center  border-t border-b border-slate-200 py-[26px] px-6">
        <div className="relative w-full">
          <Suspense fallback={<div>Loading search...</div>}>
            <Input onChange={onChangeSearch} className="pl-10 w-[240px]" />
            <Search className="absolute top-0 left-2 w-5 translate-y-1 text-gray-400" />
          </Suspense>
        </div>
        <Suspense>
          <ModalComponent
            open={open}
            onOpenChange={setOpen}
            title={edit.isEdit ? 'Edit Category' : 'Add Category'}
          >
            <ModalComponent.ButtonModal>
              <Button className="bg-blue-500">
                {edit.isEdit ? 'Edit' : 'Add'} Category
              </Button>
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
                          <FormLabel>Category</FormLabel>
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
            </ModalComponent.Description>

            <ModalComponent.Footer>
              <div className=" w-full justify-end gap-3 flex">
                <Button
                  className="bg-blue-500 mt-3 bg-transparent text-black hover:bg-transparent shadow-none border border-slate-200"
                  onClick={() => setOpen(false)}
                >
                  close
                </Button>
                <Button
                  color="green"
                  type="submit"
                  className="w-fit bg-blue-500 mt-3 hover:bg-blue-700 shadow-none"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Submit
                </Button>
              </div>
            </ModalComponent.Footer>
          </ModalComponent>
        </Suspense>
        <Suspense>
          <AlertModal
            title="Delete Articles"
            open={openModal.show}
            onOpenChange={setOpenModal}
          >
            <AlertModal.Description>
              Delete category “{openModal.category}”? This will remove it from
              master data permanently.
            </AlertModal.Description>
            <AlertModal.Cancel className="bg-transparent hover:bg-transparent t text-black">
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
      </div>
      <div className="mt-8">
        <Suspense>
          <TableComponent fields={fields} items={data.data || []} />
        </Suspense>
        <div className="mt-5">
          <Suspense fallback={<div>Loading pagination...</div>}>
            <PaginationComponents
              page={params.page}
              setParams={setParams}
              pageSize={params.limit ?? 10}
              totalCount={data.totalData}
            />
          </Suspense>
        </div>
      </div>
    </Fragment>
  )
}
