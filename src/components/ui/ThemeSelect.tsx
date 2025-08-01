'use client'

import React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { useTheme, type Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const themeConfig = {
  light: {
    icon: Sun,
    label: 'Light',
  },
  dark: {
    icon: Moon,
    label: 'Dark',
  },
  system: {
    icon: Monitor,
    label: 'System',
  },
} as const

interface ThemeSelectProps {
  className?: string
}

export function ThemeSelect({ className }: ThemeSelectProps) {
  const { theme, setTheme, loading } = useTheme()

  const handleThemeChange = async (newTheme: Theme) => {
    try {
      await setTheme(newTheme)
    } catch (error) {
      console.error('Failed to change theme:', error)
    }
  }

  const currentConfig = themeConfig[theme]
  const CurrentIcon = currentConfig.icon

  return (
    <Select value={theme} onValueChange={handleThemeChange} disabled={loading}>
      <SelectTrigger
        className={cn(
          'w-auto border-0 bg-transparent p-2 h-auto hover:bg-secondary/50 transition-colors',
          'focus:ring-0 focus:ring-offset-0 [&>svg]:ml-0 [&>svg]:h-4 [&>svg]:w-4',
          className,
        )}
        aria-label="Change theme"
      >
        <SelectValue asChild>
          <div className="flex items-center">
            <CurrentIcon
              size={20}
              className="text-muted-foreground hover:text-foreground transition-colors"
            />
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[130px]">
        {Object.entries(themeConfig).map(([themeKey, config]) => {
          const Icon = config.icon
          return (
            <SelectItem key={themeKey} value={themeKey} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Icon size={16} />
                <span>{config.label}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export default ThemeSelect
