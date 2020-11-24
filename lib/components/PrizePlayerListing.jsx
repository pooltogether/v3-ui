import React from 'react'
import { useRouter } from 'next/router'

import { PLAYER_PAGE_SIZE } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PaginationUI } from 'lib/components/PaginationUI'
import { PlayersTable } from 'lib/components/PlayersTable'
// import { prizePlayersQuery } from 'lib/queries/prizePlayersQuery'
// import { timeTravelPrizePlayersQuery } from 'lib/queries/timeTravelPrizePlayersQuery'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import PlayersIcon from 'assets/images/players@2x.png'

export const PrizePlayerListing = (
  props,
) => {
  const { t } = useTranslation()
  const { isFetching, players, pool, prize } = props

  const router = useRouter()

  const playerCount = pool?.playerCount

  const prizeNumber = router?.query?.prizeNumber
  const page = router?.query?.page ?
    parseInt(router.query.page, 10) :
    1
  const pages = Math.ceil(Number(playerCount / PLAYER_PAGE_SIZE))

  if (!prize && prize !== null) {
    return <div
      className='mt-10'
    >
      <IndexUILoader />
    </div>
  }

  const asPath = (pageNum) => `/prizes/${pool?.symbol}/${prizeNumber}?page=${pageNum}`
  const nextPage = page + 1
  const prevPage = page - 1
  const nextPath = asPath(nextPage)
  const prevPath = asPath(prevPage)

  return <>
    <div
      id='awards-table'
      className='non-interactable-card mt-2 sm:mt-10 py-4 sm:py-6 px-4 xs:px-4 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    >
      <div
        className='text-caption uppercase mb-3'
      >
        <img
          src={PlayersIcon}
          className='inline-block mr-2 card-icon'
        /> {t('players')}
      </div>
      <h3>
        {numberWithCommas(pool?.playerCount || 0, { precision: 0 })}
      </h3>


      {players?.length === 0 && <>
        {t('noPlayers')}
      </>}

      <div
        className='xs:bg-primary theme-light--no-padding text-inverse flex flex-col justify-between rounded-lg p-0 xs:p-3 sm:px-8 mt-4'
        style={{
          minHeight: 540
        }}
      >

        {isFetching && <V3LoadingDots />}

        {players?.length > 0 && <>
          <PlayersTable
            nestedTable
            pool={pool}
            players={players}
            prize={prize}
          />

          <PaginationUI
            prevPath={prevPath}
            nextPath={nextPath}
            prevPage={prevPage}
            nextPage={nextPage}
            currentPage={page}
            currentPath={asPath(page)}
            firstPath={asPath(1)}
            lastPath={asPath(pages)}
            hrefPathname='/prizes/[symbol]/[prizeNumber]'
            lastPage={pages}
            showFirst={page > 2}
            showLast={pages > 2 && page < pages - 1}
            showPrev={page > 1}
            showNext={pages > page}
          />
        </>}

      </div>
    </div>

  </>
}
