import React from 'react'
// import FeatherIcon from 'feather-icons-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import {
  COOKIE_OPTIONS,
  WIZARD_REFERRER_HREF,
  WIZARD_REFERRER_AS_PATH,
  DEFAULT_TOKEN_PRECISION,
} from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { Chip } from 'lib/components/Chip'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { InteractableCard } from 'lib/components/InteractableCard'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { PoolNumber } from 'lib/components/PoolNumber'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { usePool } from 'lib/hooks/usePool'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const PoolRowNew = (props) => {
  const { querySymbol } = props

  const { t } = useTranslation()
  const router = useRouter()

  const { pool } = usePool(querySymbol)

  const symbol = pool.symbol

  const ticker = pool?.underlyingCollateralSymbol
  const tickerUpcased = ticker?.toUpperCase()

  const handleGetTicketsClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/', COOKIE_OPTIONS)
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/`, COOKIE_OPTIONS)

    router.push(`/pools/[symbol]/deposit`, `/pools/${pool.symbol}/deposit`, {
      shallow: true,
    })
  }

  const ViewPoolDetailsButton = () => <button
    className='flex justify-between items-center text-highlight-3 bg-transparent text-xxxs rounded-full px-2 trans'
  >
    {t('viewPool')}
  </button>

  const TotalDepositedChip = () => <Chip
    size='text-xxxs'
    text={<>
      {t('totalDeposited')} ${numberWithCommas(pool?.totalDepositedUSD, { precision: 0 })}
    </>}
  />

  return (
    <>
      <InteractableCard
        id={`_view${symbol}Pool`}
        key={`pool-row-${pool.id}`}
        href='/pools/[symbol]'
        as={`/pools/${symbol}`}
        className='mt-1 sm:mt-2'
      >
        <div className='flex flex-col xs:flex-row items-center justify-between text-inverse'>

          <div className='pool-row-left-col h-full flex bg-body px-4 lg:px-8 pb-2 xs:pt-4 xs:pb-8 lg:pt-8 lg:pb-10 rounded-lg items-start justify-center xs:justify-start w-full xs:w-1/2'>
            <div className='relative mr-2 mt-4' style={{ top: 1 }}>
              <PoolCurrencyIcon noMediaQueries lg pool={pool} />
            </div>
            
            <div className='flex flex-col'>
              <div className='text-5xl text-flashy font-bold'>
                $
                <PoolCountUp fontSansRegular decimals={0} duration={6}>
                  {parseFloat(pool?.totalPrizeAmountUSD)}
                </PoolCountUp>
              </div>

              <div className='text-accent-1 text-xxxs'>
                {t('prizeValue')}
              </div>
            </div>
          </div>


          <div className='pool-row-right-col flex flex-col items-center w-full xs:w-1/2'>

            <div className='flex items-center justify-between mb-4 w-full'>
              <div className='hidden xs:flex'>
                <TotalDepositedChip />
              </div>

              <span className='relative hidden xs:inline-block'>
                <ViewPoolDetailsButton />
              </span>
            </div>
            
            <NewPrizeCountdown textSize='text-sm sm:text-lg lg:text-xl' pool={pool} />

            <Button
              border='green'
              text='primary'
              bg='green'
              hoverBorder='green'
              hoverText='primary'
              hoverBg='green'
              onClick={handleGetTicketsClick}
              width='w-full'
              textSize='sm'
              className='mt-2'
              disabled={!Boolean(pool?.symbol)}
            >
              {t('depositTicker', {
                ticker: tickerUpcased,
              })}
            </Button>

            <span className='mt-3 relative xs:hidden'>
              <TotalDepositedChip />
            </span>
            <div className='xs:hidden mt-1'>
              <ViewPoolDetailsButton />
            </div>
          </div>
        </div>
      </InteractableCard>
    </>
  )
}
