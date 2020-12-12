import React, { useContext } from 'react'
import Link from 'next/link'
import { compact } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
// import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { usePoolPrizesQuery } from 'lib/hooks/usePoolPrizesQuery'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'
import { formatDate } from 'lib/utils/formatDate'
import { shorten } from 'lib/utils/shorten'

export const LastWinnersListing = (
  props,
) => {
  const { t } = useTranslation()
  const { pool } = props

  const decimals = pool?.underlyingCollateralDecimals

  const { chainId, pauseQueries } = useContext(AuthControllerContext)



  const first = 5
  const { status, data, error, isFetching } = usePoolPrizesQuery(pauseQueries, chainId, pool, first)




  let prizes = compact([].concat(data?.prizePool?.prizes))

  prizes = prizes?.reduce(function (result, prize) {
    if (prize.winners && prize.winners.length > 0) {
      const date = formatDate(prize?.awardedTimestamp, { short: true, year: false, noAbbrev: true })
      result.push({
        ...prize,
        date,
        prizeNumber: extractPrizeNumberFromPrize(prize),
        address: prize?.winners[0],
        winnings: prize?.amount
      })
    }
    return result
  }, [])

  if (!prizes && prizes !== null) {
    return <TableRowUILoader
      rows={5}
    />
  }

  return <>
    {error && <>
      {t('thereWasAnErrorLoadingTheLastFiveWinners')}
      {error.message}
    </>}

    {prizes && prizes?.length === 0 ? <>
      <h6>
        {t('noWinnersAwardedYet')}
      </h6>
    </> : <>
        <Link
          href='/prizes/[symbol]/[prizeNumber]'
          as={`/prizes/${pool?.symbol}/${pool?.currentPrizeId}`}
        >
          <a
            className='block font-bold mb-2 rounded-lg trans'
          >
            <span
              className='inline-block w-1/2 sm:w-1/2 text-flashy'
            >
              {t('currentPrize')}
            </span>
            <span
              className='inline-block w-1/2 sm:w-1/2 text-right text-flashy'
            >
              ${displayAmountInEther(
                pool?.grandPrizeAmountUSD.toString(),
                { decimals, precision: 2 }
              )}
            </span>
          </a>
        </Link>

      {prizes.map(prize => {
        return <Link
          key={`last-winners-${prize?.address}-${prize?.winnings}`}
          href='/prizes/[symbol]/[prizeNumber]'
          as={`/prizes/${pool?.symbol}/${prize?.prizeNumber}`}
        >
          <a
            className='block font-bold mb-2 rounded-lg trans sm:text-xxs'
          >
            <span
              className='inline-block w-1/3 sm:w-3/12'
            >
              {prize?.date}
            </span>
            <span
              className='inline-block w-1/3 sm:w-5/12'
            >
              {shorten(prize?.address)}
            </span>
            <span
              className='inline-block w-1/3 sm:w-4/12 text-right'
            >
              <TimeTravelPool
                blockNumber={parseInt(prize?.awardedBlock, 10)}
                poolAddress={pool?.poolAddress}
                querySymbol={pool?.symbol}
                prize={prize}
              >
                {(timeTravelPool) => {
                  return <>
                    ${displayAmountInEther(
                      timeTravelPool?.grandPrizeAmountUSD.toString(),
                      { decimals, precision: 2 }
                    )}
                  </>
                }}
              </TimeTravelPool>
              
            </span>
          </a>
        </Link>
      })}
    </>}
  </>
}
