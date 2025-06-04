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
  })

  useEffect(() => {
    setRoute({ pathname, params, searchParams })
  }, [pathname, params, searchParams])

  return route
}
