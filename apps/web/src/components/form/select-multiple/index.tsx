'use client'

import { CaretDown } from '@phosphor-icons/react/dist/ssr'
import { Box, Button, Checkbox, Flex, Popover, Skeleton, Text } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import styles from './styles.module.css'

type Props = {
  id?: string
  name?: string
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  options: Array<{
    value: string
    label: string
  }>
  loading?: boolean
  maxSelections?: number
}

export const SelectMultiple = ({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  disabled,
  options,
  loading,
  maxSelections,
}: Props) => {
  const [selected, setSelected] = useState<string[]>([])
  const isAllSelected = selected.length === options.length

  useEffect(() => {
    setSelected((prev) => {
      if (prev.length === value.length && prev.every((v) => value.includes(v))) return prev
      return value
    })
  }, [value])

  const handleCheckItem = (value: string) => {
    const newValues = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : !maxSelections || selected.length < maxSelections
        ? [...selected, value]
        : selected

    setSelected(newValues)
    onValueChange(newValues)
  }

  const handleCheckAll = () => {
    const newValues = isAllSelected
      ? []
      : options.slice(0, maxSelections ?? options.length).map((o) => o.value)

    setSelected(newValues)
    onValueChange(newValues)
  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button
          type="button"
          variant="outline"
          color="gray"
          disabled={disabled}
          className={styles.trigger}
        >
          {placeholder && !selected.length
            ? placeholder
            : `${selected.length} selecionados${maxSelections ? ` (máximo: ${maxSelections})` : ''}`}
          <CaretDown weight="regular" style={{ marginLeft: 'auto' }} />
        </Button>
      </Popover.Trigger>
      <Popover.Content maxWidth="20rem" maxHeight="calc(100vh - 20rem)">
        <Box>
          <Flex direction="column">
            {loading ? (
              <Skeleton loading />
            ) : (
              <>
                {!maxSelections && (
                  <Text
                    as="label"
                    htmlFor={`${id}-selectAll`}
                    className={styles.selectItem}
                    data-selected={isAllSelected}
                  >
                    <Checkbox
                      id={`${id}-selectAll`}
                      name={`${name}-selectAll`}
                      checked={isAllSelected}
                      onCheckedChange={handleCheckAll}
                      size="2"
                    />
                    <Text trim="both" truncate>
                      Selecionar todos
                    </Text>
                  </Text>
                )}
                {options.map((option, index) => (
                  <Text
                    key={`${id}-${option.value}-${index}`}
                    as="label"
                    htmlFor={`${id}-${option.value}-${index}`}
                    className={styles.selectItem}
                    data-selected={isAllSelected}
                    trim="end"
                  >
                    <Checkbox
                      id={`${id}-${option.value}-${index}`}
                      name={`${name}-${option.value}`}
                      checked={selected.includes(option.value)}
                      onCheckedChange={() => handleCheckItem(option.value)}
                      size="2"
                    />
                    <Text trim="both" truncate>
                      {option.label}
                    </Text>
                  </Text>
                ))}
              </>
            )}
          </Flex>
        </Box>
      </Popover.Content>
    </Popover.Root>
  )
}
