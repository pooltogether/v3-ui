import React, { useMemo } from 'react'
import Link from 'next/link'
import { compact } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { usePoolPrizesQuery } from 'lib/hooks/usePoolPrizesQuery'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'
import { formatDate } from 'lib/utils/formatDate'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Card, CardDetailsList } from 'lib/components/Card'

export const PastWinnersCard = (props) => {
  const { t } = useTranslation()
  const { pool } = props

  const page = 1
  const skip = 0
  const { data, error, isFetched } = usePoolPrizesQuery(pool, page, skip)

  if (error) {
    console.error(t('thereWasAnErrorLoadingTheLastFiveWinners'))
    console.error(error.message)
  }

  const prizes = useMemo(() => {
    let prizes = compact([].concat(data?.prizePool?.prizes))
    prizes = prizes ? prizes.slice(0, 5) : []

    prizes = prizes?.reduce(function (result, prize) {
      if (
        prize?.awardedControlledTokens?.length > 0 ||
        prize?.awardedExternalErc20Tokens?.length > 0
      ) {
        const date = formatDate(prize?.awardedTimestamp, {
          short: true,
          year: false,
          noAbbrev: true
        })

        result.push({
          ...prize,
          date,
          prizeNumber: extractPrizeNumberFromPrize(prize)
        })
      }
      return result
    }, [])

    return prizes
  }, [data])

  const loading = (!prizes && prizes !== null) || !isFetched

  if (loading) {
    return (
      <Card>
        <h5 className='mb-4'>Players</h5>
        <IndexUILoader />
      </Card>
    )
  }

  return (
    <Card>
      <h3 className='mb-4'>{t('pastFiveWinners')}</h3>
      <CardDetailsList>
        <div className='w-full flex mb-4'>
          <span className='w-1/3'>{t('currentPrize')}</span>
          <span className='w-1/3 text-right text-flashy'>
            ${numberWithCommas(pool?.totalPrizeAmountUSD, { precision: 2 })}
          </span>
        </div>

        {prizes === null ? (
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
  const { splitExternalErc20Awards, awardedBlock, symbol, id } = pool

  return (
    <>
      {prizes.map((prize, index) => (
        <TimeTravelPool
          poolSplitExternalErc20Awards={splitExternalErc20Awards}
          blockNumber={parseInt(prize?.awardedBlock, 10)}
          poolAddress={id}
          querySymbol={symbol}
          prize={prize}
          key={`${index}-${id}`}
        >
          {({ timeTravelPool }) => {
            return (
              <PrizeRow
                pool={pool}
                prize={prize}
                totalPrizeAmountUSD={timeTravelPool?.totalPrizeAmountUSD || '0'}
              />
            )
          }}
        </TimeTravelPool>
      ))}
    </>
  )
}

const PrizeRow = (props) => {
  const { prize, pool, totalPrizeAmountUSD } = props
  const { date, prizeNumber } = prize
  const { symbol } = pool

  const { t } = useTranslation()

  // TODO: Add a link to historic winners page, does that work for all pools?

  return (
    <li className='w-full flex mb-2 last:mb-0'>
      <span className='w-1/3'>{date}</span>
      <span className='w-1/3 text-right'>
        $<PoolNumber>{numberWithCommas(totalPrizeAmountUSD, { precision: 2 })}</PoolNumber>
      </span>
      <span className='w-1/3 text-right'>
        <Link
          key={`last-winners-${prizeNumber}`}
          href='/prizes/[symbol]/[prizeNumber]'
          as={`/prizes/${symbol}/${prizeNumber}`}
        >
          <a className='trans underline text-accent-1 hover:text-inverse'>
            {t('beTheFirstToAddToLootbox')}
          </a>
        </Link>
      </span>
    </li>
  )
}
