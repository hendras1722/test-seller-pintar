import { cn } from '@/utils/lib'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import React, { useEffect, useRef } from 'react'
import Calendar from './CalendarComponent'

interface DateRange {
  from: Date
  to: Date
}

interface DatePickerProps {
  selected?: DateRange
  onSelect?: (date: DateRange) => void
  className?: string
  refetch?: (page?: number) => void
}

export default function DatePicker({
  selected = {
    from: new Date(),
    to: new Date(),
  },
  onSelect,
  className,
  refetch,
}: DatePickerProps) {
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousSelectedRef = useRef<DateRange | null>(null)

  // Handle refetch with debouncing to prevent double calls
  useEffect(() => {
    // Only trigger refetch when both dates are selected and values have actually changed
    if (
      selected?.from &&
      selected?.to &&
      refetch &&
      previousSelectedRef.current &&
      (previousSelectedRef.current.from.getTime() !== selected.from.getTime() ||
        previousSelectedRef.current.to?.getTime() !== selected.to.getTime())
    ) {
      // Clear any existing timeout
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current)
      }

      // Set new timeout for refetch
      refetchTimeoutRef.current = setTimeout(() => {
        refetch()
      }, 500) // Reduced timeout for better UX
    }

    // Update previous selected reference
    previousSelectedRef.current = selected ? { ...selected } : null

    // Cleanup timeout on unmount
    return () => {
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current)
      }
    }
  }, [selected, refetch])

  const handleDateSelect = (newDate: DateRange) => {
    if (onSelect) {
      onSelect(newDate)
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !selected && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected?.from ? (
              selected.to ? (
                <>
                  {format(selected.from, 'PPP')} - {format(selected.to, 'PPP')}
                </>
              ) : (
                format(selected.from, 'PPP')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={selected}
            onSelect={handleDateSelect}
            showOutsideDays={true}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
