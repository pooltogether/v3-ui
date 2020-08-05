import React, { useContext } from 'react'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { CurrencyAndYieldSource } from 'lib/components/CurrencyAndYieldSource'
import { Meta } from 'lib/components/Meta'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { PrizePoolCountdown } from 'lib/components/PrizePoolCountdown'

export const PrizeShow = (
  props,
) => {
  const poolData = useContext(PoolDataContext)
  const { pool, pools, dynamicPlayerData } = poolData
  console.log({pool})

  if (!pool) {
    return null
  }

  return <>
    <Meta title='Prizes' />

    <div
      className='flex flex-col sm:flex-row justify-between items-center'
    >
      <div
        className='flex items-center w-full sm:w-1/2'
      >
        <div
          className='inline-block text-left text-xl sm:text-2xl lg:text-3xl font-bold'
        >
          {pool?.name}
        </div>

        <div
          className='inline-flex items-center ml-4'
        >
          <CurrencyAndYieldSource
            pool={pool}
          />
        </div>
      </div>

      <div className='text-left mt-10'>
        <PrizeAmount
          {...props}
          big
        />
        <div
          className='flex items-center my-1'
        >
          <PrizePoolCountdown
            pool={pool}
          />
        </div>
      </div>
    </div>

  </>
}
