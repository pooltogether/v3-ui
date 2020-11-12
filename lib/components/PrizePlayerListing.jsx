import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PaginationUI } from 'lib/components/PaginationUI'
import { PlayersTable } from 'lib/components/PlayersTable'
import { prizePlayersQuery } from 'lib/queries/prizePlayersQuery'

import PlayersIcon from 'assets/images/players@2x.png'

export const PrizePlayerListing = (
  props,
) => {
  const { t } = useTranslation()
  const { pool, prize } = props

  const router = useRouter()

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const playerCount = pool?.playerCount

  const prizeNumber = router?.query?.prizeNumber
  const pageSize = 10
  const page = router?.query?.page ?
    parseInt(router.query.page, 10) :
    1
  const skip = (page - 1) * pageSize
  const pages = Math.ceil(Number(playerCount / pageSize, 10))

  let blockNumber
  if (prize?.awardedBlock) {
    blockNumber = prize?.awardedBlock - 1
  }

  const timeTravelPlayersQuery = prizePlayersQuery(blockNumber)

  const variables = {
    prizePoolAddress: pool.poolAddress,
    first: pageSize,
    skip
  }
  console.log(variables)

  let fetchAndPoolOptions = {
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  }

  // only historical, don't ping the graph multiple times
  if (prize?.awardedBlock) {
    fetchAndPoolOptions = {}
  }

  const { loading, error, data } = useQuery(timeTravelPlayersQuery, {
    variables,
    skip: !pool || !pool.poolAddress || !prize,
    ...fetchAndPoolOptions
  })

  if (error) {
    console.error(error)
  }

  let players = data?.players

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
        {pool?.playerCount || null}
      </h3>




      {error && <>
        There was an issue loading data:
        <br />{error.message}
      </>}

      {players?.length === 0 && <>
        {t('noPlayers')}
      </>}


      



      {players?.length > 0 && <>
        <div
          className='xs:bg-primary theme-light--no-padding text-inverse flex flex-col justify-between rounded-lg p-0 xs:p-3 sm:px-8 mt-4'
        >

          <PlayersTable
            nestedTable
            timeTravelTicketSupply={pool?.ticketSupply}
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

        </div>


      </>}


    </div>

  </>
}
