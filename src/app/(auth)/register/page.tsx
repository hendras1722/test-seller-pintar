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
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { twMerge } from 'tailwind-merge'
import { IconLogoLight } from '@/components/Icon'
import { Else, If } from '@/components/if'
import { Eye, EyeOff } from 'lucide-react'
import React from 'react'

const formSchema = z.object({
  username: z
    .string()
    .min(3, 'Username harus minimal 3 karakter')
    .max(20, 'Username maksimal 20 karakter')
    .regex(
      /^\w+$/,
      'Username hanya boleh mengandung huruf, angka, dan underscore'
    ),
  password: z.string(),
  role: z.string(),
})

export default function LoginClient() {
  const router = useRouter()
  const [show, setShow] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      role: 'User',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const axios = useAxios<{ token: string; role: string }>()
    const { error } = await axios('/auth/register', {
      method: 'POST',
      body: { ...values },
    })
    if (!error) {
      await notify({
        variant: 'success',
        title: 'Success',
        description: 'Successfully register',
        duration: 3000,
        className: 'border border-green-500 !bg-white text-green-800',
      })

      router.push('/login')

      return
    }
    console.log(error)

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
                <div className="my-3"></div>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <SelectTrigger
                            className={twMerge(
                              form.formState.errors.role &&
                                '!border !border-red-500 '
                            )}
                          >
                            <SelectValue
                              placeholder={'Select a category'}
                              className="text-black"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="User">User</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
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
                  Register
                </Button>
              </form>
            </Form>
          </div>
          <div className="text-center mt-2 font-semibold text-[12px]">
            Already have an account? 
            <Link href="/login" className="ml-2 text-blue-500">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
