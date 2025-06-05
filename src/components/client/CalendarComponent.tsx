import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const cn = (...classes) => classes.filter(Boolean).join(' ')

const getTodayInLocalTimezone = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const createDateAtMidnight = (year, month, date) => {
  return new Date(year, month, date)
}

export default function Calendar({
  className = '',
  showOutsideDays = true,
  selected,
  onSelect,
  mode = 'single',
  ...props
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    const now = new Date()
    const todayLocal = getTodayInLocalTimezone()

    setDebugInfo({
      rawDate: now.toString(),
      utcDate: now.toISOString(),
      localDateOnly: todayLocal.toString(),
      localISOString: todayLocal.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: now.getTimezoneOffset(),
    })
  }, [])

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  type CalendarDay = {
    date: number
    isCurrentMonth: boolean
    isToday: boolean
    fullDate: Date
  }

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: CalendarDay[] = []
    const today = getTodayInLocalTimezone()

    // Previous month days
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayDate = createDateAtMidnight(
        year,
        month - 1,
        prevMonth.getDate() - i
      )
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false,
        fullDate: dayDate,
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = createDateAtMidnight(year, month, day)
      const isToday = dayDate.getTime() === today.getTime()

      days.push({
        date: day,
        isCurrentMonth: true,
        isToday,
        fullDate: dayDate,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const dayDate = createDateAtMidnight(year, month + 1, day)
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        fullDate: dayDate,
      })
    }

    return days
  }

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const handleDayClick = (day) => {
    if (!onSelect) return

    if (mode === 'single') {
      onSelect(day.fullDate)
    } else if (mode === 'range') {
      if (!selected || (!selected.from && !selected.to)) {
        onSelect({ from: day.fullDate, to: null })
      } else if (selected.from && !selected.to) {
        const startDate = selected.from
        const endDate = day.fullDate

        if (endDate < startDate) {
          onSelect({ from: endDate, to: startDate })
        } else {
          onSelect({ from: startDate, to: endDate })
        }
      } else {
        onSelect({ from: day.fullDate, to: null })
      }
    }
  }

  const isDateInRange = (date, range) => {
    if (!range || !range.from || !date) return false
    if (!range.to) return false
    return date >= range.from && date <= range.to
  }

  const isDateRangeStart = (date, range) => {
    if (!range || !range.from || !date) return false
    return date.getTime() === range.from.getTime()
  }

  const isDateRangeEnd = (date, range) => {
    if (!range || !range.to || !date) return false
    return date.getTime() === range.to.getTime()
  }

  const getDayClasses = (day) => {
    let classes = [
      'inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 w-10 transition-all duration-200 ease-in-out relative',
      'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
    ]

    if (day.isCurrentMonth) {
      classes.push('text-gray-900 hover:text-gray-900')
    } else {
      classes.push('text-gray-400 hover:text-gray-600 hover:bg-gray-50')
    }

    if (mode === 'single') {
      const isSelected =
        selected &&
        day.fullDate &&
        day.fullDate.getTime() === selected.getTime()

      if (day.isToday && day.isCurrentMonth && !isSelected) {
        classes.push('bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-200')
      }

      if (isSelected) {
        classes.push('bg-blue-600 text-white hover:bg-blue-700 font-semibold')
      }
    } else if (mode === 'range') {
      const isInRange = isDateInRange(day.fullDate, selected)
      const isRangeStart = isDateRangeStart(day.fullDate, selected)
      const isRangeEnd = isDateRangeEnd(day.fullDate, selected)

      if (day.isToday && day.isCurrentMonth && !isInRange) {
        classes.push('bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-200')
      }

      if (isInRange && !isRangeStart && !isRangeEnd) {
        classes.push('bg-blue-100 text-blue-900 hover:bg-blue-200 rounded-none')
      }

      if (isRangeStart || isRangeEnd) {
        classes.push('bg-blue-600 text-white hover:bg-blue-700 font-semibold')
      }

      if (isRangeStart && isRangeEnd) {
        classes.push('rounded-lg')
      } else if (isRangeStart) {
        classes.push('rounded-l-lg rounded-r-none')
      } else if (isRangeEnd) {
        classes.push('rounded-r-lg rounded-l-none')
      }
    }

    return cn(...classes)
  }

  const days = getDaysInMonth(currentMonth)
  const monthYear = `${
    months[currentMonth.getMonth()]
  } ${currentMonth.getFullYear()}`

  return (
    <div className={cn('p-6 rounded-xl max-w-2xl ', className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-9 w-9 bg-transparent border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 ease-in-out"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          {monthYear}
        </h2>

        <button
          onClick={() => navigateMonth(1)}
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-9 w-9 bg-transparent border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 ease-in-out"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-gray-500 text-sm font-semibold text-center py-2 h-10 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDayClick(day)}
            className={getDayClasses(day)}
          >
            {day.date}
            {day.isToday && day.isCurrentMonth && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
