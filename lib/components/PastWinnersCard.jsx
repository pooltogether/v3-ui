import React, { useMemo } from 'react'
import Link from 'next/link'
import { isEmpty } from 'lodash'

import { useTranslation } from 'react-i18next'
import { IndexUILoader } from 'lib/components/loaders/IndexUILoader'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Card, CardDetailsList } from 'lib/components/Card'
import { usePastPrizes } from 'lib/hooks/usePastPrizes'
import { formatDate } from 'lib/utils/formatDate'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

const ETHEREUM_MAINNET_SOHM_POOL_ADDRESS = '0xeab695a8f5a44f583003a8bc97d677880d528248'

export const PastWinnersCard = (props) => {
  const { t } = useTranslation()
  const { pool } = props

  const pageNum = 1
  const { data, error, isFetched, count } = usePastPrizes(pool, pageNum)

  const isSohm =
    pool.prizePool.address.toLowerCase() === ETHEREUM_MAINNET_SOHM_POOL_ADDRESS.toLowerCase()

  if (error) {
    console.error(t('thereWasAnErrorLoadingTheLastFiveWinners'))
    console.error(error.message)
  }

  const prizes = useMemo(() => {
    let prizes = data || []
    prizes = prizes ? prizes.slice(0, 5) : []

    prizes = prizes?.reduce(function (result, prize) {
      // If this is a new prize object that is being awarded just skip this row
      if (isEmpty(prize)) {
        return result
      }

      const date = formatDate(prize?.awardedTimestamp, {
        short: true,
        year: false,
        noTimezone: true
      })

      result.push({
        ...prize,
        date,
        prizeNumber: prize.id
      })
      return result
    }, [])

    return prizes
  }, [data])

  if (count === 0) {
    return (
      <Card>
        <h3 className='mb-4'>{t('pastPrizes')}</h3>
        <p>{t('noPastPrizesYet')}</p>
      </Card>
    )
  }

  if (!isFetched) {
    return (
      <Card>
        <h3 className='mb-4'>{t('pastPrizes')}</h3>
        <IndexUILoader />
      </Card>
    )
  }

  return (
    <Card>
      <div className='flex justify-between items-center'>
        <h3 className='mb-4'>{t('pastPrizes')}</h3>
        {pool.symbol && (
          <Link
            href='/prizes/[networkName]/[symbol]'
            as={`/prizes/${pool.networkName}/${pool.symbol}`}
          >
            <a className='text-accent-1'>{t('allPrizeHistory')}</a>
          </Link>
        )}
      </div>
      <CardDetailsList>
        <div className='w-full flex mb-6'>
          <span className='w-1/3'>{t('currentPrize')}</span>
          <span className='w-1/3 text-right text-flashy'>
            {isSohm ? (
              <span>{numberWithCommas(pool.prize.amount)} sOHM</span>
            ) : (
              <>${numberWithCommas(pool.prize.totalValueUsd, { precision: 2 })}</>
            )}
          </span>
        </div>

        {prizes.length === 0 ? (
          <h6>{t('noWinnersAwardedYet')}</h6>
        ) : (
          <PrizesList prizes={prizes} pool={pool} />
        )}
      </CardDetailsList>
    </Card>
  )
}

const PrizesList = (props) => {
  const { prizes, pool } = props

  return (
    <>
      {prizes.map((prize, index) => (
        <PrizeRow key={`prize-${index}`} pool={pool} prize={prize} />
      ))}
    </>
  )
}

const PrizeRow = (props) => {
  const { prize, pool } = props
  const { date, prizeNumber } = prize
  const { symbol, networkName } = pool

  const { t } = useTranslation()

  const isSohm =
    pool.prizePool.address.toLowerCase() === ETHEREUM_MAINNET_SOHM_POOL_ADDRESS.toLowerCase()

  return (
    <li className='w-full flex mb-2 last:mb-0'>
      <span className='w-1/3'>{date}</span>
      <span className='w-1/3 text-right'>
        {isSohm ? (
          <>
            {numberWithCommas(prize.yield.amount)}{' '}
            <span className='text-accent-1 opacity-60'>sOHM</span>
          </>
        ) : (
          <>${numberWithCommas(prize.totalValueUsd, { precision: 2 })}</>
        )}
      </span>
      <span className='w-1/3 text-right'>
        <Link
          key={`last-winners-${prizeNumber}`}
          href='/prizes/[networkName]/[symbol]/[prizeNumber]'
          as={`/prizes/${networkName}/${symbol}/${prizeNumber}`}
        >
          <a className='trans underline text-accent-1 hover:text-inverse'>{t('viewPrize')}</a>
        </Link>
      </span>
    </li>
  )
}
