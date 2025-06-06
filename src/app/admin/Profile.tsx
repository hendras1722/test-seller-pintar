'use client'

import { clearAuthToken } from '@/utils/axios'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { Else, If } from '@/components/if'
import { useRoute } from '@/composable/useRoute'
import { cn } from '@/utils/lib'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Profile({
  children,
}: Readonly<{ children?: React.ReactNode }>) {
  const router = useRouter()
  const route = useRoute()
  const cookieStore = Cookies.get('me')
  const getMe = cookieStore
  async function handleLogout() {
    clearAuthToken()
    Cookies.remove('me')
    router.push('/login')
  }
  return (
    <If condition={getMe && JSON.parse(getMe).role === 'admin'}>
      <button
        className="flex justify-center items-center gap-2 focus:outline-none focus:border-none"
        onClick={handleLogout}
      >
        <div className="rounded-full bg-blue-200 text-blue-900 font-semibold min-w-[32px] min-h-[32px] flex justify-center items-center">
          <If condition={getMe}>
            {getMe &&
              JSON.parse(getMe)
                .username.split(' ')
                .map((item) => item.slice(0, 1).toUpperCase())
                .slice(0, 2)
                .join('')}
          </If>
        </div>
        <div
          className={cn(
            'text-black text-[16px] underline',
            !route.pathname.startsWith('/admin') && 'text-white'
          )}
        >
          {getMe && JSON.parse(getMe).username}
        </div>
      </button>
      <Else key={'user'}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex justify-center items-center gap-2 focus:outline-none focus:border-none">
              <div className="rounded-full bg-blue-200 text-blue-900 font-semibold min-w-[32px] min-h-[32px] flex justify-center items-center">
                <If condition={getMe}>
                  {getMe &&
                    JSON.parse(getMe)
                      .username.split(' ')
                      .map((item) => item.slice(0, 1).toUpperCase())
                      .slice(0, 2)
                      .join('')}
                </If>
              </div>
              <div
                className={cn(
                  ' text-[16px] underline',
                  !children && 'text-white'
                )}
              >
                <If condition={!!children}>
                  {children}
                  <Else key={'else'}>
                    {getMe && JSON.parse(getMe).username}
                  </Else>
                </If>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => router.push('/account')}>
              My Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Else>
    </If>
  )
}
