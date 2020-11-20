import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'
import { sub, fromUnixTime } from 'date-fns'
import { compact } from 'lodash'

import {
  DEFAULT_TOKEN_PRECISION,
  MAINNET_POLLING_INTERVAL,
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { DateValueLineGraph } from 'lib/components/DateValueLineGraph'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'

const NUMBER_OF_POINTS = 7

export const TicketsSoldGraph = (
  props,
) => {
  const { pool } = props

  const { paused } = useContext(GeneralContext)

  const { loading, error, data } = useQuery(poolPrizesQuery, {
    variables: {
      prizePoolAddress: pool?.poolAddress,
      first: NUMBER_OF_POINTS,
    },
    skip: !pool?.poolAddress,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  let prizes = compact([].concat(data?.prizePools?.[0]?.prizes))

  // console.log('======================')
  // console.log('======================')
  // console.log('======================')
  // console.log({data, prizes})

  if (error) {
    console.error(error)
  }

  const decimals = pool?.underlyingCollateralDecimals

  if (!decimals || !prizes.length || loading) {
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
