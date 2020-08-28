import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'
import { fromUnixTime } from 'date-fns'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { DateValueLineGraph } from 'lib/components/DateValueLineGraph'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const TicketsSoldGraph = (
  props,
) => {
  const { pool } = props

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const { loading, error, data } = useQuery(poolPrizesQuery, {
    variables: {
      prizeStrategyAddress: pool?.prizeStrategyAddress
    },
    skip: !pool?.prizeStrategyAddress,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  let prizes = data?.prizeStrategy?.prizes

  if (error) {
    console.error(error)
  }

  if (!prizes || loading) {
    return null
  }

  const decimals = pool.underlyingCollateralDecimals

  const dataArray = prizes.map(prize => {
    const ticketsSold = ethers.utils.formatUnits(prize.totalTicketSupply, decimals)
    
    return {
      value: parseInt(ticketsSold, 10),
      date: fromUnixTime(prize.awardedTimestamp),
    }
  })

  return <>
    <DateValueLineGraph
      valueLabel='Tickets'
      data={[dataArray]}
      // [
      //   [
      //     {
      //       date: new Date(98, 1),
      //       value: 100,
      //     },
      //     {
      //       date: new Date(2001, 1),
      //       value: 400,
      //     },
      //     {
      //       date: new Date(),
      //       value: 200,
      //     }
      //   ]
      // ]
    />

  </>
}
