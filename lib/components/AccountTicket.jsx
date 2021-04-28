import React from 'react'
import Cookies from 'js-cookie'
import classnames from 'classnames'
import { useAtom } from 'jotai'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

import { COOKIE_OPTIONS, WIZARD_REFERRER_HREF, WIZARD_REFERRER_AS_PATH } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { isSelfAtom } from 'lib/components/AccountUI'
import { hardcodedAprAmountUsd } from 'lib/components/PoolPrizeCard'
import { NetworkBadge } from 'lib/components/NetworkBadge'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import { Odds } from 'lib/components/Odds'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { PoolNumber } from 'lib/components/PoolNumber'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import PoolTogetherTrophyDetailed from 'assets/images/pooltogether-trophy--detailed.svg'

export const AccountTicket = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const [isSelf] = useAtom(isSelfAtom)

  const shouldReduceMotion = useReducedMotion()

  const { isLink, playerPoolTicketData } = props
  let { href, as } = props

  const { ticket, pool } = playerPoolTicketData
  const { amount, amountUnformatted } = ticket
  const decimals = pool.tokens.underlyingToken.decimals

  if (!href && !as) {
    href = '/account/pools/[networkName]/[symbol]'
    as = `/account/pools/${pool.networkName}/${pool.symbol}`
  }

  const ticker = pool.tokens.underlyingToken.symbol

  const handleManageClick = (e) => {
    e.preventDefault()

    if (!isSelf || !isLink) {
      return
    }

    Cookies.set(WIZARD_REFERRER_HREF, '/account', COOKIE_OPTIONS)
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/account`, COOKIE_OPTIONS)

    router.push(
      `/account/pools/[networkName]/[symbol]/manage-tickets`,
      `/account/pools/${pool.networkName}/${pool.symbol}/manage-tickets`,
      {
        shallow: true
      }
    )
  }

  return (
    <>
      <motion.div
        key={`account-pool-ticket-${pool.prizePool.address}`}
        className={classnames(
          'bg-accent-grey-4 py-2 rounded-lg relative text-xxxs sm:text-xs mb-3'
        )}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            duration: shouldReduceMotion ? 0 : 0.2,
            staggerChildren: shouldReduceMotion ? 0 : 0.5,
            delayChildren: shouldReduceMotion ? 0 : 0.2
          }
        }}
        exit={{
          scale: 0,
          opacity: 0,
          transition: {
            duration: shouldReduceMotion ? 0 : 0.2,
            staggerChildren: shouldReduceMotion ? 0 : 0.05,
            staggerDirection: -1
          }
        }}
      >
        <div className='h-24 flex items-center justify-between'>
          <div className='h-24 w-32 sm:w-40 flex flex-col items-center justify-center border-accent-3 border-dashed border-r-2'>
            <PoolCurrencyIcon
              lg
              noMargin
              sizeClasses='w-6 h-6'
              symbol={ticker}
              address={pool.tokens.underlyingToken.address}
            />
            <div className='capitalize mt-2 text-xs font-bold text-inverse-purple'>
              {ticker?.toUpperCase()}
            </div>
          </div>

          <div className='flex flex-col sm:flex-row w-full'>
            <div className='w-10/12 sm:w-5/12 mx-auto flex flex-col items-start justify-start sm:justify-center leading-none sm:pl-8'>
              <div className='text-lg sm:text-xl sm:text-3xl lg:text-4xl font-bold text-inverse-purple'>
                <PoolNumber>{numberWithCommas(amount)}</PoolNumber>
              </div>

              <div className='flex sm:flex-col items-baseline sm:items-start'>
                <span className='relative inline-block leading-normal text-accent-1 mr-1 sm:mr-0'>
                  {t('winningOdds')}:
                </span>{' '}
                {Number(amount) < 1 ? (
                  <span className='font-bold text-accent-3'>{t('notAvailableAbbreviation')}</span>
                ) : (
                  <Odds
                    asSpan
                    fontSansRegular
                    className='font-bold text-flashy'
                    usersBalance={amountUnformatted.toString()}
                    ticketSupplyUnformatted={pool.tokens.ticket.totalSupplyUnformatted}
                    decimals={decimals}
                    numberOfWinners={pool.config.numberOfWinners}
                  />
                )}
              </div>
            </div>

            <div className='w-10/12 sm:w-7/12 mx-auto flex flex-col sm:items-end sm:justify-end pt-1 sm:pt-3 sm:pb-4 sm:pl-2 sm:pr-12'>
              <div className='flex items-baseline text-xs sm:text-xl font-bold text-accent-1'>
                <img
                  src={PoolTogetherTrophyDetailed}
                  className='relative w-3 sm:w-4 mr-1 sm:mr-2 opacity-70'
                  style={{
                    filter: 'brightness(5)',
                    top: 2
                  }}
                />
                {pool.prize.totalValueUsd && decimals && (
                  <>
                    $
                    <PoolCountUp
                      fontSansRegular
                      decimals={0}
                      duration={3}
                      end={
                        pool.prizePool.address === '0x887e17d791dcb44bfdda3023d26f7a04ca9c7ef4'
                          ? hardcodedAprAmountUsd(pool)
                          : parseFloat(pool.prize.totalValueUsd)
                      }
                    />
                  </>
                )}

                <span className='text-xxxxs sm:text-xxs font-regular'>
                  <NewPrizeCountdownInWords onTicket extraShort pool={pool} />
                </span>
              </div>

              <div className='flex sm:flex-col items-center sm:items-end mt-1 sm:mt-0'>
                {isSelf && isLink && (
                  <>
                    <NetworkBadge
                      className='sm:mx-auto'
                      sizeClasses='w-3 h-3'
                      textClasses='text-xxxs sm:text-xxs'
                      chainId={pool.chainId}
                    />
                    <button
                      onClick={handleManageClick}
                      className='text-accent-1 underline text-xxxs sm:text-xxs ml-2 sm:ml-0'
                    >
                      {t('manage')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
