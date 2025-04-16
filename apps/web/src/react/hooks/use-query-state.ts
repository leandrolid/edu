'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const useQueryState = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const timer = useRef<NodeJS.Timeout | null>(null)

  const setQueryState = (key: string, value: string) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      replace(`${pathname}?${params.toString()}`)
    }, 300)
  }

  const getQueryState = (key: string) => {
    return searchParams.get(key)
  }

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  return {
    setQueryState,
    getQueryState,
  }
}
