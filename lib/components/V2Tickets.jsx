import React from 'react'
import { LinkTheme, ExternalLink } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'
import { NETWORK } from '@pooltogether/utilities'

import { Erc20Image } from 'lib/components/Erc20Image'
import { NetworkBadge } from 'lib/components/NetworkBadge'
import { PoolNumber } from 'lib/components/PoolNumber'
import { useV2Balances } from 'lib/hooks/useV2Balances'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const V2Tickets = (props) => {
  const { usersAddress } = props
  const { data: balances, isFetched } = useV2Balances(usersAddress)

  if (!isFetched) return null

  return (
    <ul>
      {balances?.map((pool) => (
        <V2Ticket key={`v2Ticket-${pool.prizePool.address}`} {...pool} />
      ))}
    </ul>
  )
}

const V2Ticket = (props) => {
  const { underlyingToken, amount, amountUnformatted } = props
  const { t } = useTranslation()

  if (amountUnformatted.isZero()) return null

  return (
    <div className='bg-accent-grey-4 py-2 rounded-lg relative text-xxxs sm:text-xs mb-3 flex flex-row '>
      <div className='flex flex-col justify-center text-center border-body border-dotted border-r-4 w-32 sm:w-40'>
        <Erc20Image address={underlyingToken.address} marginClasses='mx-auto' />
        <span className='capitalize mt-2 text-xs font-bold text-inverse-purple'>
          {underlyingToken.symbol}
        </span>
      </div>
      <div className='flex flex-col sm:flex-row w-full justify-between px-8'>
        <div className='flex flex-col justify-start'>
          <div className='text-lg sm:text-2xl font-bold text-inverse-purple'>
            <PoolNumber>{numberWithCommas(amount)}</PoolNumber>
          </div>
          <div className='flex flex-row sm:flex-col'>
            <span className='relative inline-block leading-normal text-accent-1 mr-1 sm:mr-0'>
              {t('winningOdds')}:
            </span>
            <span className='font-bold text-accent-3'>{t('notAvailableAbbreviation')}</span>
          </div>
        </div>
        <div className='sm:text-right flex flex-col my-auto'>
          <span className='text-xxxs sm:text-xs text-accent-1 font-bold mb-1'>
            {t('thisPoolIsNoLongerSupported')}
          </span>
          <div className='flex flex-row sm:flex-col'>
            <div className='sm:ml-auto'>
              <NetworkBadge
                sizeClasses='w-3 h-3'
                textClasses='text-xxxs sm:text-xxs'
                chainId={NETWORK.mainnet}
              />
            </div>
            <div>
              <ExternalLink
                href='https://v2.pooltogether.com/en/account'
                underline
                className='text-xxxs sm:text-xxs ml-2 sm:ml-0'
                theme={LinkTheme.accent}
              >
                {t('withdrawOnV2')}
              </ExternalLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
