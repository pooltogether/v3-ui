import React, { useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { shorten } from 'lib/utils/shorten'

export const LastWinnersListing = (
  props,
) => {
  const { pool } = props

  const decimals = pool?.underlyingCollateralDecimals
  const ticker = pool?.underlyingCollateralSymbol
  const tickerUpcased = ticker?.toUpperCase()

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const { loading, error, data } = useQuery(poolPrizesQuery, {
    variables: {
      prizePoolAddress: pool?.poolAddress,
      first: 5,
    },
    skip: !pool?.poolAddress,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  let prizes = compact([].concat(data?.prizePools?.prizes))
  const players = prizes?.reduce(function (result, prize) {
    if (prize.winners && prize.winners.length > 0) {
      result.push({
        address: prize?.winners[0],
        winnings: prize?.net
      })
    }
    return result
  }, [])

  if (!players && players !== null) {
    return <TableRowUILoader
      rows={5}
    />
  }

  return <>
    {error && <>
      There was an issue loading last 5 winners:
      {error.message}
    </>}

    {players && players?.length === 0 ? <>
      <h6>
        No winners awarded yet...
      </h6>
    </> : <>
      {players.map(player => {
        return <Link
          key={`last-winners-${player?.address}-${player?.winnings}`}
          href='/players/[playerAddress]'
          as={`/players/${player?.address}`}
        >
          <a
            className='block font-bold bg-default mb-2 rounded-lg px-2 trans'
          >
            <span
              className='inline-block w-1/2 sm:w-1/2'
            >
              {shorten(player?.address)}
            </span>
            <span
              className='inline-block w-1/2 sm:w-1/2 text-left'
            >
              ${displayAmountInEther(
                player?.winnings,
                { decimals, precision: 2 }
              )} {tickerUpcased}
            </span>
          </a>
        </Link>
      })}
    </>}
  </>
}
