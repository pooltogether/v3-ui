import React from 'react'
import FeatherIcon from 'feather-icons-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import {
  COOKIE_OPTIONS,
  WIZARD_REFERRER_HREF,
  WIZARD_REFERRER_AS_PATH
} from 'lib/constants'
import { Trans, useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { ButtonLink } from 'lib/components/ButtonLink'
import { Chip } from 'lib/components/Chip'
import { InteractableCard } from 'lib/components/InteractableCard'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolRowNew = (
  props,
) => {  
  const {
    pool,
  } = props
  
  const { t } = useTranslation()
  const router = useRouter()

  if (!pool || !pool.symbol) {
    return null
  }

  const symbol = pool.symbol
  const decimals = pool?.underlyingCollateralDecimals

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
      key={`pool-row-${pool.poolAddress}`}
      href='/pools/[symbol]'
      as={`/pools/${symbol}`}
      className='mt-2 sm:mt-4'
    >
      <div className='flex flex-col items-center justify-center text-inverse'>

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

        <ButtonLink
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
          href='/pools/[symbol]'
          as={`/pools/${pool.symbol}`}
        >
          {t('viewPool')} <FeatherIcon
            strokeWidth='0.09rem'
            icon='arrow-right-circle'
            className='inline-block relative w-4 h-4 mx-auto ml-1'
          />
        </ButtonLink>
      </div>

      <p
        className='text-center text-accent-1 mx-auto text-xxxxs xs:text-xxxs sm:text-xxs mt-4 opacity-50'
      >
        {t('prizeApproximationFootnote')}
      </p>
      
    </InteractableCard>
  </>
}
