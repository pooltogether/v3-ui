import React from 'react'
import { PageTitleAndBreadcrumbs } from '@pooltogether/react-components'

import { useTranslation } from 'react-i18next'
import { CardGrid } from 'lib/components/CardGrid'
import { PrizeShowLootBoxTable } from 'lib/components/LootBoxTable'
import { HistoricPrizeBreakdown } from 'lib/components/HistoricPrizeBreakdown'
import { IndexUILoader } from 'lib/components/loaders/IndexUILoader'
import { Meta } from 'lib/components/Meta'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { PrizePlayersQuery } from 'lib/components/PrizePlayersQuery'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import TicketsIcon from 'images/icon-ticket@2x.png'
import Link from 'next/link'

const ETHEREUM_MAINNET_SOHM_POOL_ADDRESS = '0xeab695a8f5a44f583003a8bc97d677880d528248'

export function PrizeShow(props) {
  const { t } = useTranslation()

  const { pool, preAwardPool, prize } = props

  const prizeNumber = prize.id
  const poolName = pool.name
  const poolSymbol = pool.symbol
  const poolNetworkName = pool.networkName
  const ticker = pool.tokens.underlyingToken.symbol
  const decimals = pool.tokens.underlyingToken.decimals
  const preAwardTicketSupply = preAwardPool.tokens.ticket.totalSupply
  const prizeValueUsd = prize.totalValueUsd

  const isSohm =
    pool.prizePool.address.toLowerCase() === ETHEREUM_MAINNET_SOHM_POOL_ADDRESS.toLowerCase()

  return (
    <>
      <Meta title={poolName && prizeNumber && `${t('prize')} #${prizeNumber} - ${poolName}`} />

      <PageTitleAndBreadcrumbs
        Link={Link}
        title={t('prizes')}
        pool={pool}
        breadcrumbs={[
          {
            href: '/pools',
            as: '/pools',
            name: t('pools')
          },
          {
            href: '/pools/[networkName]',
            as: `/pools/${pool.networkName}`,
            name: getNetworkNiceNameByChainId(pool.chainId)
          },
          {
            href: '/pools/[networkName]/[symbol]',
            as: `/pools/${poolNetworkName}/${poolSymbol}`,
            name: poolName
          },
          {
            href: '/prizes/[networkName]/[symbol]',
            as: `/prizes/${poolNetworkName}/${poolSymbol}`,
            name: t('prizes')
          },
          {
            name: `${t('prize')} #${prizeNumber}`
          }
        ]}
      />

      <div className='rounded-lg px-4 xs:px-6 sm:px-10 py-4 text-inverse my-4 sm:mt-8 sm:mb-4 mx-auto border-flashy purple-pink-gradient-animation'>
        <h1>
          {isSohm ? (
            <>
              {numberWithCommas(prize.yield.amount)}{' '}
              <span className='text-accent-1 opacity-60'>sOHM</span>
            </>
          ) : (
            `$${numberWithCommas(prizeValueUsd)}`
          )}
        </h1>
      </div>

      <HistoricPrizeBreakdown
        prizeNumber={prizeNumber}
        prize={prize}
        pool={pool}
        preAwardPool={preAwardPool}
      />

      <PrizeShowLootBoxTable
        historical
        prize={prize}
        poolSymbol={poolSymbol}
        poolNetworkName={poolNetworkName}
      />

      <CardGrid
        className='my-4'
        cardGroupId='prize-cards'
        cards={[
          {
            noMinHeight: true,
            icon: TicketsIcon,
            title: t('depositedAmount'),
            content: (
              <h3>
                {numberWithCommas(preAwardTicketSupply, { decimals })}{' '}
                <span className='text-accent-1 opacity-60'>{ticker}</span>
              </h3>
            )
          }
        ]}
      />

      <PrizePlayersQuery pool={preAwardPool} blockNumber={prize.awardedBlock - 1}>
        {({ data, isFetched }) => {
          if (!isFetched) {
            return (
              <div className='mt-10'>
                <IndexUILoader />
              </div>
            )
          }

          return (
            <PrizePlayerListing
              baseAsPath={`/prizes/${poolNetworkName}/${poolSymbol}/${prizeNumber}`}
              baseHref='/prizes/[networkName]/[symbol]/[prizeNumber]'
              isFetched={isFetched}
              balances={data}
              pool={preAwardPool}
              prize={prize}
            />
          )
        }}
      </PrizePlayersQuery>
    </>
  )
}
