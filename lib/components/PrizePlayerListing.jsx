import React from 'react'
import { useQuery } from '@apollo/client'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PlayersTable } from 'lib/components/PlayersTable'
import { prizePlayersQuery } from 'lib/queries/prizePlayersQuery'

export const PrizePlayerListing = (
  props,
) => {
  const { pool, prize } = props

  const timeTravelQuery = prizePlayersQuery(prize?.awardedBlock)

  const { loading, error, data } = useQuery(timeTravelQuery, {
    variables: {
      prizePoolAddress: pool.poolAddress,
      prizeId: prize.id,
      first: 10,
      skip: 0
    },
    skip: !pool || !prize,
    fetchPolicy: 'network-only',
    pollInterval: MAINNET_POLLING_INTERVAL,
  })

  console.log({ loading, error, data })

  if (error) {
    console.error(error)
  }

  let players = data?.players
    console.log({ players})

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
        {error}
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
