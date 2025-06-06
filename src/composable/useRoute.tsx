'use client'

import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useRoute() {
  const pathname = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()

  const [route, setRoute] = useState({
    pathname,
    params,
    searchParams,
    getParam: (key: string) => searchParams.get(key),
    getPerPage: () => {
      const perPage = searchParams.get('perPage')
      return perPage ? parseInt(perPage) : 10
    },
    getPage: () => {
      const page = searchParams.get('page')
      return page ? parseInt(page) : 1
    }
  })

  useEffect(() => {
    setRoute({
      pathname,
      params,
      searchParams,
      getParam: (key: string) => searchParams.get(key),
      getPerPage: () => {
        const perPage = searchParams.get('perPage')
        return perPage ? parseInt(perPage) : 10
      },
      getPage: () => {
        const page = searchParams.get('page')
        return page ? parseInt(page) : 1
      }
    })
  }, [pathname, params, searchParams])

  return route
}
