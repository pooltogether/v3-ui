import React from 'react'
import Cookies from 'js-cookie'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import { Odds } from 'lib/components/Odds'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolCountUp } from 'lib/components/PoolCountUp'

export const AccountTicket = (
  props,
) => {
  const { t } = useTranslation()
  const router = useRouter()
  
  const { pool, player } = props
  let { href, as } = props

  if (!href && !as) {
    href = '/account/pools/[symbol]'
    as = `/account/pools/${pool.symbol}`
  }


  const decimals = pool?.underlyingCollateralDecimals

  let usersBalance = 0
  if (player && player.balance && !isNaN(decimals)) {
    usersBalance = Number(ethers.utils.formatUnits(
      player.balance,
      Number(decimals)
    ))
  }

  const ticker = pool?.underlyingCollateralSymbol

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
      className='relative ticket cursor-pointer bg-no-repeat'
      style={{
        height: 197,
        width: 410
      }}
      whileHover={{
        scale: 1.025
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
        className={classnames(
          'absolute rounded-b-lg bg-no-repeat',
          {
            'ticket--blue': ticker.toLowerCase() === 'usdc'
          }
        )}
        style={{
          backgroundImage: 'url(/ticket-bg--dai.svg)',
          backgroundPosition: '0 -1px',
          bottom: 2,
          left: 1,
          width: 406,
          height: 66,
        }}
      />

      <div className='flex items-start'>
        <div
          className='flex items-center w-3/4'
        >
          <div
            className='flex flex-col justify-start w-full pl-8 pt-8 leading-none'
          >
            <div
              className='text-4xl font-bold'
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
              className='flex text-left text-sm xs:text-xl font-bold text-darkened relative mt-12 pt-1'
            >
              <div
                className='w-5/12'
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
              <div
                className='w-7/12 pl-2'
              >
                <NewPrizeCountdownInWords
                  extraShort
                  text='xxxs'
                  pool={pool}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className='pt-10 leading-none'
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
              className='capitalize mt-1 text-lg font-bold'
            >
              {ticker.toLowerCase()}
            </div>


            <span
              className='inline-flex items-center justify-center text-center font-bold mt-12 pt-2 z-10 text-darkened pl-2'
            >
              {t('manage')} <FeatherIcon
                icon='chevron-right'
                strokeWidth='0.25rem'
                className='w-3 h-3 mx-1'
              />
            </span>
          </div>
        </div>
      </div>

    </motion.div>
  </>
}
