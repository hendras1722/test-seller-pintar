'use client'

import { Fragment, Suspense, useEffect, useState } from 'react'
import { getCategory } from '@/api/category'
import { ResultGetCategory } from '@/type/category'
import ArrayMap from '@/components/ArrayMap'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Else, If } from '@/components/if'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRoute } from '@/composable/useRoute'
import { IconLogoWhite } from '@/components/Icon'
import List from './List'
import InputSearch from './InputSearch'
import Profile from '@/components/client/Profile'

export default function Landing() {
  const [categories, setCategories] = useState<ResultGetCategory>({
    data: [],
    totalData: 0,
    currentPage: 0,
    totalPages: 0,
  })
  const router = useRouter()
  const [selected, setSelected] = useState<string>('')
  useEffect(() => {
    async function getCategoryList() {
      const categories = await getCategory()
      setCategories(categories)
    }
    getCategoryList()
  }, [])

  const route = useRoute()

  useEffect(() => {
    const searchParams = new URLSearchParams(route.searchParams)

    if (selected) {
      searchParams.set('category', selected)
    } else {
      searchParams.delete('category')
    }
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`
    router.push(newUrl)
  }, [selected])

  return (
    <Fragment>
      <header className="p-3 bg-[linear-gradient(rgba(37,99,235,0.86),rgba(37,99,235,0.86)),url('/background.jpg')] bg-cover bg-center   md:px-[60px] px-5  py-[36px] ">
        <div className="w-full  flex justify-between">
          <button onClick={() => router.push('/article')}>
            <IconLogoWhite />
          </button>
          <Suspense>
            <Profile />
          </Suspense>
        </div>
        <div className="flex justify-center mt-[42.5px]">
          <div className="text-white mt-[42.5px] text-center min-h-[176px] w-[730px]">
            <div className="text-[16px]">Blog genzet</div>
            <h1 className="font-semibold my-[12px]">
              The Journal : Design Resources, Interviews, and Industry News
            </h1>
            <h3>Your daily dose of design insights!</h3>
          </div>
        </div>
        <div className="flex  justify-center">
          <div className=" h-[176px] w-[730px] md:px-[61px] px-[16px]">
            <div className="mt-[40px] bg-blue-500 p-[10px] rounded-xl flex md:flex-row flex-col gap-4 ">
              <div>
                <Select value={selected} onValueChange={setSelected}>
                  <SelectTrigger className="md:w-[180px] w-full text-foreground bg-white">
                    <SelectValue
                      placeholder={'Select a category'}
                      className="text-black"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <If condition={categories.data.length > 0}>
                      <SelectGroup>
                        <ArrayMap
                          of={categories.data.filter((e) => e.id)}
                          render={(e) => (
                            <SelectItem key={e.id} value={e.id ?? ''}>
                              {e.name || 'No categories available'}
                            </SelectItem>
                          )}
                        />
                      </SelectGroup>
                      <Else key={'none'}>
                        <SelectItem value="none">Select an option</SelectItem>
                      </Else>
                    </If>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full relative">
                <InputSearch />
                <Search className="absolute left-2 top-[5px] text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </header>
      <hr className="w-full" />
      <Suspense>
        <List />
      </Suspense>
      <footer className="bg-[linear-gradient(rgba(37,99,235,0.86),rgba(37,99,235,0.86))] w-full flex md:flex-row flex-col justify-center gap-3   md:px-[506px] px-[62.5px] py-[37px] mt-[100px]">
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

// export const dynamic = 'force-dynamic'
