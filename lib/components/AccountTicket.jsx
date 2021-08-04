import React from 'react'
import Cookies from 'js-cookie'
import classnames from 'classnames'
import Link from 'next/link'
import { useAtom } from 'jotai'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { TicketRow, TokenIcon } from '@pooltogether/react-components'

import { COOKIE_OPTIONS, WIZARD_REFERRER_HREF, WIZARD_REFERRER_AS_PATH } from 'lib/constants'
import { useTranslation } from 'react-i18next'
import { isSelfAtom } from 'lib/components/AccountUI'
import { NetworkBadge } from 'lib/components/NetworkBadge'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import { Odds } from 'lib/components/Odds'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { PoolNumber } from 'lib/components/PoolNumber'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import PoolTogetherTrophyDetailed from 'assets/images/pooltogether-trophy--detailed.svg'
import { TicketPrize } from 'lib/components/TicketPrize'

export const AccountTicket = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const [isSelf] = useAtom(isSelfAtom)

  const { isLink, depositData, pool, cornerBgClassName } = props
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
      className='mb-4'
      cornerBgClassName={cornerBgClassName}
      left={
        <button onClick={handlePoolClick} className='flex flex-col justify-center h-full w-full'>
          <TokenIcon
            address={pool.tokens.underlyingToken.address}
            chainId={pool.chainId}
            className='w-6 h-6 mx-auto'
          />
          <div className='capitalize mt-2 mx-auto text-xs font-bold text-inverse-purple'>
            {ticker?.toUpperCase()}
          </div>
        </button>
      }
      right={
        <div className='flex flex-col sm:flex-row justify-between'>
          <div className='flex flex-col justify-start sm:justify-between leading-none'>
            <div className='text-lg sm:text-2xl font-bold text-inverse-purple mb-1'>
              <PoolNumber>{numberWithCommas(amount)}</PoolNumber>
            </div>

            <div className='flex sm:flex-col items-baseline sm:items-start text-xxxs'>
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
          <div className={classnames('flex flex-col sm:items-end sm:justify-between')}>
            <TicketPrize prize={pool.prize} />

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
                    className='underline text-highlight-1 hover:text-inverse trans text-xxxs sm:text-xxs ml-2 sm:ml-0'
                  >
                    {t('manage')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      }
    />
  )
}
