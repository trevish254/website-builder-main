'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Avoid hydration mismatch
  }

  const isDark = theme === 'dark'

  return (
    <div
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-16 h-8 rounded-full bg-border/30 border border-border/50 cursor-pointer shadow-inner backdrop-blur-md transition-all hover:bg-border/50 flex items-center p-1"
    >
      <div className="absolute inset-0 flex justify-between items-center px-2">
        <Sun className="h-4 w-4 text-orange-400 opacity-50" />
        <Moon className="h-4 w-4 text-rose-400 opacity-50" />
      </div>

      <div
        className={`relative z-10 h-6 w-6 rounded-full bg-white dark:bg-black shadow-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isDark ? 'translate-x-8' : 'translate-x-0'
          }`}
      >
        <Sun
          className={`absolute h-4 w-4 text-orange-500 transition-all duration-300 ${isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
            }`}
        />
        <Moon
          className={`absolute h-4 w-4 text-rose-500 transition-all duration-300 ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
            }`}
        />
      </div>
    </div>
  )
}
