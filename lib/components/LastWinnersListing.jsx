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
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { sumAwardedControlledTokens } from 'lib/utils/sumAwardedControlledTokens'

export const LastWinnersListing = (
  props,
) => {
  const { t } = useTranslation()
  const { pool } = props

  const decimals = pool?.underlyingCollateralDecimals
  const querySymbol = pool?.symbol

  const first = 5
  const { data, error, isFetched } = usePoolPrizesQuery(pool, first)

  if (error) {
    console.error(t('thereWasAnErrorLoadingTheLastFiveWinners'))
    console.error(error.message)
  }

  let prizes = compact([].concat(data?.prizePool?.prizes))

  // let tokenAddressesToQuery = []
  // prizes?.forEach(prize => {
  //   prize.awardedExternalErc20Tokens.forEach(token => {
  //     tokenAddressesToQuery.push(token)
  //   })
  // })
  // console.log(tokenAddressesToQuery)
  // const { data, error } = useUniswapTokensQuery(
  //   addresses,
  //   blockNumber
  // )
  // if (error) {
  //   console.error(error)
  // }
  // const uniswapPriceData = data
  // const compiledExternalErc20Awards = compileHistoricalErc20Awards(prize, uniswapPriceData)
  // const externalAwardsUSD = calculateExternalAwardsValue(compiledExternalErc20Awards)

  prizes = prizes?.reduce(function (result, prize) {
    if (prize?.awardedControlledTokens?.length > 0) {
      const date = formatDate(prize?.awardedTimestamp, { short: true, year: false, noAbbrev: true })

      const totalAwardedControlledTokensUSD = sumAwardedControlledTokens(prize?.awardedControlledTokens)

      result.push({
        ...prize,
        date,
        prizeNumber: extractPrizeNumberFromPrize(prize),
        totalControlledTokensWon: totalAwardedControlledTokensUSD
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
      <div
        className='w-full text-flashy font-bold mb-1 text-xxs xs:text-xs'
      >
        <div
          className='inline-block w-1/2'
        >
          {t('currentPrize')}
        </div>
        <div
          className='inline-block w-1/2 text-right'
        >
          ${numberWithCommas(pool?.totalPrizeAmountUSD)}
        </div>
      </div>

      {prizes.map(prize => {
        return <Link
          key={`last-winners-${prize?.prizeNumber}`}
          href='/prizes/[symbol]/[prizeNumber]'
          as={`/prizes/${pool?.symbol}/${prize?.prizeNumber}`}
        >
          <a
            className='flex justify-between items-center font-bold mb-1 rounded-lg trans text-xxs xs:text-xs'
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

              <TimeTravelPool
                blockNumber={parseInt(prize?.awardedBlock, 10)}
                poolAddress={pool?.id}
                querySymbol={querySymbol}
                prize={prize}
              >
                {(timeTravelPool) => {
                  return <>
                    ${displayAmountInEther(
                      timeTravelPool?.totalPrizeAmountUSD,
                      { decimals, precision: 2 }
                    )}
                  </>
                }}
              </TimeTravelPool>

{/* // TODO: We should calculate all of the ERC20s someone won, their value on the day it was awarded
  // as well as the interest prizes! */}
              {/* ${displayAmountInEther(
                prize?.totalControlledTokensWon,
                { precision: 2 }
              )} */}
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
