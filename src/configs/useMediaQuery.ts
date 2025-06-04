import { useState, useEffect } from 'react'

// Default Tailwind CSS breakpoints
const defaultBreakpoints = {
  xs: 0, // Extra small devices
  sm: 640, // Small devices
  md: 768, // Medium devices
  lg: 1024, // Large devices
  xl: 1280, // Extra large devices
  '2xl': 1536, // 2X Large devices
} as const

type BreakpointRecord = Record<string, number>

type BreakpointResult<T extends BreakpointRecord> = {
  [K in keyof T]: boolean
} & {
  current: keyof T
  width: number
}

export const useBreakpoints = <T extends BreakpointRecord>(
  breakpoints?: T
): BreakpointResult<T extends undefined ? typeof defaultBreakpoints : T> => {
  const bp = (breakpoints ?? defaultBreakpoints) as T extends undefined
    ? typeof defaultBreakpoints
    : T

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const breakpointStates = {} as any

  Object.keys(bp).forEach((key) => {
    breakpointStates[key] = windowWidth >= bp[key]
  })

  const getCurrentBreakpoint = () => {
    const sortedBreakpoints = Object.entries(bp).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )

    for (const [name, width] of sortedBreakpoints) {
      if (windowWidth >= (width as number)) {
        return name
      }
    }
    return Object.keys(bp)[0]
  }

  return {
    ...breakpointStates,
    current: getCurrentBreakpoint(),
    width: windowWidth,
  } as BreakpointResult<T extends undefined ? typeof defaultBreakpoints : T>
}
