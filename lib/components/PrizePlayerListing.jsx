import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PaginationUI } from 'lib/components/PaginationUI'
import { PlayersTable } from 'lib/components/PlayersTable'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { prizePlayersQuery } from 'lib/queries/prizePlayersQuery'

export const PrizePlayerListing = (
  props,
) => {
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

  const timeTravelPlayersQuery = prizePlayersQuery(prize?.awardedBlock)

  const variables = {
    prizePoolAddress: pool.poolAddress,
    first: pageSize,
    skip
  }

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
    skip: !pool || !prize,
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
      className='flex flex-col items-center text-center mt-8'
    >
      {error && <>
        There was an issue loading data:
        {error.message}
      </>}

      {players?.length === 0 && <>
        no players
      </>}

      <TimeTravelPool
        pool={pool}
        prize={prize}
      >
        {(timeTravelPool) => {
          return <PlayersTable
            timeTravelTotalSupply={timeTravelPool?.totalSupply}
            pool={pool}
            players={players}
          />
        }}
      </TimeTravelPool>

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

  </>
}
