import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import ArrayMap from '../ArrayMap'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

interface BreadcrumbProps {
  disabled?: boolean
  href: string
  label: string
}

export default function BreadcrumbClient({
  items = [],
}: Readonly<{ items: BreadcrumbProps[] }>) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <ArrayMap
          of={items}
          render={(item, index) => {
            return (
              <Fragment key={index}>
                <BreadcrumbItem aria-disabled={item?.disabled}>
                  <BreadcrumbLink
                    aria-disabled={item?.disabled}
                    className={twMerge(item?.disabled && 'pointer-events-none')}
                  >
                    {item?.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="last:hidden" />
              </Fragment>
            )
          }}
        />
      </BreadcrumbList>
    </Breadcrumb>
  )
}
