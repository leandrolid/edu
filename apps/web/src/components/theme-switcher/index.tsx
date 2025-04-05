'use client'

import { Moon, Sun } from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'

import { useThemeContext } from '@radix-ui/themes'
export const ThemeSwitcher = () => {
  const { appearance, onAppearanceChange } = useThemeContext()
  return (
    <IconButton
      variant="ghost"
      color="gray"
      onClick={() => onAppearanceChange(appearance === 'light' ? 'dark' : 'light')}
      aria-label="Theme"
    >
      {appearance === 'light' ? <Sun weight="bold" /> : <Moon weight="bold" />}
    </IconButton>
  )
}
