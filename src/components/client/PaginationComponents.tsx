'use client'

import { type ReactNode, useCallback } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/utils/lib'
import { If } from '../if'
// import { cn } from '@/lib/utils'

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string
    pageSizeOptions: number[]
  }
  totalCount: number
  pageSize: number
  page: number
  pageSearchParam?: string
  model?: (page: number) => void
  setParams: (params: any) => void
}

/**
 * Navigate with Nextjs links (need to update your own `pagination.tsx` to use Nextjs Link)
 * 
 * @example
 * ```
 * <PaginationWithLinks
    page={1}
    pageSize={20}
    totalCount={500}
  />
 * ```
 */
export default function PaginationComponents({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  page,
  pageSearchParam,
  model,
  setParams,
}: Readonly<PaginationWithLinksProps>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const totalPageCount = Math.ceil(totalCount / pageSize)

  const buildLink = useCallback(
    (newPage: number) => {
      const key = pageSearchParam || 'page'
      if (!searchParams) return `${pathname}?${key}=${newPage}`
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.set(key, String(newPage))
      return `${pathname}?${newSearchParams.toString()}`
    },
    [searchParams, pathname]
  )

  const navToPageSize = useCallback(
    (newPageSize: number) => {
      const key = pageSizeSelectOptions?.pageSizeSearchParam || 'pageSize'
      const newSearchParams = new URLSearchParams(searchParams || undefined)
      newSearchParams.set(key, String(newPageSize))
      router.push(`${pathname}?${newSearchParams.toString()}`)
    },
    [searchParams, pathname]
  )

  const renderPageNumbers = () => {
    const items: ReactNode[] = []
    const maxVisiblePages = 5

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => {
                setParams({ page: i })
                if (model) {
                  model(i)
                }
              }}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => {
              setParams({ page: 1 })
              if (model) {
                model(1)
              }
            }}
            isActive={page === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPageCount - 1, page + 1)

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => {
                setParams({ page: i })
                if (model) {
                  model(i)
                }
              }}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (page < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationLink
            onClick={() => {
              setParams({ page: totalPageCount })
              if (model) {
                model(totalPageCount)
              }
            }}
            isActive={page === totalPageCount}
          >
            {totalPageCount}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      {/* {pageSizeSelectOptions && (
        <div className="flex flex-col gap-4 flex-1">
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )} */}
      <Pagination className={cn({ 'md:justify-end': pageSizeSelectOptions })}>
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem>
            <If condition={page > 1}>
              <PaginationPrevious
                onClick={() => {
                  setParams({ page: Math.max(page - 1, 1) })
                  if (model) {
                    model(Math.max(page - 1, 1))
                  }
                }}
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : undefined}
                className={
                  page === 1 ? 'pointer-events-none opacity-50' : undefined
                }
              />
            </If>
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <If condition={page < totalPageCount}>
              <PaginationNext
                onClick={() => {
                  setParams({ page: Math.min(page + 1, totalPageCount) })
                  if (model) {
                    model(Math.min(page + 1, totalPageCount))
                  }
                }}
                aria-disabled={page === totalPageCount}
                tabIndex={page === totalPageCount ? -1 : undefined}
                className={
                  page === totalPageCount
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
              />
            </If>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

// function SelectRowsPerPage({
//   options,
//   setPageSize,
//   pageSize,
// }: {
//   options: number[]
//   setPageSize: (newSize: number) => void
//   pageSize: number
// }) {
//   return (
//     <div className="flex items-center gap-4">
//       <span className="whitespace-nowrap text-sm">Rows per page</span>

//       <Select
//         value={String(pageSize)}
//         onValueChange={(value) => setPageSize(Number(value))}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select page size">
//             {String(pageSize)}
//           </SelectValue>
//         </SelectTrigger>
//         <SelectContent>
//           {options.map((option) => (
//             <SelectItem key={option} value={String(option)}>
//               {option}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   )
// }
