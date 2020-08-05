import React, { useContext } from 'react'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { CurrencyAndYieldSource } from 'lib/components/CurrencyAndYieldSource'
import { Meta } from 'lib/components/Meta'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { PrizePoolCountdown } from 'lib/components/PrizePoolCountdown'

export const PoolPrizesShow = (
  props,
) => {
  const poolData = useContext(PoolDataContext)
  const { pool, pools, dynamicPlayerData } = poolData
  console.log({pools})

  return <>
    <Meta title='Prizes' />

    <div
      className='flex flex-col items-center text-center'
    >
      <div
        className='inline-block text-2xl font-bold pb-4'
      >
        Prizes
      </div>
      
      <div>
        <div className='text-lg'>
          Total awarded:
        </div>
        <br/>
        <div className='text-3xl -mt-6 text-secondary font-bold font-number'>
          $23,994
        </div>
      </div>
    </div>

    <div className='flex justify-center text-left mt-10'>
      {pools.map(_pool => {
        return <Button
          key={`prize-pool-button-${_pool.id}`}
          outline
          wide
          selected={_pool.symbol === pool?.symbol}
          size='lg'
          href='/prizes/[symbol]'
          as={`/prizes/${_pool.symbol}`}
          className='flex items-center justify-center mr-4'
        >
          <PoolCurrencyIcon
            pool={_pool}
          /> {_pool.underlyingCollateralSymbol}
        </Button>
      })}
    </div>

  </>
}
