'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/utils/lib'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-4 bg-white rounded-lg shadow-sm border', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4 w-full',
        caption: 'flex justify-between items-center mb-4',
        caption_label: 'text-lg font-semibold text-gray-900',
        nav: 'flex items-center space-x-1',
        nav_button: cn(
          'inline-flex items-center justify-center rounded-lg text-sm font-medium',
          'h-9 w-9 bg-transparent border border-gray-200 hover:bg-gray-50 hover:border-gray-300',
          'transition-colors duration-200 ease-in-out'
        ),
        nav_button_previous: '',
        nav_button_next: '',
        table: 'w-full border-collapse mt-4',
        head_row: 'flex mb-2',
        head_cell:
          'text-gray-600 rounded-md w-10 h-10 font-medium text-sm flex items-center justify-center',
        row: 'flex w-full',
        cell: cn(
          'relative p-0 text-center text-sm',
          'focus-within:relative focus-within:z-20',
          'h-10 w-10'
        ),
        day: cn(
          'inline-flex items-center justify-center rounded-md text-sm font-normal',
          'h-10 w-10 p-0 transition-colors duration-200 ease-in-out',
          'hover:bg-gray-100 hover:text-gray-900',
          'focus:bg-gray-100 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'aria-selected:bg-blue-600 aria-selected:text-white aria-selected:hover:bg-blue-700',
          'data-[today]:bg-blue-50 data-[today]:text-blue-600 data-[today]:font-semibold'
        ),
        day_selected:
          'bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700',
        day_today: 'bg-blue-50 text-blue-600 font-semibold',
        day_outside: 'text-gray-400 hover:bg-gray-50 hover:text-gray-600',
        day_disabled: 'text-gray-300 cursor-not-allowed hover:bg-transparent',
        day_range_middle: 'bg-blue-100 text-blue-900 hover:bg-blue-200',
        day_range_start: 'bg-blue-600 text-white hover:bg-blue-700',
        day_range_end: 'bg-blue-600 text-white hover:bg-blue-700',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight
          return <Icon className="h-4 w-4" />
        },
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }
