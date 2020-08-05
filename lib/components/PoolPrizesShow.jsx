import React, { useContext } from 'react'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { CurrencyAndYieldSource } from 'lib/components/CurrencyAndYieldSource'
import { Meta } from 'lib/components/Meta'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { PrizePoolCountdown } from 'lib/components/PrizePoolCountdown'

export const PoolPrizesShow = (
  props,
) => {
  const poolData = useContext(PoolDataContext)
  const { pool, pools, dynamicPlayerData } = poolData
  console.log({pool})

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

    <div className='flex text-left mt-10'>
      <Button
        outline
        wide
        size='lg'
        className='flex items-center justify-center'
        
      >
        <CurrencyAndYieldSource
          pool={{
            underlyingCollateralSymbol: 'DAI',
          }}
        />
      </Button>
    </div>

  </>
}
