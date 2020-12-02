import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { sub, fromUnixTime } from 'date-fns'
import { compact } from 'lodash'

import {
  DEFAULT_TOKEN_PRECISION,
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { DateValueLineGraph } from 'lib/components/DateValueLineGraph'
import { usePoolPrizesQuery } from 'lib/hooks/usePoolPrizesQuery'

const NUMBER_OF_POINTS = 10

export const TicketsSoldGraph = (
  props,
) => {
  const { pool } = props

  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const first = NUMBER_OF_POINTS
  const { status, data, error, isFetching } = usePoolPrizesQuery(pauseQueries, chainId, pool, first)

  let prizes = compact([].concat(data?.prizePool?.prizes))

  if (error) {
    console.error(error)
  }

  const decimals = pool?.underlyingCollateralDecimals

  if (!decimals || !prizes.length || isFetching) {
    return null
  }


  const lastPrize = prizes[0]
  let currentPrize

  // If we have a prize amount then we know the last prize has been rewarded
  if (lastPrize?.awardedBlock) {
    // unsure why we need to divide by 1000 here when we do it again
    // when compiling the array ...
    currentPrize = {
      ticketSupply: pool.ticketSupply,
      awardedTimestamp: Date.now() / 1000
    }

    prizes.unshift(currentPrize)
  }


  const dataArray = prizes.map(prize => {
    if (!prize) {
      console.warn('why no prize here?', prize)
    }

    const tickets = prize?.awardedBlock ? prize?.totalTicketSupply : prize?.ticketSupply

    const ticketsSold = ethers.utils.formatUnits(
      tickets || '0',
      decimals || DEFAULT_TOKEN_PRECISION
    )

    return {
      value: parseInt(ticketsSold, 10),
      date: fromUnixTime(prize.awardedTimestamp),
    }
  })

  if (dataArray.length < NUMBER_OF_POINTS) {
    dataArray.push({
      value: 0,
      date: sub(
        dataArray[dataArray.length-1].date,
        {
          years: 0,
          months: 0,
          weeks: 1,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        }
      )
    })
  }

  return <>
    <DateValueLineGraph
      id='tickets-sold-graph'
      valueLabel='Tickets'
      data={[dataArray]}
    />

  </>
}
