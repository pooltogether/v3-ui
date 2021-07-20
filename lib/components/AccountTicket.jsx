import React from 'react'
import Cookies from 'js-cookie'
import classnames from 'classnames'
import Link from 'next/link'
import { useAtom } from 'jotai'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { TicketRow } from '@pooltogether/react-components'

import { COOKIE_OPTIONS, WIZARD_REFERRER_HREF, WIZARD_REFERRER_AS_PATH } from 'lib/constants'
import { useTranslation } from 'react-i18next'
import { isSelfAtom } from 'lib/components/AccountUI'
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

  const { isLink, depositData, pool, cornerBgClassName, isSponsorship } = props
  let { href, as } = props

  const { amount, amountUnformatted } = depositData
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

  const handlePoolClick = (e) => {
    e.preventDefault()

    if (!isSelf || !isLink) {
      return
    }

    router.push(`/pools/[networkName]/[symbol]`, `/pools/${pool.networkName}/${pool.symbol}`)
  }

  return (
    <TicketRow
      className='mb-4 last:mb-0'
      cornerBgClassName={cornerBgClassName}
      left={
        <button onClick={handlePoolClick} className='flex flex-col justify-center h-full w-full'>
          <PoolCurrencyIcon
            lg
            noMargin
            sizeClasses='w-6 h-6'
            className='mx-auto'
            symbol={ticker}
            address={pool.tokens.underlyingToken.address}
          />
          <div className='capitalize mt-2 mx-auto text-xs font-bold text-inverse-purple'>
            {ticker?.toUpperCase()}
          </div>
        </button>
      }
      right={
        <div className='flex flex-col sm:flex-row'>
          <div className='w-10/12 sm:w-5/12 mx-auto flex flex-col items-start justify-start sm:justify-center leading-none'>
            <div className='text-lg sm:text-2xl font-bold text-inverse-purple mb-1'>
              <PoolNumber>{numberWithCommas(amount)}</PoolNumber>
            </div>

            <div className='flex sm:flex-col items-baseline sm:items-start'>
              {!isSponsorship && (
                <>
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
                </>
              )}
            </div>
          </div>
          <div
            className={classnames('w-10/12 sm:w-7/12 mx-auto flex flex-col sm:items-end', {
              'sm:justify-center': isSponsorship,
              'sm:justify-between': !isSponsorship
            })}
          >
            <div className='flex items-baseline text-xs sm:text-xl font-bold text-accent-1'>
              {!isSponsorship && (
                <>
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
                        end={parseFloat(pool.prize.totalValueUsd)}
                      />
                    </>
                  )}
                  <span className='text-xxxxs sm:text-xxs font-regular'>
                    {!isSponsorship && (
                      <NewPrizeCountdownInWords
                        onTicket
                        extraShort
                        prizePeriodSeconds={pool.prize.prizePeriodSeconds}
                        prizePeriodStartedAt={pool.prize.prizePeriodSeconds}
                        isRngRequested={pool.prize.isRngRequested}
                      />
                    )}
                  </span>
                </>
              )}
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
                  {isSponsorship ? (
                    <Link href='/rewards#sponsorship' as='/rewards#sponsorship'>
                      <a className='underline text-highlight-1 hover:text-inverse trans text-xxxs sm:text-xxs ml-2 sm:ml-0'>
                        {t('manage')}
                      </a>
                    </Link>
                  ) : (
                    <button
                      onClick={handleManageClick}
                      className='underline text-highlight-1 hover:text-inverse trans text-xxxs sm:text-xxs ml-2 sm:ml-0'
                    >
                      {t('manage')}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      }
    />
  )
}
