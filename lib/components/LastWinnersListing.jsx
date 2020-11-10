import React, { useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { compact } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'
import { shorten } from 'lib/utils/shorten'

export const LastWinnersListing = (
  props,
) => {
  const { t } = useTranslation()
  const { pool } = props

  const decimals = pool?.underlyingCollateralDecimals
  const ticker = pool?.underlyingCollateralSymbol
  const tickerUpcased = ticker?.toUpperCase()

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const { loading, error, data } = useQuery(poolPrizesQuery, {
    variables: {
      prizePoolAddress: pool?.poolAddress,
      first: 5,
    },
    skip: !pool?.poolAddress,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  let prizes = compact([].concat(data?.prizePools?.[0]?.prizes))

  prizes = prizes?.reduce(function (result, prize) {
    if (prize.winners && prize.winners.length > 0) {
      result.push({
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
      {prizes.map(prize => {
        return <Link
          key={`last-winners-${prize?.address}-${prize?.winnings}`}
          href='/prizes/[symbol]/[prizeNumber]'
          as={`/prizes/${pool?.symbol}/${prize?.prizeNumber}`}
        >
          <a
            className='block font-bold bg-default mb-2 rounded-lg px-2 trans'
          >
            <span
              className='inline-block w-1/2 sm:w-1/2'
            >
              {shorten(prize?.address)}
            </span>
            <span
              className='inline-block w-1/2 sm:w-1/2 text-left'
            >
              ${displayAmountInEther(
                prize?.winnings,
                { decimals, precision: 2 }
              )} {tickerUpcased}
            </span>
          </a>
        </Link>
      })}
    </>}
  </>
}
