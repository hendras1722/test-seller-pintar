'use client'

import { If } from '@/components/if'
import Cookies from 'js-cookie'
import { Fragment, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { IconLogoLight, IconLogoWhite } from '@/components/Icon'
import Profile from '@/components/client/Profile'
import ArrayMap from '@/components/ArrayMap'

export default function Account() {
  const cookieStore = Cookies.get('me')
  const getMe = cookieStore
  const router = useRouter()

  const profile = [
    {
      key: 'Username',
      value: getMe && JSON.parse(getMe).username,
    },
    {
      key: 'Role',
      value: getMe && JSON.parse(getMe).role,
    },
  ]
  return (
    <Fragment>
      <div className="w-full  flex justify-between">
        <header className="p-3 md:px-[60px] px-5 py-[36px] border-b border-slate-200 w-full">
          <div className="w-full  flex justify-between">
            <IconLogoLight />

            <Suspense>
              <Profile>
                <span className="text-black">
                  {getMe && JSON.parse(getMe).username}
                </span>{' '}
              </Profile>
            </Suspense>
          </div>
        </header>
      </div>
      <div className="min-h-[calc(100vh-96px)] flex-1 flex justify-center items-center">
        <div>
          <div>
            <h4 className="font-semibold text-center">User Profile</h4>
            <div className="flex justify-center items-center gap-2 focus:outline-none focus:border-none mt-9 mb-6">
              <div className="rounded-full bg-blue-200 text-blue-900 font-semibold min-w-[68px] min-h-[68px] flex justify-center items-center text-[24px] ">
                <If condition={getMe}>
                  {getMe &&
                    JSON.parse(getMe)
                      .username.split(' ')
                      .map((item) => item.slice(0, 1).toUpperCase())
                      .slice(0, 2)
                      .join('')}
                </If>
              </div>
            </div>
            <div className="space-y-3 max-w-sm mx-auto">
              <ArrayMap
                of={profile}
                render={(item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200"
                  >
                    <div className="flex gap-2 font-semibold text-gray-800 min-w-[100px]">
                      <span className="w-[97px]">{item.key}</span>
                      <span>:</span>
                    </div>
                    <span className="text-gray-800 w-[210px] text-center">
                      {item.value}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>
          <Button
            className="w-[368px] bg-blue-600 hover:bg-blue-600  mt-9"
            onClick={() => router.push('/article')}
          >
            Back to home
          </Button>
        </div>
      </div>
      <footer className="bg-[linear-gradient(rgba(37,99,235,0.86),rgba(37,99,235,0.86))]  w-full flex md:flex-row flex-col justify-center gap-3   md:px-[506px] px-[62.5px] py-[37px] mt-[100px]">
        <div className="grid place-items-center md:block">
          <IconLogoWhite />
        </div>
        <small className="text-[16px] text-white text-nowrap">
          © 2025 Blog genzet. All rights reserved.
        </small>
      </footer>
    </Fragment>
  )
}
