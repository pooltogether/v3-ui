import React from 'react'
import FeatherIcon from 'feather-icons-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import {
  COOKIE_OPTIONS,
  WIZARD_REFERRER_HREF,
  WIZARD_REFERRER_AS_PATH,
  DEFAULT_TOKEN_PRECISION
} from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { InteractableCard } from 'lib/components/InteractableCard'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { usePool } from 'lib/hooks/usePool'

export const PoolRowNew = (
  props,
) => {  
  const { querySymbol } = props
  
  const { t } = useTranslation()
  const router = useRouter()

  const { pool } = usePool(querySymbol)

  // if (Boolean(!pool?.awardBalance)) {
  //   return null
  // }

  const symbol = pool.symbol
  const decimals = pool?.underlyingCollateralDecimals || DEFAULT_TOKEN_PRECISION

  const handleGetTicketsClick = (e) => {
    e.preventDefault()

    Cookies.set(
      WIZARD_REFERRER_HREF,
      '/',
      COOKIE_OPTIONS
    )
    Cookies.set(
      WIZARD_REFERRER_AS_PATH,
      `/`,
      COOKIE_OPTIONS
    )

    router.push(
      `/pools/[symbol]/deposit`,
      `/pools/${pool?.symbol}/deposit`,
      {
        shallow: true
      }
    )
  }

  return <>
    <InteractableCard
      key={`pool-row-${pool.id}`}
      href='/pools/[symbol]'
      as={`/pools/${symbol}`}
      className='mt-2 sm:mt-4'
    >
      <div className='flex flex-col items-center justify-center text-inverse'>

        <div className='flex items-center justify-center'>
          <PoolCurrencyIcon
            lg
            pool={pool}
            className='mr-2 mt-1'
          />

          <div
            className='text-5xl sm:text-6xl lg:text-7xl font-bold text-flashy'
          >
            $<PoolCountUp
              fontSansRegular
              decimals={0}
              duration={6}
            >
              {ethers.utils.formatUnits(
                pool?.totalPrizeAmountUSD,
                decimals
              )}
            </PoolCountUp>
          </div>
        </div>

        <div
          className='text-xs xs:text-sm sm:text-base lg:text-lg -t-1 relative'
        >
          {t('prizeValue')}*
        </div>

        <div
          className='my-4'
        >
          <NewPrizeCountdown
            textSize='text-sm sm:text-lg lg:text-xl'
            pool={pool}
          />
        </div>

        <Button
          border='green'
          text='primary'
          bg='green'

          hoverBorder='green'
          hoverText='primary'
          hoverBg='green'

          onClick={handleGetTicketsClick}
          width='w-full xs:w-8/12 sm:w-7/12 lg:w-5/12'
          textSize='sm'
          className='my-4'
        >
          {t('getTickets')}
        </Button>

        <Button
          noAnim

          bold={false}

          border='transparent'
          text='highlight-3'
          bg='transparent'
          hoverBorder='transparent'
          hoverText='highlight-2'
          hoverBg='transparent'

          padding='pl-2 pr-0'
          className='inline-flex justify-between items-center'
          textSize='xxs'

          rounded='full'
        >
          {t('viewPool')} <FeatherIcon
            strokeWidth='0.09rem'
            icon='arrow-right-circle'
            className='inline-block relative w-4 h-4 mx-auto ml-1'
          />
        </Button>
      </div>

      <p
        className='text-center text-accent-1 mx-auto text-xxxxs xs:text-xxxs sm:text-xxs mt-4 opacity-50'
      >
        {t('prizeApproximationFootnote')}
      </p>
      
    </InteractableCard>
  </>
}
