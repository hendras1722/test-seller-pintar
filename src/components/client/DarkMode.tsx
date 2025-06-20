'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Else, If } from '@/components/if'
import { useToggle } from '@msa_cli/react-composable'

export default function DarkMode() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useToggle(false)

  useEffect(() => {
    setMounted()
  }, [])

  function handleMode() {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  if (!mounted) return null

  return (
    <span>
      <If condition={theme === 'light'}>
        <button onClick={() => handleMode()}>
          <Moon />
        </button>
        <Else>
          <button onClick={() => handleMode()}>
            <Sun />
          </button>
        </Else>
      </If>
    </span>
  )
}
