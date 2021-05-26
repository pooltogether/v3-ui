import React from 'react'

import { useTranslation } from 'react-i18next'
import { Card } from 'lib/components/Card'
import { PoolNumber } from 'lib/components/PoolNumber'
import { TicketsSoldGraph } from 'lib/components/TicketsSoldGraph'
import { Tooltip } from 'lib/components/Tooltip'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usePastPrizes } from 'lib/hooks/usePastPrizes'
import { CHART_PRIZE_PAGE_SIZE } from 'lib/constants'

export const PoolChartsCard = (props) => {
  const { pool } = props

  const { data: prizes, isFetched } = usePastPrizes(pool, 1, CHART_PRIZE_PAGE_SIZE)

  if (!isFetched || !prizes || prizes?.length < MIN_NUMBER_OF_POINTS) return null

  return (
    <Card>
      <DepositsAndPrizesCharts pool={pool} />
    </Card>
  )
}

const MIN_NUMBER_OF_POINTS = 2

const DepositsAndPrizesCharts = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const totalDeposits = pool.tokens.ticket.totalSupply
  const tokenSymbol = pool.tokens.underlyingToken.symbol

  return (
    <div className='text-inverse p-4 bg-card h-full sm:h-auto rounded-none sm:rounded-xl mx-auto flex flex-col sm:flex-row'>
      <div className='w-full'>
        <div className='flex'>
          <h5>{t('historicDeposits')}</h5>
          <Tooltip
            id={'historic-deposits'}
            className='ml-2 my-auto text-accent-1'
            tip={t('historicDepositsInfo')}
          />
        </div>
        <span>{t('currentDeposits')}:</span>
        <span className='ml-4'>
          <PoolNumber>{numberWithCommas(totalDeposits)}</PoolNumber>
          <span>{tokenSymbol}</span>
        </span>
        <TicketsSoldGraph pool={pool} />
      </div>

      {/* <div className='mb-8'>
        <div className='flex'>
          <h5>{t('historicPrizes')}</h5>
          <Tooltip
            id={'historic-prizes'}
            className='ml-2 my-auto text-accent-1'
            tip={t('historicPrizesInfo')}
          />
        </div>
        <span>{t('currentPrize')}:</span>
        <span className='ml-4'>
          <PoolNumber>{numberWithCommas(currentPrizeFormatted)}</PoolNumber>
          <span>{tokenSymbol}</span>
        </span>
        <PrizeValueGraph pool={pool} renderEmptyState={() => <ChartEmptyState />} />
      </div> */}
    </div>
  )
}

const ChartEmptyState = () => {
  const { t } = useTranslation()
  return <p className='mt-8 text-center text-accent-1 opacity-40'>{t('notEnoughData')}</p>
}
