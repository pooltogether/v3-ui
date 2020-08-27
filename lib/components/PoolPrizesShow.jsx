import React, { useContext } from 'react'
import { useRouter} from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AllPoolsTotalAwarded } from 'lib/components/AllPoolsTotalAwarded'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { Meta } from 'lib/components/Meta'
import { PoolPrizeListing } from 'lib/components/PoolPrizeListing'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PrizesPageHeader } from 'lib/components/PrizesPageHeader'
import { Tagline } from 'lib/components/Tagline'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolPrizesShow = (
  props,
) => {
  const [t] = useTranslation()
  const router = useRouter()

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData
  
  const decimals = pool?.underlyingCollateralDecimals

  if (pool === null) {
    const querySymbol = router.query?.symbol
    return <BlankStateMessage>
      Could not find pool with symbol: ${querySymbol}
    </BlankStateMessage>
  }

  return <>
    <Meta
      title={`${pool?.name} Prizes`} 
    />

    <PrizesPageHeader
      pool={pool}
    />

    {/* <div className='flex justify-center text-left mt-10'>
      {pools.map(_pool => {
        return <ButtonLink
          key={`prize-pool-button-${_pool.id}`}

          border='transparent border hover:border-highlight-1 border-dashed'
          text='highlight-1'
          bg='card'
          hoverBorder='highlight-2'
          hoverText='highlight-2'
          hoverBg='card-selected'
          // 

          className='interactable-card hover:shadow-xl flex flex-col items-center justify-center mx-2 w-1/3 sm:w-1/6'
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
    </div> */}

    <div
      className='bg-highlight-3 mt-8 mb-8 text-sm py-6 px-6 flex flex-col xs:flex-row items-center justify-center xs:justify-between text-center xs:text-left rounded-lg'
    >
      <div className='text-2xl text-white mb-6 xs:mb-0 xs:w-1/3 lg:w-1/5'>
        <div
          className='xs:h-12 font-bold'
        >
          ${displayAmountInEther(
            pool?.cumulativePrizeNet,
            { decimals, precision: 2 }
          )}
        </div>
        <div className='text-xs xs:text-base -mt-2 xs:mt-1 font-bold'>
          Awarded so far
        </div>
      </div>

      <div className='text-center xs:text-right w-3/4 xs:w-1/3'>
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
      className='text-accent-2 mb-0 mt-8'
    >
      Prize history:
    </h6>

    <PoolPrizeListing
      pool={pool}
    />

    <AllPoolsTotalAwarded />
  </>
}
