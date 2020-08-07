import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PlayersTable } from 'lib/components/PlayersTable'
import { prizePlayersQuery } from 'lib/queries/prizePlayersQuery'

export const PrizePlayerListing = (
  props,
) => {
  const { pool, prize } = props

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const timeTravelPlayersQuery = prizePlayersQuery(prize?.awardedBlock)

  const variables = {
    prizePoolAddress: pool.poolAddress,
    first: 10,
    skip: 0
  }

  const { loading, error, data } = useQuery(timeTravelPlayersQuery, {
    variables,
    skip: !pool || !prize,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  let players = data?.players

  // // need to stash in new array due to strict mode / read only error
  // let reversedPrizes = prizes && [...prizes]
  // if (reversedPrizes) {
  //   reversedPrizes = reversedPrizes.reverse()
  // }

  if (!prize && prize !== null) {
    return <div
      className='mt-10'
    >
      <IndexUILoader />
    </div>
  }

  return <>
    <div
      className='flex flex-col items-center text-center mt-10'
    >
      {error && <>
        There was an issue loading data from The Graph:
        {error.message}
      </>}

      {players?.length === 0 && <>
        no players
      </>}

      <PlayersTable
        pool={pool}
        players={players}
      />
    </div>

  </>
}
