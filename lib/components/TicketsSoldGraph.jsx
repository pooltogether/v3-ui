import React from 'react'
import { ethers } from 'ethers'
import { sub, fromUnixTime } from 'date-fns'
import { compact } from 'lodash'

import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { DateValueLineGraph } from 'lib/components/DateValueLineGraph'
import { usePoolPrizesQuery } from 'lib/hooks/usePoolPrizesQuery'

const NUMBER_OF_POINTS = 20
const MIN_NUMBER_OF_POINTS = 2

export const TicketsSoldGraph = (props) => {
  const { pool, renderEmptyState } = props

  const { t } = useTranslation()

  const page = 1
  const skip = 0
  const { data, error, isFetched } = usePoolPrizesQuery(pool, page, skip, -1, 20)

  let prizes = [].concat(data?.prizePool?.prizes)

  if (error) {
    console.error(error)
  }

  const decimals = pool?.underlyingCollateralDecimals

  if (!decimals || !prizes.length || !isFetched || prizes.length < MIN_NUMBER_OF_POINTS) {
    if (renderEmptyState) return renderEmptyState()
    return null
  }

  const lastPrize = prizes[0]
  let currentPrize

  if (lastPrize?.awardedBlock) {
    currentPrize = {
      ticketSupply: pool.ticketSupply,
      awardedTimestamp: Date.now() / 1000
    }

    prizes.unshift(currentPrize)
  }

  const dataArray = prizes.map((prize) => {
    const tickets = prize?.awardedBlock ? prize?.totalTicketSupply : prize?.ticketSupply

    const ticketsSold = ethers.utils.formatUnits(
      tickets || '0',
      decimals || DEFAULT_TOKEN_PRECISION
    )

    return {
      value: parseFloat(ticketsSold),
      date: fromUnixTime(prize.awardedTimestamp)
    }
  })

  if (dataArray.length < NUMBER_OF_POINTS) {
    dataArray.push({
      value: 0,
      date: sub(dataArray[dataArray.length - 1].date, {
        years: 0,
        months: 0,
        weeks: 1,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      })
    })
  }

  return (
    <DateValueLineGraph
      id='tickets-sold-graph'
      valueLabel={t('depositedTicker', { ticker: pool?.underlyingCollateralSymbol?.toUpperCase() })}
      data={[dataArray]}
    />
  )
}
