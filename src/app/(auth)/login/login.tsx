'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
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
import { useAxios } from '@/composable/useAxios'
import { notify } from '@/utils/Notify'
import { useRouter } from 'next/navigation'
import { setAuthToken } from '@/utils/axios'
import Link from 'next/link'
import { Eye, EyeOff, Icon } from 'lucide-react'
import { IconLogoLight } from '@/components/Icon'
import React from 'react'
import { Else, If } from '@/components/if'

const formSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string(),
})

export default function LoginClient() {
  const [show, setShow] = React.useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })
  const axios = useAxios<{ token: string; role: string }>()
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data, error } = await axios('/auth/login', {
      method: 'POST',
      body: values,
    })
    if (!error) {
      await notify({
        variant: 'success',
        title: 'Success',
        description: 'Successfully login',
        duration: 3000,
        className: 'border border-green-500 !bg-white text-green-800',
      })

      setAuthToken(data?.token as string)
      if (data?.role.toLowerCase() === 'admin') {
        window.location.href = '/admin/category'
      } else {
        window.location.href = '/article'
      }

      return
    }
    await notify({
      variant: 'error',
      title: 'Error',
      description:
        (error &&
          typeof error === 'object' &&
          'response' in error &&
          (error as any).response?.data?.error) ||
        error?.message ||
        'Unknown error',
      duration: 3000,
      className: 'border border-red-500 bg-white text-red-800',
    })
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div>
        <div className="w-[400px] bg-white h-fit  py-[40px] border border-gray-100 rounded-2xl flex flex-col items-center dark:shadow-lg dark:shadow-white">
          <div className=" mt-5 pb-5">
            <IconLogoLight />
          </div>
          <div className="flex-1 w-full px-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="my-3"></div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Pasword"
                            {...field}
                            type={show ? 'text' : 'password'}
                          />
                          <If condition={show}>
                            <EyeOff
                              className="absolute right-3 top-3 text-slate-400 w-[16px] h-[16px] !text-[16px]"
                              onClick={() => setShow(!show)}
                            />
                            <Else key={'password'}>
                              <Eye
                                className="absolute right-3 top-3 text-slate-400  w-[16px] h-[16px] !text-[16px]"
                                onClick={() => setShow(!show)}
                              />
                            </Else>
                          </If>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  color="green"
                  type="submit"
                  className="my-8 w-full bg-blue-600 "
                >
                  Login
                </Button>
              </form>
            </Form>
          </div>
          <div className="text-center mt-2 font-semibold text-[12px]">
            Don’t have an account?
            <Link href="/register" className="ml-2 text-blue-500">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
