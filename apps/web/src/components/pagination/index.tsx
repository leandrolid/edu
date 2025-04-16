'use client'

import { useQueryState } from '@/react/hooks/use-query-state'
import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import { Box, Flex, IconButton, Strong } from '@radix-ui/themes'

export const Pagination = ({
  total,
  totalPages,
  page,
  pageSize,
}: {
  total: number
  totalPages: number
  page: number
  pageSize: number
}) => {
  const { setQueryState } = useQueryState()
  const start = Math.min(page * pageSize - (pageSize - 1), total)
  const end = Math.min(page * pageSize, total)
  const nextPages = Array.from({ length: 3 }, (_, index) =>
    Math.min(page + index + 1, totalPages - 3),
  ).reduce((acc, current) => {
    if (!acc.includes(current)) acc.push(current)
    return acc
  }, [] as number[])
  return (
    <Flex align="center" justify="end" p="4">
      <Box mr="2">
        Mostrando de {start} a {end} de <Strong>{total} resultados</Strong>
      </Box>
      <Flex gap="2">
        <IconButton
          variant="outline"
          color="gray"
          size="2"
          disabled={page === 1}
          onClick={() => setQueryState('page', String(page - 1))}
        >
          <CaretLeft weight="bold" />
        </IconButton>
        {totalPages > 3 && (
          <>
            {nextPages.map((currentPage) => {
              return (
                <IconButton
                  key={currentPage}
                  variant="ghost"
                  style={{ margin: 0 }}
                  color="gray"
                  size="2"
                  onClick={() => setQueryState('page', String(currentPage))}
                >
                  {currentPage}
                </IconButton>
              )
            })}
            <div>...</div>
            {Array.from({ length: 3 }, (_, index) => (
              <IconButton
                key={index}
                variant="ghost"
                style={{ margin: 0 }}
                color="gray"
                size="2"
                onClick={() => setQueryState('page', String(totalPages - (2 - index)))}
              >
                {totalPages - (2 - index)}
              </IconButton>
            ))}
          </>
        )}

        <IconButton
          variant="outline"
          color="gray"
          size="2"
          disabled={page === totalPages}
          onClick={() => setQueryState('page', String(page + 1))}
        >
          <CaretRight weight="bold" />
        </IconButton>
      </Flex>
    </Flex>
  )
}
