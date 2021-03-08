import React from 'react'
import FeatherIcon from 'feather-icons-react'
import Link from 'next/link'
import { ethers } from 'ethers'

import { Trans, useTranslation } from 'lib/../i18n'
import { Chip } from 'lib/components/Chip'
import { InteractableCard } from 'lib/components/InteractableCard'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { Odds } from 'lib/components/Odds'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usePool } from 'lib/hooks/usePool'

export const AccountPoolRow = (props) => {
  const { t } = useTranslation()

  const { noLinks, poolSymbol, playerBalance } = props
  let { href, as } = props

  const { pool } = usePool(poolSymbol)

  if (!href && !as) {
    href = '/account/pools/[symbol]'
    as = `/account/pools/${pool.symbol}`
  }

  const decimals = pool?.underlyingCollateralDecimals

  let formattedFutureDate
  let usersBalance = 0
  let usersTimelockedBalance = 0
  if (playerBalance && !isNaN(decimals)) {
    usersBalance = Number(ethers.utils.formatUnits(playerBalance, Number(decimals)))

    // usersTimelockedBalance = Number(ethers.utils.formatUnits(
    //   player.timelockedBalance,
    //   Number(decimals)
    // ))

    // if (player.unlockTimestamp) {
    //   const currentUnixTimestamp = parseInt(Date.now() / 1000, 10)
    //   const unlockUnixTimestamp = parseInt(player.unlockTimestamp, 10)

    //   formattedFutureDate = <FormattedFutureDateCountdown
    //     futureDate={unlockUnixTimestamp - currentUnixTimestamp}
    //   />
    // }
  }

  const ticker = pool?.underlyingCollateralSymbol
  const bucketClasses = 'w-1/2 xs:w-6/12 pb-2 xs:pb-0 text-xl sm:text-2xl text-inverse'
  // const bucketClasses = usersTimelockedBalance > 0 ?
  //   'w-1/2 xs:w-4/12 sm:w-4/12 lg:w-4/12 pb-2 xs:pb-0 text-xl sm:text-2xl text-inverse' :
  //   'w-1/2 xs:w-6/12 pb-2 xs:pb-0 text-xl sm:text-2xl text-inverse'

  return (
    <>
      <InteractableCard
        id={`_view${ticker}Pool`}
        href={href}
        as={as}
        key={`account-pool-row-li-${pool.poolAddress}`}
      >
        <div className='flex items-center xs:pb-2'>
          <div className='flex items-center font-bold w-8/12 sm:w-6/12 xs:pb-2'>
            <PoolCurrencyIcon lg pool={pool} className='-mt-2' />

            <div className='flex flex-col items-start justify-between w-full ml-1 sm:ml-4 leading-none'>
              <div
                className='inline-block text-left text-sm xs:text-xl sm:text-2xl font-bold text-inverse relative'
                style={{
                  top: -6
                }}
              >
                <Trans
                  i18nKey='prizeAmount'
                  defaults='Prize $<prize>{{amount}}</prize>'
                  components={{
                    prize: <PoolCountUp fontSansRegular decimals={2} duration={3} />
                  }}
                  values={{
                    amount: pool?.totalPrizeAmountUSD
                  }}
                />
              </div>
              <div
                className='inline-block text-left text-caption-2 relative mt-2'
                style={{
                  left: -2
                }}
              >
                <span className='mr-1 sm:mr-2'>
                  <Chip bgClasses='bg-accent-1' text={t(pool?.name)} />
                </span>{' '}
                <Chip bgClasses='bg-highlight-6' text={t('weekly')} />
              </div>
            </div>
          </div>

          <div className='flex flex-col items-end w-5/12 xs:w-4/12 sm:w-6/12 lg:w-9/12'>
            <NewPrizeCountdown pool={pool} />
          </div>
        </div>

        <div className='flex flex-col lg:flex-row items-end justify-between lg:pt-4'>
          <div className='flex flex-col xs:flex-row xs:items-center xs:pt-2 w-full lg:w-6/12'>
            <div className={bucketClasses}>
              {usersBalance < 1 ? (
                <>
                  <div
                    className='font-bold text-accent-3 text-default-soft'
                    style={{
                      marginTop: 23
                    }}
                  >
                    {t('notAvailableAbbreviation')}
                  </div>
                </>
              ) : (
                <>
                  <Odds
                    altSplitLines
                    fontSansRegular
                    className='font-bold text-flashy'
                    pool={pool}
                    usersBalance={playerBalance}
                  />
                </>
              )}

              <span
                className='relative block text-caption uppercase font-number mt-0 opacity-70'
                style={{
                  top: 1
                }}
              >
                {t('winningOdds')}
              </span>
            </div>

            <div className={bucketClasses}>
              <span className='font-bold'>
                <PoolCountUp
                  fontSansRegular
                  end={Math.floor(Number.parseFloat(usersBalance))}
                  decimals={null}
                  duration={0.5}
                />
                <div className='inline-block xs:block ml-1 xs:ml-0 -mt-1 text-xs sm:text-sm'>
                  {t('tickets')}
                </div>
              </span>
              <span className='block text-caption uppercase font-number mt-0 xs:mt-1 opacity-70'>
                {numberWithCommas(usersBalance, { precision: 4 })} {ticker}
              </span>
            </div>

            {usersTimelockedBalance > 0 && (
              <>
                <div className={bucketClasses}>
                  <span className='font-bold'>
                    <PoolCountUp
                      fontSansRegular
                      end={Math.floor(Number.parseFloat(usersTimelockedBalance))}
                      decimals={null}
                    />
                    <div className='inline-block xs:block ml-1 xs:ml-0 -mt-1 text-xs sm:text-sm'>
                      {t('lockedTicker', {
                        ticker: ticker?.toUpperCase()
                      })}
                    </div>
                  </span>
                  <span className='block text-caption uppercase font-number mt-0 xs:mt-1'>
                    {formattedFutureDate}
                  </span>
                </div>
              </>
            )}
          </div>

          {!noLinks && (
            <>
              <div
                className='w-full flex justify-between sm:justify-end lg:block lg:w-6/12 xs:text-right mt-4 lg:mt-0'
                style={{
                  lineHeight: 1.2
                }}
              >
                <Link href='/account/pools/[symbol]' as={`/account/pools/${pool.symbol}`}>
                  <a className='uppercase inline-block xs:inline-flex items-center justify-center text-center font-bold text-highlight-3 rounded-full border-highlight-3 xs:border-2 py-1 xs:px-6 mr-1 sm:mr-3 mb-1 xs:mb-0'>
                    {t('manageTickets')}
                  </a>
                </Link>{' '}
                <Link href='/pools/[symbol]' as={`/pools/${pool.symbol}`}>
                  <a className='inline-flex items-center justify-center font-bold text-highlight-3 rounded-full py-1 uppercase mr-3'>
                    {t('poolDetails')}{' '}
                    <FeatherIcon
                      strokeWidth='0.15rem'
                      icon='arrow-right-circle'
                      className='inline-block relative w-4 h-4 mx-auto ml-1'
                      style={{
                        top: -1
                      }}
                    />
                  </a>
                </Link>
              </div>
            </>
          )}
        </div>
      </InteractableCard>
    </>
  )
}
