'use client'

import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from '@/shared/Pagination'
import { getPageNumbers } from '@/utils/pagination'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useMemo } from 'react'

interface Props {
  totalPages?: number
  className?: string
}

function PaginationComponent({ totalPages = 1, className }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const currentPage = Number(searchParams.get('page')) || 1
  const pageItems = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages])

  if (totalPages <= 1) return null

  return (
    <Pagination className={className}>
      <PaginationPrevious
        href={currentPage > 1 ? pathname + '?' + createQueryString('page', (currentPage - 1).toString()) : null}
      />
      <PaginationList>
        {pageItems.map((item, idx) =>
          item === 'gap' ? (
            <PaginationGap key={`gap-${idx}`} />
          ) : (
            <PaginationPage
              key={item}
              current={item === currentPage}
              href={pathname + '?' + createQueryString('page', item.toString())}
            >
              {item}
            </PaginationPage>
          )
        )}
      </PaginationList>
      <PaginationNext
        href={
          currentPage < totalPages ? pathname + '?' + createQueryString('page', (currentPage + 1).toString()) : null
        }
      />
    </Pagination>
  )
}

export default function PaginationWrapper(props: Props) {
  return (
    <Suspense>
      <PaginationComponent {...props} />
    </Suspense>
  )
}
