import React from 'react'
import { useRouter } from 'next/router'

import { PRIZE_PAGE_SIZE } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { TableRowUILoader } from 'lib/components/loaders/TableRowUILoader'
import { PaginationUI } from 'lib/components/PaginationUI'
import { PrizesTable } from 'lib/components/PrizesTable'
import { usePoolPrizesQuery } from 'lib/hooks/usePoolPrizesQuery'

export const PoolPrizeListing = (props) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { pool } = props

  const page = router?.query?.page ? parseInt(router.query.page, 10) : 1
  const skip = (page - 1) * PRIZE_PAGE_SIZE
  const { data, error, isFetching, isFetched } = usePoolPrizesQuery(pool, page, skip)

  let prizes = data?.prizePool?.prizes

  if (!prizes || (isFetching && !isFetched)) {
    return (
      <div className='mt-10'>
        <TableRowUILoader rows={5} />
      </div>
    )
  }

  const prizeCount = pool.currentPrizeId

  const pages = Math.ceil(Number(prizeCount / PRIZE_PAGE_SIZE))

  const baseAsPath = `/prizes/${pool.symbol}`
  const baseHref = '/prizes/[symbol]'

  const asPath = (pageNum) => `${baseAsPath}?page=${pageNum}`
  const nextPage = page + 1
  const prevPage = page - 1
  const nextPath = asPath(nextPage)
  const prevPath = asPath(prevPage)

  return (
    <>
      <div className='flex flex-col items-center text-center mt-4'>
        {error && (
          <>
            {t('thereWasAnErrorLoadingData')}
            <br />
            {error}
          </>
        )}

        {prizes?.length === 0 && (
          <>
            <BlankStateMessage>
              <div className='mb-4'>
                {t('thereAreNoPrizesYet')}
                {/* There are no prizes for this pool yet. */}
              </div>
              <ButtonLink
                secondary
                href='/pools/[symbol]/manage'
                as={`/pools/${pool?.symbol}/manage`}
              >
                {t('managePool')}
              </ButtonLink>
            </BlankStateMessage>
          </>
        )}

        {prizes?.length > 0 && (
          <>
            <PrizesTable {...props} pool={pool} prizes={prizes} />

            <PaginationUI
              prevPath={prevPath}
              nextPath={nextPath}
              prevPage={prevPage}
              nextPage={nextPage}
              currentPage={page}
              currentPath={asPath(page)}
              firstPath={asPath(1)}
              lastPath={asPath(pages)}
              hrefPathname={baseHref}
              lastPage={pages}
              showFirst={page > 2}
              showLast={pages > 2 && page < pages - 1}
              showPrev={page > 1}
              showNext={pages > page}
            />
          </>
        )}
      </div>
    </>
  )
}
