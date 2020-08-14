import React, { useContext } from 'react'
import { useRouter} from 'next/router'

import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonLink } from 'lib/components/ButtonLink'
import { Meta } from 'lib/components/Meta'
import { PoolPrizeListing } from 'lib/components/PoolPrizeListing'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PrizesPageHeader } from 'lib/components/PrizesPageHeader'

export const PoolPrizesShow = (
  props,
) => {
  const router = useRouter()

  const poolData = useContext(PoolDataContext)
  const { pool, pools } = poolData

  if (pool === null) {
    const querySymbol = router.query?.symbol
    return <BlankStateMessage>
      Could not find pool with symbol: ${querySymbol}
    </BlankStateMessage>
  }

  return <>
    <Meta title={`${pool?.name} Prizes`} />

    <PrizesPageHeader
      pool={pool}
    />

    <div className='flex justify-center text-left mt-10'>
      {pools.map(_pool => {
        return <ButtonLink
          key={`prize-pool-button-${_pool.id}`}
          selected={_pool.symbol === pool?.symbol}
          href='/prizes/[symbol]'
          as={`/prizes/${_pool.symbol}`}
          className='flex items-center justify-center mx-2'
          border='highlight-1'
          text='highlight-1'
          hoverText='highlight-2'
          size='lg'
        >
          <PoolCurrencyIcon
            pool={_pool}
          /> {_pool.underlyingCollateralSymbol}
        </ButtonLink>
      })}
    </div>

    <div
      className='bg-default mt-6 mb-6 text-sm py-6 flex flex-col sm:flex-row items-center justify-center rounded-lg'
    >
      <div className='flex flex-col items-center justify-center text-highlight-2 mb-4 sm:mb-0'>
        <div
          className='sm:h-12 sm:pt-1'
        >
          <PoolCurrencyIcon
            pool={pool}
          />
        </div>
        <div className='text-lg mt-1'>
          {pool?.name}
        </div>
      </div>

      <div className='mx-8 sm:mx-12 lg:mx-20 text-2xl text-center text-highlight-2 mb-6 sm:mb-0'>
        <div
          className='sm:h-12'
        >
          $17,242
        </div>
        <div className='text-xs sm:text-lg -mt-2 sm:mt-1'>
          Awarded so far
        </div>
      </div>

      <ButtonLink
        border='highlight-1'
        text='secondary'
        bg='highlight-1'
        hoverBorder='highlight-2'
        hoverText='green'
        hoverBg='purple'
        size='lg'
        href='/pools/[symbol]/deposit'
        as={`/pools/${pool?.symbol}/deposit`}
      >
        Get tickets
      </ButtonLink>
    </div>

    <PoolPrizeListing
      pool={pool}
    />

  </>
}
