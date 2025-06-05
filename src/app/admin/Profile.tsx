'use client'

import { Button } from '@/components/ui/button'
import { clearAuthToken } from '@/utils/axios'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { If } from '@/components/if'

export default function Profile() {
  const router = useRouter()
  const cookieStore = Cookies.get('me')
  const getMe = cookieStore
  async function handleLogout() {
    clearAuthToken()
    router.push('/login')
  }
  return (
    <If condition={getMe}>
      <div
        className="flex justify-center items-center gap-2"
        onClick={handleLogout}
      >
        <div className="rounded-full bg-blue-200 min-w-[32px] min-h-[32px] flex justify-center items-center">
          {JSON.parse(getMe)
            .username.split(' ')
            .map((item) => item.slice(0, 1).toUpperCase())
            .slice(0, 2)
            .join('')}
        </div>
        <div className="text-black text-[16px] underline">
          {JSON.parse(getMe).username}
        </div>
      </div>
    </If>
  )
}
