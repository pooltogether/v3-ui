import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'
import { fromUnixTime } from 'date-fns'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { DateValueLineGraph } from 'lib/components/DateValueLineGraph'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'

export const TicketsSoldGraph = (
  props,
) => {
  const { pool } = props

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const { loading, error, data } = useQuery(poolPrizesQuery, {
    variables: {
      prizeStrategyAddress: pool?.prizeStrategyAddress,
      first: 7,
    },
    skip: !pool?.prizeStrategyAddress,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  let prizes = [].concat(data?.prizeStrategy?.prizes)

  if (error) {
    console.error(error)
  }

  if (!prizes || loading) {
    return null
  }

  const decimals = pool.underlyingCollateralDecimals



  const lastPrize = prizes[0]
  let currentPrize

  // If we have a prize amount then we know the last prize has been rewarded
  if (lastPrize?.awardedBlock) {
    // unsure why we need to divide by 1000 here when we do it again
    // when compiling the array ...
    currentPrize = {
      totalTicketSupply: pool.totalSupply,
      awardedTimestamp: Date.now() / 1000
    }

    prizes.unshift(currentPrize)
  }


  const dataArray = prizes.map(prize => {
    if (!prize) {
      console.warn('why no prize here?', prize)
    }
    const ticketsSold = ethers.utils.formatUnits(
      prize?.totalTicketSupply || '0',
      decimals
    )

    return {
      value: parseInt(ticketsSold, 10),
      date: fromUnixTime(prize.awardedTimestamp / 1000),
    }
  })

  return <>
    <DateValueLineGraph
      id='tickets-sold-graph'
      valueLabel='Tickets'
      data={[dataArray]}
    />

  </>
}
