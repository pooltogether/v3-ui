import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import { Trans, useTranslation } from 'lib/../i18n'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import { Odds } from 'lib/components/Odds'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const AccountTicket = (
  props,
) => {
  const { t } = useTranslation()
  const router = useRouter()
  
  const { noLinks, pool, player } = props
  let { href, as } = props

  if (!href && !as) {
    href = '/account/pools/[symbol]'
    as = `/account/pools/${pool.symbol}`
  }


  const decimals = pool?.underlyingCollateralDecimals

  let formattedFutureDate
  let usersBalance = 0
  let usersTimelockedBalance = 0
  if (player && player.balance && !isNaN(decimals)) {
    usersBalance = Number(ethers.utils.formatUnits(
      player.balance,
      Number(decimals)
    ))
  }

  const ticker = pool?.underlyingCollateralSymbol
  const bucketClasses = 'w-1/2 xs:w-6/12 pb-2 xs:pb-0 text-xl sm:text-2xl text-inverse'
  

  const handleManageClick = (e) => {
    e.preventDefault()

    Cookies.set(
      WIZARD_REFERRER_HREF,
      '/account',
      COOKIE_OPTIONS
    )
    Cookies.set(
      WIZARD_REFERRER_AS_PATH,
      `/account`,
      COOKIE_OPTIONS
    )

    router.push(
      `/account/pools/[symbol]/withdraw`,
      `/account/pools/${pool?.symbol}/withdraw`,
      {
        shallow: true
      }
    )
  }

  return <>
    <motion.div
      onClick={handleManageClick}
      key={`account-pool-ticket-${pool.poolAddress}`}
      className='relative ticket-bg cursor-pointer'
      style={{
        height: 196,
        width: 409
      }}
      whileHover={{
        y: -5, scale: 1.05
      }}
      whileTap={{ y: 1, scale: 0.98 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.2,
          staggerChildren: 0.5,
          delayChildren: 0.2
        }
      }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { staggerChildren: 0.05, staggerDirection: -1 }
      }}
    >
      <div
        className='absolute rounded-b-lg'
        style={{
          backgroundImage: 'url(/ticket-bg--dai.svg)',
          bottom: 3,
          left: 2,
          width: 405,
          height: 50,
        }}
      >

      </div>

      <div className='flex items-center xs:pb-2'>
        <div
          className='flex items-center font-bold w-3/4 xs:pb-2'
        >
          

          <div
            className='flex items-center justify-start w-full pl-4 leading-none'
          >
            <div
              className='inline-block text-left text-sm xs:text-xl sm:text-2xl font-bold text-inverse relative'
            >
              $<PoolCountUp
                fontSansRegular
                decimals={2}
                duration={3}
                end={Math.floor(Number.parseFloat(
                  ethers.utils.formatUnits(pool?.prizeAmountUSD, decimals)
                ))}
              />
            </div>
            <NewPrizeCountdownInWords
              extraShort
              text='primary'
              pool={pool}
            />
            
          </div>
        </div>

        <div
          className='flex flex-col items-center'
          style={{
            width: 114
          }}
        >
          <PoolCurrencyIcon
            pool={pool}
            className='-mt-2'
          />
          <h4
            className='capitalize'
          >
            {ticker.toLowerCase()}
          </h4>
          
          
        </div>
      </div>

      <div
        className='flex flex-col lg:flex-row items-end justify-between lg:pt-4'
      >
        <div
          className='flex flex-col xs:flex-row xs:items-center xs:pt-2 w-full lg:w-6/12'
        >
          <div
            className={bucketClasses}
          >
            {usersBalance < 1 ? <>
              <div
                className='font-bold text-accent-3 text-default-soft'
                style={{
                  marginTop: 23
                }}
              >
                {t('notAvailableAbbreviation')}
              </div>
            </> : <>
              <Odds
                altSplitLines
                fontSansRegular
                className='font-bold text-flashy'
                pool={pool}
                usersBalance={usersBalance}
              />
            </>}
            
            <span
              className='relative block text-caption uppercase font-number mt-0 opacity-70'
              style={{
                top: 1
              }}
            >
              {t('winningOdds')}
            </span>
          </div>

          <div
            className={bucketClasses}
          >
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
            <span
              className='block text-caption uppercase font-number mt-0 xs:mt-1 opacity-70'
            >
              ${numberWithCommas(usersBalance, { precision: 4 })} {ticker}
            </span>
          </div>

          {usersTimelockedBalance > 0 && <>
            <div
              className={bucketClasses}
            >
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
              <span
                className='block text-caption uppercase font-number mt-0 xs:mt-1'
              >
                {formattedFutureDate}
              </span>
            </div>
          </>}
          
        </div>

        {!noLinks && <>
          <div
            className='w-full flex justify-between sm:justify-end lg:block lg:w-6/12 xs:text-right mt-4 lg:mt-0'
            style={{
              lineHeight: 1.2,
            }}
          >
            <span
              className='uppercase inline-block xs:inline-flex items-center justify-center text-center font-bold py-1 xs:px-6 mr-1 sm:mr-3 mb-1 xs:mb-0'
            >
              {t('manageTickets')}
            </span>
          </div>
        </>}
      </div>
    </motion.div>
  </>
}
