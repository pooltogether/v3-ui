import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import TicketsIcon from 'assets/images/icon-ticket@2x.png'
import { useTranslation } from 'lib/../i18n'
import { CardGrid } from 'lib/components/CardGrid'
import { LootBoxTable } from 'lib/components/LootBoxTable'
import { IndexUILoader } from 'lib/components/loaders/IndexUILoader'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PrizeBreakdown } from 'lib/components/PrizeBreakdown'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { PrizePlayersQuery } from 'lib/components/PrizePlayersQuery'
import { Tagline } from 'lib/components/Tagline'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

const bn = ethers.BigNumber.from

export function PrizeShow(props) {
  const { t } = useTranslation()
  const router = useRouter()

  const { preAwardTimeTravelPool, postAwardTimeTravelPool, prize } = props

  const prizeNumber = router.query?.prizeNumber
  const poolName = postAwardTimeTravelPool?.name
  const poolSymbol = postAwardTimeTravelPool?.symbol

  const ticker = postAwardTimeTravelPool?.underlyingCollateralSymbol
  const decimals = postAwardTimeTravelPool?.underlyingCollateralDecimals || 18

  const ticketSupply =
    preAwardTimeTravelPool?.ticketSupply && bn(preAwardTimeTravelPool?.ticketSupply)

  const externalAwardsValueUSD = preAwardTimeTravelPool?.externalAwardsUSD
  const hasLootBox = externalAwardsValueUSD

  return (
    <>
      <Meta title={poolName && prizeNumber && `${t('prize')} #${prizeNumber} - ${poolName}`} />

      <PageTitleAndBreadcrumbs
        title={t('prizes')}
        pool={postAwardTimeTravelPool}
        breadcrumbs={[
          {
            href: '/',
            as: '/',
            name: t('pools')
          },
          {
            href: '/pools/[symbol]',
            as: `/pools/${poolSymbol}`,
            name: poolName
          },
          {
            href: '/prizes/[symbol]',
            as: `/prizes/${poolSymbol}`,
            name: t('prizes')
          },
          {
            name: `${t('prize')} #${prizeNumber}`
          }
        ]}
      />

      <div className='rounded-lg px-4 xs:px-6 sm:px-10 py-4 text-white my-4 sm:mt-8 sm:mb-4 mx-auto border-flashy purple-pink-gradient-animation'>
        <h1>
          {preAwardTimeTravelPool?.totalPrizeAmountUSD &&
            `$${numberWithCommas(preAwardTimeTravelPool?.totalPrizeAmountUSD)}`}
        </h1>
      </div>

      <PrizeBreakdown
        prizeNumber={prizeNumber}
        prize={prize}
        preAwardTimeTravelPool={preAwardTimeTravelPool}
      />

      <LootBoxTable
        historical
        pool={preAwardTimeTravelPool}
        basePath={`/prizes/${poolSymbol}/${prizeNumber}`}
      />

      <CardGrid
        cardGroupId='prize-cards'
        cards={[
          {
            noMinHeight: true,
            icon: TicketsIcon,
            title: t('depositedAmount'),
            content: (
              <h3>
                {numberWithCommas(ticketSupply, { decimals })} {ticker}
              </h3>
            )
          }
        ]}
      />

      <PrizePlayersQuery
        pool={postAwardTimeTravelPool}
        blockNumber={postAwardTimeTravelPool.blockNumber}
      >
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
              baseAsPath={`/prizes/${poolSymbol}/${prizeNumber}`}
              baseHref='/prizes/[symbol]/[prizeNumber]'
              isFetched={isFetched}
              balances={data}
              pool={postAwardTimeTravelPool}
              prize={prize}
            />
          )
        }}
      </PrizePlayersQuery>

      <Tagline />
    </>
  )
}
