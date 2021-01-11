import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { CardGrid } from 'lib/components/CardGrid'
import { LootBoxTable } from 'lib/components/LootBoxTable'
import { Meta } from 'lib/components/Meta'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PrizeBreakdown } from 'lib/components/PrizeBreakdown'
import { PrizePlayersQuery } from 'lib/components/PrizePlayersQuery'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import TicketsIcon from 'assets/images/icon-ticket@2x.png'

export function PrizeShow(props) {
  const { t } = useTranslation()
  const router = useRouter()

  const {
    pool,
    prize
  } = props

  const prizeNumber = router.query?.prizeNumber

  const decimals = pool?.underlyingCollateralDecimals || 18

  const blockNumber = pool.blockNumber

  return <>
    <Meta title={pool?.name && prizeNumber && `${t('prize')} #${prizeNumber} - ${pool?.name}`} />

    <PageTitleAndBreadcrumbs
      title={t('prizes')}
      pool={pool}
      breadcrumbs={[
        {
          href: '/',
          as: '/',
          name: t('pools'),
        },
        {
          href: '/pools/[symbol]',
          as: `/pools/${pool?.symbol}`,
          name: pool?.name,
        },
        {
          href: '/prizes/[symbol]',
          as: `/prizes/${pool?.symbol}`,
          name: t('prizes'),
        },
        {
          name: `${t('prize')} #${prizeNumber}`,
        }
      ]}
    />

    <div
      className='purple-pink-gradient rounded-lg px-4 xs:px-6 sm:px-10 py-4 text-white my-4 sm:mt-8 sm:mb-4 mx-auto'
    >
      <div>
        <h1>
          {pool?.totalPrizeAmountUSD && `$${numberWithCommas(pool?.totalPrizeAmountUSD)}`}
        </h1>
      </div>

      {!prize?.awardedTimestamp && <>
        <div>
          <h6
            className={classnames(
              'mt-4',
              {
                'mb-3': !pool?.isRngRequested
              }
            )}
          >
            {t('willBeAwardedIn')}
          </h6>
          <NewPrizeCountdown
            textAlign='left'
            textSize='text-xs xs:text-sm sm:text-lg lg:text-xl'
            pool={pool}
            flashy
          />
        </div>
      </>}
    </div>


    <PrizeBreakdown
      prizeNumber={prizeNumber}
      decimals={decimals}
      interestPrize={pool?.interestPrizeUSD}
      externalAwardsValue={pool?.externalAwardsUSD}
      prize={prize}
      pool={pool}
    />

    <LootBoxTable
      historical
      pool={pool}
      basePath={`/prizes/${pool?.symbol}/${prizeNumber}`}
    />

    <CardGrid
      cardGroupId='prize-cards'
      cards={[
        {
          icon: TicketsIcon,
          title: t('totalTickets'),
          content: <>
            <h3>
              {pool?.ticketSupply ?
                displayAmountInEther(
                  pool.ticketSupply,
                  { decimals, precision: 0 }
                ) : null
              }
            </h3>
          </>
        }
      ]}
    />

    <PrizePlayersQuery
      pool={pool}
      blockNumber={blockNumber}
    >
      {({ data, isFetching, isFetched }) => {
        if (!prize && prize !== null) {
          return <div className='mt-10'>
            <IndexUILoader />
          </div>
        }

        return <PrizePlayerListing
          baseAsPath={`/prizes/${pool?.symbol}/${prizeNumber}`}
          baseHref='/prizes/[symbol]/[prizeNumber]'
          isFetching={isFetching}
          isFetched={isFetched}
          balances={data}
          pool={pool}
          prize={prize}
        />
      }}
    </PrizePlayersQuery>

    <div
      className='text-inverse mt-12 pb-40 text-center'
    >
      {/* <AllPoolsTotalAwarded /> */}
    </div>
  </>
}
