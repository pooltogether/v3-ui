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
import { useTranslation } from 'react-i18next'
import { Button, TokenIcon } from '@pooltogether/react-components'

import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { InteractableCard } from 'lib/components/InteractableCard'
import { NetworkBadge } from 'lib/components/NetworkBadge'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { PoolPrizeValue } from 'lib/components/PoolPrizeValue'
import { AprChip } from 'lib/components/AprChip'

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

  const ViewPoolDetailsButton = (props) => (
    <button
      className={classnames(
        'flex justify-between items-center text-highlight-3 bg-transparent text-xxxs rounded-full px-2 trans',
        props.className
      )}
    >
      {t('viewPool')}
    </button>
  )

  const isDaily = pool.prize.prizePeriodSeconds.toNumber() === SECONDS_PER_DAY

  return (
    <InteractableCard
      id={`_view${symbol}Pool`}
      href='/pools/[networkName]/[symbol]'
      as={`/pools/${pool.networkName}/${symbol}`}
      className='mt-1 sm:mt-2 relative'
    >
      <NetworkBadge
        className='absolute t-0 l-0 px-3 py-1 rounded-tl-lg rounded-br-lg border-b border-r border-accent-4'
        chainId={pool.chainId}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)'
        }}
      />

      <div className='flex flex-col sm:flex-row items-center text-inverse'>
        <div className='h-full flex py-2 p-4 sm:pl-4 lg:px-6 sm:pt-3 sm:pb-5 rounded-lg items-start justify-center sm:justify-start w-full sm:mr-6'>
          <div className='flex flex-col mx-auto'>
            <div className='flex items-center justify-center'>
              <TokenIcon
                chainId={pool.chainId}
                address={pool.tokens.underlyingToken.address}
                sizeClassName='w-9 h-9'
                className='mr-2 my-auto'
              />
              <PoolPrizeValue pool={pool} />
            </div>

            <div className='flex items-center justify-center'>
              <div
                className={classnames('text-xxxs text-center rounded-full px-2', {
                  'bg-accent-grey-1 text-green': !isDaily,
                  'bg-accent-grey-2 text-highlight-6': isDaily
                })}
              >
                {isDaily ? t('dailyPrize') : t('prizeValue')}
              </div>
            </div>
          </div>
        </div>

        <div className='hidden sm:flex flex-col items-start justify-center'>
          <div className='border-default h-20 opacity-30' style={{ borderLeftWidth: 1 }}>
            &nbsp;
          </div>
        </div>

        <div className='mt-4 sm:mt-0 w-full flex'>
          <div className='flex flex-col mx-auto'>
            <NewPrizeCountdown
              center
              textSize='text-sm sm:text-lg'
              prizePeriodSeconds={pool.prize.prizePeriodSeconds}
              prizePeriodStartedAt={pool.prize.prizePeriodStartedAt}
              isRngRequested={pool.prize.isRngRequested}
            />

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

            {pool.tokenFaucets?.length === 0 && (
              <div className='flex w-full justify-center sm:justify-end pt-2'>
                <ViewPoolDetailsButton />
              </div>
            )}

            {pool.tokenFaucets?.length > 0 && (
              <div className='flex flex-col sm:flex-row w-full justify-between pt-2'>
                <div className='mx-auto sm:mx-0'>
                  {pool.tokenFaucets.map((tokenFaucet) => (
                    <AprChip
                      key={tokenFaucet.address}
                      chainId={pool.chainId}
                      tokenFaucet={tokenFaucet}
                    />
                  ))}
                </div>
                <ViewPoolDetailsButton className='mx-auto sm:mx-0 mt-1 sm:mt-0' />
              </div>
            )}
          </div>
        </div>
      </div>
    </InteractableCard>
  )
}
