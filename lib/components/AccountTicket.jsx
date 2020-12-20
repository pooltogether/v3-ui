import React from 'react'
import Cookies from 'js-cookie'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import {
  COOKIE_OPTIONS,
  WIZARD_REFERRER_HREF,
  WIZARD_REFERRER_AS_PATH
} from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import { Odds } from 'lib/components/Odds'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { usePool } from 'lib/hooks/usePool'

export const AccountTicket = (
  props,
) => {
  const { t } = useTranslation()
  const router = useRouter()
  
  const { noMargin, isLink, playerTicket } = props
  let { href, as } = props

  const { pool } = usePool(playerTicket?.pool?.symbol)

  if (!playerTicket?.pool?.symbol) {
    return null
  }


  const { balance } = playerTicket

  const decimals = pool?.underlyingCollateralDecimals

  if (!href && !as) {
    href = '/account/pools/[symbol]'
    as = `/account/pools/${pool?.symbol}`
  }

  let usersBalance = 0
  if (balance && !isNaN(decimals)) {
    usersBalance = Number(ethers.utils.formatUnits(
      balance,
      Number(decimals)
    ))
  }

  const ticker = pool?.underlyingCollateralSymbol

  const handleManageClick = (e) => {
    e.preventDefault()

    if (!isLink) {
      return
    }

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
      `/account/pools/[symbol]/manage-tickets`,
      `/account/pools/${pool?.symbol}/manage-tickets`,
      {
        shallow: true
      }
    )
  }

  return <>
    <motion.div
      onClick={handleManageClick}
      key={`account-pool-ticket-${pool?.poolAddress}`}
      className={classnames(
        'relative ticket bg-no-repeat text-xxxs xs:text-xs',
        {
          'xs:mr-6 mb-6': !noMargin,
          'cursor-pointer': isLink
        }
      )}
      whileHover={{
        scale: isLink ? 1.025 : 1
      }}
      whileTap={{
        y: 1,
        scale: 0.98
      }}
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
        className={classnames(
          `ticket--${ticker?.toLowerCase()} absolute rounded-b-lg bg-no-repeat ticket-strip`
        )}
      />

      <div className='flex items-start text-left'>
        <div
          className='flex items-center w-3/4'
        >
          <div
            className='flex flex-col justify-start w-full pl-6 pt-6 xs:pl-10 xs:pt-8 leading-none'
          >
            <div
              className='text-xl xs:text-4xl font-bold text-inverse-purple'
            >
              <PoolCountUp
                fontSansRegular
                end={Math.floor(Number.parseFloat(usersBalance))}
                decimals={null}
                duration={0.5}
              />
            </div>

            <div
              className='mt-2'
            >
              <span
                className='relative text-inverse'
              >
                {t('winningOdds')}:
              </span> {usersBalance < 1 ? <>
                <span
                  className='font-bold text-accent-3 text-default-soft'
                  style={{
                    marginTop: 23
                  }}
                >
                  {t('notAvailableAbbreviation')}
                </span>
              </> : <>
                <Odds
                  asSpan
                  fontSansRegular
                  className='font-bold text-flashy'
                  pool={pool}
                  usersBalance={usersBalance}
                />
              </>}
            </div>

            <div
              className='flex items-center text-left text-xs xs:text-xl font-bold text-darkened relative mt-8 xs:mt-12 pt-2 xs:pt-1'
            >
              <div
                className='w-5/12'
              >
                {pool?.totalPrizeAmountUSD && decimals && <>
                  $<PoolCountUp
                    fontSansRegular
                    decimals={2}
                    duration={3}
                    end={pool?.totalPrizeAmountUSD ?
                      Math.floor(Number.parseFloat(
                        ethers.utils.formatUnits(pool?.totalPrizeAmountUSD, decimals)
                      )) : 
                      0
                    }
                  />
                </>}
              </div>
              <div
                className='w-7/12 pl-2'
              >
                <div
                  className='font-bold text-xxxxs xs:text-xxxs'
                >
                  <NewPrizeCountdownInWords
                    onTicket
                    extraShort
                    pool={pool}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className='pt-5 xs:pt-10 leading-none'
          style={{
            width: 86
          }}
        >
          <div className='flex flex-col items-center'>
            <PoolCurrencyIcon
              noMediaQueries
              noMargin
              pool={pool}
            />
            <div
              className='capitalize mt-2 text-xs xs:text-lg font-bold text-inverse-purple'
            >
              {ticker?.toUpperCase()}
            </div>


            {isLink && <>
              <span
                className='inline-flex items-center justify-center text-center font-bold mt-8 xs:mt-10 xs:pt-3 z-10 text-darkened pl-2'
              >
                {t('manage')} <FeatherIcon
                  icon='chevron-right'
                  strokeWidth='0.25rem'
                  className='w-3 h-3 mx-1'
                />
              </span>
            </>}
          </div>
        </div>
      </div>

    </motion.div>
  </>
}
