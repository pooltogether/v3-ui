import React from 'react'
import { LinkTheme, ExternalLink, TicketRow, TokenIcon } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'
import { NETWORK } from '@pooltogether/utilities'

import { Erc20Image } from 'lib/components/Erc20Image'
import { NetworkBadge } from 'lib/components/NetworkBadge'
import { PoolNumber } from 'lib/components/PoolNumber'
import { useV2Balances } from 'lib/hooks/useV2Balances'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { WinningOdds } from 'lib/components/WinningOdds'

export const V2Tickets = (props) => {
  const { usersAddress } = props
  const { data: balances, isFetched } = useV2Balances(usersAddress)

  if (!isFetched || balances.length === 0) {
    return null
  }

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
    <TicketRow
      className='mb-4'
      left={
        <div className='h-full flex flex-col justify-center'>
          <TokenIcon
            address={underlyingToken.address}
            chainId={NETWORK.mainnet}
            className='w-6 h-6 mx-auto'
          />
          <span className='capitalize mx-auto mt-2 text-xs font-bold text-inverse-purple'>
            {underlyingToken.symbol}
          </span>
        </div>
      }
      right={
        <div className='flex flex-col sm:flex-row w-full justify-between'>
          <div className='flex flex-col justify-start'>
            <div className='text-lg sm:text-2xl font-bold text-inverse-purple'>
              <PoolNumber>{numberWithCommas(amount)}</PoolNumber>
            </div>
            <div className='flex flex-row sm:flex-col'>
              <WinningOdds
                className='flex sm:flex-col text-xxxs mr-auto'
                odds={0}
                isLoading={false}
              />
            </div>
          </div>
          <div className='sm:text-right flex flex-col my-auto'>
            <span className='text-xxxs sm:text-xxs text-accent-1 font-bold mb-1'>
              {t('thisPoolIsNoLongerSupported')}
            </span>
            <div className='flex flex-col'>
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
                  className='text-xxxs sm:text-xxs'
                  theme={LinkTheme.accent}
                >
                  {t('withdrawOnV2')}
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
      }
    />
  )
}
