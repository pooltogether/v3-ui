import React from 'react'
import { useRouter } from 'next/router'

import { PLAYER_PAGE_SIZE } from 'lib/constants'
import { useTranslation } from 'react-i18next'
import { PaginationUI } from 'lib/components/PaginationUI'
import { PlayersTable } from 'lib/components/PlayersTable'
import { PodsCTA } from 'lib/components/PodsCTA'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const PrizePlayerListing = (props) => {
  const { t } = useTranslation()
  const { isFetched, balances, pool, prize, baseAsPath, baseHref } = props

  const router = useRouter()

  const playerCount = pool.tokens.ticket.numberOfHolders

  const page = router?.query?.page ? parseInt(router.query.page, 10) : 1
  const pages = Math.ceil(Number(playerCount / PLAYER_PAGE_SIZE))

  const asPath = (pageNum) => `${baseAsPath}?page=${pageNum}`
  const nextPage = page + 1
  const prevPage = page - 1
  const nextPath = asPath(nextPage)
  const prevPath = asPath(prevPage)

  return (
    <div
      id='player-listings-table'
      className='non-interactable-card mt-2 sm:mt-4 py-4 sm:py-6 px-4 xs:px-4 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    >
      <div className='text-accent-2 opacity-90 font-inter uppercase xs:text-sm'>
        {t('depositors')}
      </div>
      <h3>{numberWithCommas(playerCount || 0, { precision: 0 })}</h3>

      {balances?.length === 0 && <>{t('noPlayers')}</>}

      <div className='xs:bg-primary relative theme-light--no-gutter text-inverse flex flex-col justify-between rounded-lg p-0 xs:p-4 sm:px-8 mt-4 players-table-min-height'>
        {!isFetched && (
          <div className='w-full absolute opacity-60 bg-body left-0 top-0 rounded-lg' />
        )}

        {balances?.length > 0 && (
          <>
            <PodsCTA pool={pool} />

            <PlayersTable pool={pool} balances={balances} prize={prize} />

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
    </div>
  )
}
