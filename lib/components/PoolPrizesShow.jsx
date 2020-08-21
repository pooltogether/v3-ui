import React, { useContext } from 'react'
import { useRouter} from 'next/router'

import { useTranslation } from 'lib/../i18n'
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
  const [t] = useTranslation()
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

          border='transparent border hover:border-highlight-1 border-dashed'
          text='highlight-1'
          bg='card'
          hoverBorder='highlight-2'
          hoverText='highlight-2'
          hoverBg='card-selected'

          className='flex flex-col items-center justify-center mx-2 w-1/3 sm:w-1/6'
          selected={_pool.symbol === pool?.symbol}
          href='/prizes/[symbol]'
          as={`/prizes/${_pool.symbol}`}        
        >
          <PoolCurrencyIcon
            sm
            noMargin
            pool={_pool}
          /> {_pool.underlyingCollateralSymbol}
        </ButtonLink>
      })}
    </div>

    <div
      className='bg-highlight-3 mt-4 mb-10 text-sm py-6 flex flex-col sm:flex-row items-center justify-center rounded-lg'
    >
      <div className='flex items-center justify-center sm:justify-end text-white mb-4 sm:mb-0 w-1/3'>
        <div className='flex flex-col items-center justify-center'>
          <div
            className='sm:h-12 sm:pt-1'
          >
            <PoolCurrencyIcon
              pool={pool}
            />
          </div>
          <div className='text-lg mt-1 font-bold'>
            {pool?.name}
          </div>
        </div>
      </div>

      <div className='text-2xl text-center text-white mb-6 sm:mb-0 sm:w-1/3 lg:w-1/5'>
        <div
          className='sm:h-12 font-bold pt-2'
        >
          $17,242
        </div>
        <div className='text-xs sm:text-base -mt-2 sm:mt-1 font-bold'>
          Awarded so far
        </div>
      </div>

      <div className='text-center sm:text-left w-3/4 sm:w-1/3'>
        <ButtonLink
          bg='highlight-4'
          textSize='lg'
          href='/pools/[symbol]/deposit'
          as={`/pools/${pool?.symbol}/deposit`}
        >
          {t('getTickets')}
        </ButtonLink>
      </div>
    </div>


    <h6
      className='text-accent-2 mb-4 mt-16'
    >
      Prize history:
    </h6>

    <PoolPrizeListing
      pool={pool}
    />

  </>
}
