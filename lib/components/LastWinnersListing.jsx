import React from 'react'
import Link from 'next/link'
import { compact } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { usePoolPrizesQuery } from 'lib/hooks/usePoolPrizesQuery'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'
import { formatDate } from 'lib/utils/formatDate'
import { sumAwardedControlledTokens } from 'lib/utils/sumAwardedControlledTokens'

export const LastWinnersListing = (
  props,
) => {
  const { t } = useTranslation()
  const { pool } = props

  const decimals = pool?.underlyingCollateralDecimals


  const first = 5
  const { data, error } = usePoolPrizesQuery(pool, first)
  console.log(data)

  if (error) {
    console.error(t('thereWasAnErrorLoadingTheLastFiveWinners'))
    console.error(error.message)
  }

  let prizes = compact([].concat(data?.prizePool?.prizes))

  prizes = prizes?.reduce(function (result, prize) {
    if (prize?.awardedControlledTokens?.length > 0) {
      const date = formatDate(prize?.awardedTimestamp, { short: true, year: false, noAbbrev: true })

      const total = sumAwardedControlledTokens(prize?.awardedControlledTokens)

      result.push({
        ...prize,
        date,
        prizeNumber: extractPrizeNumberFromPrize(prize),
        totalControlledTokensWon: total
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

    {prizes === null ? <>
      <h6>
        {t('noWinnersAwardedYet')}
      </h6>
    </> : <>
      <span
        className='inline-block w-1/2 text-flashy font-bold mb-2 text-xxs sm:text-xs lg:text-sm'
      >
        {t('currentPrize')}
      </span>
      <span
        className='inline-block w-1/2 text-right text-flashy text-xxs sm:text-xs lg:text-sm'
      >
        ${displayAmountInEther(
          pool?.totalPrizeAmountUSD.toString(),
          { decimals, precision: 2 }
        )}
      </span>

      {prizes.map(prize => {
        return <Link
          key={`last-winners-${prize?.prizeNumber}`}
          href='/prizes/[symbol]/[prizeNumber]'
          as={`/prizes/${pool?.symbol}/${prize?.prizeNumber}`}
        >
          <a
            className='flex justify-between items-center font-bold mb-2 rounded-lg trans text-xxs sm:text-xs lg:text-sm'
          >
            <span>
              {prize?.date}
            </span>
            {/* <span
              className='inline-block w-1/3 sm:w-5/12'
            >
              {shorten(prize?.address)}
            </span> */}
            <span
              className='text-right'
            >

{/* // TODO: We should calculate all of the ERC20s someone won, their value on the day it was awarded
  // as well as the interest prizes! */}
              ${displayAmountInEther(
                prize?.totalControlledTokensWon,
                { precision: 2 }
              )}
              {/* <TimeTravelPool
                blockNumber={parseInt(prize?.awardedBlock, 10)}
                poolAddress={pool?.poolAddress}
                querySymbol={pool?.symbol}
                prize={prize}
              >
                {(timeTravelPool) => {
                  return <>
                    ${displayAmountInEther(
                      timeTravelPool?.totalPrizeAmountUSD.toString(),
                      { decimals, precision: 2 }
                    )}
                  </>
                }}
              </TimeTravelPool> */}
              
            </span>
          </a>
        </Link>
      })}
    </>}
  </>
}
