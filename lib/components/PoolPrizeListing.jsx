import React from 'react'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'

export const PoolPrizeListing = (
  props,
) => {
  const { pool } = props

  const { loading, error, data } = useQuery(poolPrizesQuery, {
    variables: {
      prizeStrategyAddress: pool?.prizeStrategyAddress
    },
    skip: !pool?.prizeStrategyAddress,
    fetchPolicy: 'network-only',
    pollInterval: MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  const prizes = data?.prizeStrategy?.prizes
  
  if (loading) {
    return <div
      className='mt-10'
    >
      <IndexUILoader />
    </div>
  }

  return <>
    <div
      className='flex flex-col items-center text-center mt-10'
    >
      {!prizes || loading && <>
        <IndexUILoader />
      </>}

      {error && <>
        There was an issue loading data from The Graph:
        {error}
      </>}

      {prizes?.length === 0 && <>
      BLANK STATE MSG
      </>}

      {prizes?.map(prize => {
        const decimals = pool.underlyingCollateralDecimals
        const prizeAmount = prize.prize && decimals ?
          ethers.utils.formatUnits(
            prize.prize,
            Number(decimals)
          ) : ethers.utils.bigNumberify(0)

        return <div key={`prize-strategy-prize-${prize.id}`}>
          <div>
            ID: {prize.id.split('-')[1]}
          </div>
          <div>
            Amount: {prizeAmount.toString()}
          </div>
          <div>
            Started at: {prize.prizePeriodStartedAt}
            {/* {prize.prizePeriodStartedTimestamp} */}
          </div>
          <div>
            Awarded at: {prize.awardedTimestamp}
          </div>
        </div>
      })}
    </div>

  </>
}
