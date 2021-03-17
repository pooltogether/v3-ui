import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import { COOKIE_OPTIONS, WIZARD_REFERRER_HREF, WIZARD_REFERRER_AS_PATH } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { InteractableCard } from 'lib/components/InteractableCard'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { useTokenFaucetAPR } from 'lib/hooks/useTokenFaucetAPR'
import { usePool } from 'lib/hooks/usePool'
import { displayPercentage } from 'lib/utils/displayPercentage'

import PoolIcon from 'assets/images/pool-icon.svg'
import BeatLoader from 'react-spinners/BeatLoader'

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
      shallow: true
    })
  }

  const ViewPoolDetailsButton = () => (
    <button className='flex justify-between items-center text-highlight-3 bg-transparent text-xxxs rounded-full px-2 trans'>
      {t('viewPool')}
    </button>
  )

  const AprChip = () => (
    <div className='text-xxxs text-accent-1 flex items-center'>
      <img src={PoolIcon} className='inline-block mr-2 w-4' /> {displayPercentage(apr)}% APR
    </div>
  )

  const apr = useTokenFaucetAPR(pool)

  return (
    <>
      <InteractableCard
        id={`_view${symbol}Pool`}
        key={`pool-row-${pool.id}`}
        href='/pools/[symbol]'
        as={`/pools/${symbol}`}
        className='mt-1 sm:mt-2'
      >
        <div className='flex flex-col sm:flex-row items-center justify-between sm:justify-evenly text-inverse'>
          <div className='pool-row-left-col h-full flex bg-body px-4 sm:px-6 lg:px-8 pb-2 sm:pt-4 sm:pb-8 lg:pt-8 lg:pb-10 rounded-lg items-start justify-center sm:justify-start w-full sm:mr-6'>
            <div className='relative mr-2 mt-4' style={{ top: 1 }}>
              <PoolCurrencyIcon noMediaQueries lg pool={pool} />
            </div>

            <div className='flex flex-col'>
              <PoolPrizeValue pool={pool} />

              <div className='text-accent-1 text-xxxs'>{t('prizeValue')}</div>
            </div>
          </div>

          <div className='pool-row-right-col flex flex-col items-center w-full sm:w-1/2 mt-4 sm:mt-0'>
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
              textSize='xxxs'
              className='mt-3'
              padding='py-1'
              disabled={!Boolean(pool?.symbol)}
            >
              {t('depositTicker', {
                ticker: tickerUpcased
              })}
            </Button>

            <div className='flex items-center justify-between mt-3 w-full'>
              <div className='hidden sm:flex'>{apr && <AprChip />}</div>

              <span className='relative hidden sm:inline-block'>
                <ViewPoolDetailsButton />
              </span>
            </div>

            <span className='mt-1 relative sm:hidden'>{apr && <AprChip />}</span>
            <div className='sm:hidden mt-1'>
              <ViewPoolDetailsButton />
            </div>
          </div>
        </div>
      </InteractableCard>
    </>
  )
}

const PoolPrizeValue = (props) => {
  const { pool } = props

  if (!pool || pool.fetchingTotals) {
    return <div className='text-3xl sm:text-5xl text-flashy font-bold'>$0</div>
  }

  if (pool.totalPrizeAmountUSD) {
    return (
      <div className='text-3xl sm:text-5xl text-flashy font-bold'>
        $
        <PoolCountUp fontSansRegular decimals={0} duration={6}>
          {parseFloat(pool?.totalPrizeAmountUSD)}
        </PoolCountUp>
      </div>
    )
  }

  if (pool.sablierStream?.id) {
    if (!pool.sablierPrize) {
      return (
        <div className='text-3xl sm:text-5xl text-flashy font-bold'>
          <BeatLoader size={10} color='rgba(255,255,255,0.3)' />
        </div>
      )
    }

    return (
      <div className='text-3xl sm:text-5xl text-flashy font-bold'>
        <PoolCountUp fontSansRegular decimals={0} duration={6}>
          {parseFloat(pool.sablierPrize.amount)}
        </PoolCountUp>
        <span className='text-base lg:text-lg text-inverse mb-4 ml-2 mt-auto'>
          {pool.sablierPrize.tokenSymbol}
        </span>
      </div>
    )
  }

  return <div className='text-3xl sm:text-5xl text-flashy font-bold'>$0</div>
}
