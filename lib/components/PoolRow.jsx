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
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { InteractableCard } from 'lib/components/InteractableCard'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolRow = (
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
    >
      <div className='flex items-center'>
        <div
          className='flex items-center font-bold w-full xs:w-8/12 sm:w-7/12 lg:w-1/2'
        >
          <PoolCurrencyIcon
            lg
            pool={pool}
            className='-mt-2'
          />

          <div
            className='flex flex-col items-start justify-between w-full ml-1 sm:ml-4 leading-none'
          >
            <div
              className='inline-block text-left text-xs xs:text-sm xs:text-xl sm:text-4xl font-bold text-inverse relative'
              style={{
                top: -4
              }}
            >
              <Trans
                i18nKey='prizeAmount'
                defaults='Prize $<prize>{{amount}}</prize>'
                components={{
                  prize: <PoolCountUp
                    fontSansRegular
                    decimals={2}
                    duration={6}
                  />
                }}
                values={{
                  amount: ethers.utils.formatUnits(
                    pool?.prizeEstimate,
                    decimals
                  )
                }}
              />
            </div>
          </div>
        </div>

        <div
          className='flex flex-col items-end w-5/12 xs:w-4/12 sm:w-5/12 lg:w-1/2'
        >
          <NewPrizeCountdown
            pool={pool}
          />
        </div>
      </div>

      <div
        className='mt-5 flex items-end justify-between'
      >
        <div
          className='w-1/2 sm:w-4/12 lg:w-6/12 pr-2'
        >
          <Button
            onClick={handleGetTicketsClick}
            width='w-full'
            textSize='sm'
          >
            {t('getTickets')}
          </Button>
        </div>

        <div
          className='w-5/12 sm:w-4/12 text-right'
        >
          <div
            className='inline-block text-left text-caption-2 relative mr-2'
          >
            <Chip
              color='accent-1'
              text={t(pool?.name)}
            /> <Chip
              color='default'
              text={t(pool?.frequency)}
            />
          </div>

          <ButtonLink
            noAnim
            border='transparent'
            text='highlight-3'
            bg='transparent'
            hoverBorder='transparent'
            hoverText='highlight-2'
            hoverBg='transparent'

            padding='pl-2 pr-0'
            className='inline-flex justify-between items-center uppercase'
            textSize='xxs'

            rounded='full'
            href='/pools/[symbol]'
            as={`/pools/${pool.symbol}`}
          >
            {t('viewPool')} <FeatherIcon
              strokeWidth='0.15rem'
              icon='arrow-right-circle'
              className='inline-block relative w-4 h-4 mx-auto ml-1'
            />
          </ButtonLink>
        </div>
      </div>
    </InteractableCard>
  </>
}
