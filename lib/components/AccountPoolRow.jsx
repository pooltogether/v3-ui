import React from 'react'
import FeatherIcon from 'feather-icons-react'
import Link from 'next/link'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { InteractableCard } from 'lib/components/InteractableCard'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { Odds } from 'lib/components/Odds'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const AccountPoolRow = (
  props,
) => {
  const { t } = useTranslation()
  
  const { pool, player } = props

  const decimals = pool?.underlyingCollateralDecimals

  let usersBalance = 0
  if (player && player.balance && !isNaN(decimals)) {
    usersBalance = Number(ethers.utils.formatUnits(
      player.balance,
      Number(decimals)
    ))
  }

  const ticker = pool?.underlyingCollateralSymbol
  
  return <>
    <InteractableCard
      key={`account-pool-row-li-${pool.poolAddress}`}
      href='/account/pools/[symbol]'
      as={`/account/pools/${pool.symbol}`}
      className='ticket-card'
    >
      <div className='flex items-center pb-2'>
        <div
          className='flex items-center font-bold w-8/12 sm:w-6/12 pb-2'
        >
          <PoolCurrencyIcon
            lg
            pool={pool}
          />

          <div
            className='flex flex-col items-start justify-between w-full ml-1 sm:ml-6 leading-none'
          >
            <div
              className='inline-block text-left text-xl sm:text-2xl lg:text-3xl font-bold text-inverse relative'
              style={{
                top: -6
              }}
            >
              {t('prizeAmount', {
                amount: displayAmountInEther(
                  pool?.estimatePrize,
                  { decimals, precision: 2 }
                )
              })}
            </div>
            <div
              className='inline-block text-left text-caption-2 relative'
              style={{
                left: 2,
                bottom: -4
              }}
            >
              <span
                className='uppercase'
              >
                {pool.frequency}
              </span>
            </div>
          </div>

        </div>

        <div
          className='flex flex-col items-end w-4/12 sm:w-6/12 lg:w-9/12'
        >
          <NewPrizeCountdown
            pool={pool}
          />
        </div>
      </div>

      <div
        className='mt-6 flex items-center justify-between pt-4'
      >
        <div
          className='w-full xs:w-4/12 sm:w-4/12 lg:w-4/12 sm:border-r border-accent-4'
        >
          {usersBalance < 1 ? <>
            <span
              className='font-bold text-xl sm:text-2xl lg:text-3xl text-accent-3'
            >
              {t('notAvailableAbbreviation')}
            </span>
          </> : <>
            <Odds
              fontSansRegular
              className='font-bold text-flashy text-xl sm:text-2xl lg:text-3xl'
              pool={pool}
              usersBalance={usersBalance}
            />
          </>}
          
          <span
            className='block text-caption uppercase font-bold'
          >
            {t('winningOdds')}
          </span>
        </div>

        <div
          className='w-full xs:w-6/12 sm:w-6/12 lg:w-6/12 sm:pl-16 font-bold text-xl sm:text-2xl lg:text-3xl text-inverse'
        >
          <PoolCountUp
            fontSansRegular
            end={Number.parseFloat(usersBalance).toFixed(0)}
            decimals={null}
          /> {t('tickets')}
          <span className='block text-caption uppercase'>
            ${numberWithCommas(usersBalance, { precision: 4 })} {ticker}
          </span>
        </div>

        <div
          className='w-2/12 text-right'
          style={{
            lineHeight: 1.2,
          }}
        >
          <Link
            href='/account/pools/[symbol]'
            as={`/account/pools/${pool.symbol}`}
          >
            <a
              className='flex items-center justify-center font-bold text-highlight-3 uppercase pt-12'
            >
              <FeatherIcon
                strokeWidth='0.09rem'
                icon='arrow-right-circle'
                className='relative w-5 h-5 ml-auto mr-2'
                style={{
                  left: -1,
                  top: '0.05rem'
                }}
              /> {t('details')}
            </a>
          </Link>
        </div>
      </div>
    </InteractableCard>
  </>
}
