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
})

export default function LoginClient() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const axios = useAxios<{ token: string; role: string }>()
    const { error } = await axios('/auth/register', {
      method: 'POST',
      body: { ...values, role: 'Admin' },
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
    await notify({
      variant: 'error',
      title: 'Error',
      description: error?.message,
      duration: 3000,
      className: 'border border-red-500 bg-white text-red-800',
    })
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      <div className="w-[400px] h-fit  border border-gray-100 rounded-2xl flex flex-col items-center dark:shadow-lg dark:shadow-white">
        <div className=" mt-5 pb-5">
          <h2>Register Seller Pintar</h2>
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
                      <Input placeholder="Pasword" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button color="green" type="submit" className="my-8 w-full ">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
