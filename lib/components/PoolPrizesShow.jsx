import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import {
  WIZARD_REFERRER_HREF,
  WIZARD_REFERRER_AS_PATH
} from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AllPoolsTotalAwarded } from 'lib/components/AllPoolsTotalAwarded'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { Button } from 'lib/components/Button'
import { Meta } from 'lib/components/Meta'
import { PoolPrizeListing } from 'lib/components/PoolPrizeListing'
import { PrizesPageHeader } from 'lib/components/PrizesPageHeader'
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

  const handleGetTicketsClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/prizes/[symbol]')
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/prizes/${pool?.symbol}`)

    router.push(
      `/pools/[symbol]/deposit`,
      `/pools/${pool?.symbol}/deposit`,
      {
        shallow: true
      }
    )
  }

  return <>
    <Meta
      title={`${pool ? pool.name : ''} ${t('prizes')}`} 
    />

    <PrizesPageHeader
      pool={pool}
    />

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
          {t('awardedSoFar')}
        </div>
      </div>

      <div className='text-center xs:text-right w-3/4 xs:w-1/3'>
        <Button
          bg='highlight-4'
          textSize='lg'
          onClick={handleGetTicketsClick}
        >
          {t('getTickets')}
        </Button>
      </div>
    </div>


    <h6
      className='text-accent-2 mb-0 mt-8'
    >
      {t('prizeHistory')}
    </h6>

    <PoolPrizeListing
      pool={pool}
    />

    <AllPoolsTotalAwarded />
  </>
}
