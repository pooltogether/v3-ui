import React from 'react'
import Cookies from 'js-cookie'
import classnames from 'classnames'
import { useRouter } from 'next/router'

import {
  SECONDS_PER_DAY,
  COOKIE_OPTIONS,
  WIZARD_REFERRER_HREF,
  WIZARD_REFERRER_AS_PATH
} from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { Erc20Image } from 'lib/components/Erc20Image'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { InteractableCard } from 'lib/components/InteractableCard'
import { NetworkBadge } from 'lib/components/NetworkBadge'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { hardcodedAprAmountUsd } from 'lib/components/PoolPrizeCard'
import { hardcodedWMaticApr } from 'lib/components/AccountGovernanceClaims'

export const PoolRow = (props) => {
  const { pool } = props

  const { t } = useTranslation()
  const router = useRouter()

  const symbol = pool.symbol

  const ticker = pool.tokens.underlyingToken.symbol
  const tickerUpcased = ticker?.toUpperCase()

  const handleGetTicketsClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/', COOKIE_OPTIONS)
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/`, COOKIE_OPTIONS)

    router.push(
      `/pools/[networkName]/[symbol]/deposit`,
      `/pools/${pool.networkName}/${pool.symbol}/deposit`,
      {
        shallow: true
      }
    )
  }

  const ViewPoolDetailsButton = () => (
    <button className='flex justify-between items-center text-highlight-3 bg-transparent text-xxxs rounded-full px-2 trans'>
      {t('viewPool')}
    </button>
  )

  const AprChip = (props) => {
    const { pool } = props

    const dripTokenAddress = pool.tokens.tokenFaucetDripToken?.address

    let apr = pool.tokenListener?.apr
    if (pool.prizePool.address === '0x887e17d791dcb44bfdda3023d26f7a04ca9c7ef4') {
      apr = hardcodedWMaticApr(pool)
    }

    if (!apr) {
      return null
    }

    return (
      <div className='text-xxxs text-accent-1 flex items-center'>
        <Erc20Image address={dripTokenAddress} className='inline-block mr-2 w-4' />
        {displayPercentage(apr)}% APR
      </div>
    )
  }

  const isDaily = pool.prize.prizePeriodSeconds.toNumber() === SECONDS_PER_DAY

  return (
    <InteractableCard
      id={`_view${symbol}Pool`}
      href='/pools/[networkName]/[symbol]'
      as={`/pools/${pool.networkName}/${symbol}`}
      className='mt-1 sm:mt-2'
    >
      <div className='flex flex-col sm:flex-row items-center justify-between sm:justify-evenly text-inverse'>
        <div className='pool-row-left-col h-full flex bg-body py-2 p-4 sm:px-6 sm:pt-3 sm:pb-5 lg:px-8 rounded-lg items-start justify-center sm:justify-start w-full sm:mr-6'>
          <div className='flex flex-col mx-auto'>
            <div className='flex'>
              <PoolCurrencyIcon
                noMediaQueries
                lg
                symbol={pool.tokens.underlyingToken.symbol}
                address={pool.tokens.underlyingToken.address}
                className='my-auto'
              />

              <PoolPrizeValue pool={pool} />
            </div>

            <div className='block mx-auto mb-1 sm:mb-2'>
              <div
                className={classnames('text-xxxs text-center rounded-full px-2', {
                  'bg-accent-grey-1 text-highlight-3': !isDaily,
                  'bg-accent-grey-4 text-highlight-6': isDaily
                })}
              >
                {isDaily ? t('dailyPrize') : t('prizeValue')}
              </div>
            </div>

            <NetworkBadge chainId={pool.chainId} />
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
            disabled={!Boolean(pool.symbol)}
          >
            {t('depositTicker', {
              ticker: tickerUpcased
            })}
          </Button>

          <div className='flex items-center justify-between mt-3 w-full'>
            <div className='hidden sm:flex'>{<AprChip pool={pool} />}</div>

            <span className='relative hidden sm:inline-block'>
              <ViewPoolDetailsButton />
            </span>
          </div>

          <span className='mt-1 relative sm:hidden'>{<AprChip pool={pool} />}</span>
          <div className='sm:hidden mt-1'>
            <ViewPoolDetailsButton />
          </div>
        </div>
      </div>
    </InteractableCard>
  )
}

const PoolPrizeValue = (props) => {
  const { pool } = props

  if (!pool || !pool.prize?.totalValueUsd) {
    return <div className='text-3xl sm:text-5xl text-flashy font-bold'>$0</div>
  }

  // Obviously move this to the API for all known Aave yield source pools and get the APR from Aave:
  if (pool.prizePool.address === '0x887e17d791dcb44bfdda3023d26f7a04ca9c7ef4') {
    return (
      <div className='text-3xl sm:text-5xl text-flashy font-bold ml-2'>
        $
        <PoolCountUp fontSansRegular decimals={0} duration={6}>
          {parseFloat(hardcodedAprAmountUsd(pool))}
        </PoolCountUp>
      </div>
    )
  }

  if (pool.prize.totalValueUsd) {
    return (
      <div className='text-3xl sm:text-5xl text-flashy font-bold ml-2'>
        $
        <PoolCountUp fontSansRegular decimals={0} duration={6}>
          {parseFloat(pool.prize.totalValueUsd)}
        </PoolCountUp>
      </div>
    )
  }

  if (
    pool.prize.sablierStream.id &&
    !pool.prize.sablierStream?.amountThisPrizePeriodUnformatted?.isZero()
  ) {
    return (
      <div className='text-3xl sm:text-5xl text-flashy font-bold ml-2'>
        <PoolCountUp fontSansRegular decimals={0} duration={6}>
          {parseFloat(pool.prize.sablierStream.amountThisPrizePeriod)}
        </PoolCountUp>
        <span className='text-base lg:text-lg text-inverse mb-4 ml-2 mt-auto'>
          {pool.tokens.sablierStreamToken.tokenSymbol}
        </span>
      </div>
    )
  }

  return <div className='text-3xl sm:text-5xl text-flashy font-bold ml-2'>$0</div>
}
