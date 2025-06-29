'use client'

import { useQueryState } from '@/react/hooks/use-query-state'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { TextField } from '@radix-ui/themes'

export const TeamsFilter = () => {
  const { getQueryState, setQueryState } = useQueryState()
  return (
    <TextField.Root
      defaultValue={getQueryState('search')?.toString()}
      onChange={({ target }) => {
        setQueryState({ search: target.value, page: '1' })
      }}
      placeholder="Busque por times"
      size="2"
      style={{ width: '250px' }}
    >
      <TextField.Slot side="right">
        <MagnifyingGlass weight="regular" />
      </TextField.Slot>
    </TextField.Root>
  )
}
