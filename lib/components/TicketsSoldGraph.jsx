import React from 'react'
import { ethers } from 'ethers'
import { sub, fromUnixTime } from 'date-fns'
import { isEmpty } from 'lodash'

import { CHART_PRIZE_PAGE_SIZE, DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { DateValueLineGraph } from 'lib/components/DateValueLineGraph'
import { usePastPrizes } from 'lib/hooks/usePastPrizes'

export const TicketsSoldGraph = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  let { data: prizes } = usePastPrizes(pool, 1, CHART_PRIZE_PAGE_SIZE)

  const { symbol, decimals } = pool.tokens.underlyingToken

  // Filter out prize objects that are being awarded right now
  prizes = prizes.filter((prize) => !isEmpty(prize))

  const lastPrize = prizes[0]
  let currentPrize

  if (lastPrize?.awardedBlock) {
    currentPrize = {
      ticketSupply: pool.tokens.ticket.totalSupplyUnformatted,
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

  if (dataArray.length < CHART_PRIZE_PAGE_SIZE) {
    dataArray.push({
      value: 0,
      date: sub(dataArray[dataArray.length - 1]?.date, {
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
      valueLabel={t('depositedTicker', { ticker: symbol.toUpperCase() })}
      data={[dataArray]}
    />
  )
}
