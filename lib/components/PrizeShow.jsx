import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { CardGrid } from 'lib/components/CardGrid'
import { TopLevelExternalAwards } from 'lib/components/TopLevelExternalAwards'
import { Meta } from 'lib/components/Meta'
import { PrizeWinner } from 'lib/components/PrizeWinner'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PrizeBreakdown } from 'lib/components/PrizeBreakdown'
import { PrizePlayersQuery } from 'lib/components/PrizePlayersQuery'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { formatDate } from 'lib/utils/formatDate'

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

  const isCurrentPrize = Number(pool?.prizesCount) + 1 === Number(prizeNumber)
  
  return <>
    {pool?.name && <>
      <Meta title={`${t('prize')} #${prizeNumber} - ${pool ? pool?.name : ''}`} />
    </>}

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
      className={classnames(
        'purple-pink-gradient rounded-lg px-4 xs:px-6 sm:px-10 pt-4 pb-6 text-white my-4 sm:mt-8 sm:mb-4 mx-auto',
        {
          'border-flashy': isCurrentPrize
        }
      )}
    >
      <div>
        <h6
          className='mt-4'
        >
          {t('prize')} #{prizeNumber}
        </h6>
        <h1>
          ${displayAmountInEther(
            pool?.prizeAmountUSD || 0,
            { precision: 2, decimals }
          )}
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







    {prize?.awardedTimestamp && <>
      <div
        className='mt-1 xs:mt-0'
      >
        <div className='flex justify-between mb-1 text-xs sm:text-lg font-bold text-accent-3'>
          <div
            className='mt-4'
          >
            {t('winners')}
          </div>

          {prize?.awardedTimestamp && <>
            <div
              className='mt-4'
            >
              {t('awardedOn')}: {formatDate(prize?.awardedTimestamp)}
            </div>
          </>}
        </div>

        <span
          className='mt-4 text-sm'
        >
          <table
            className='w-full'
          >
            <thead>
              <tr>
                <th>
                  {t('grandPrize')}
                </th>
                <th>
                  {t('player')}
                </th>
                <th>
                  {t('odds')}
                </th>
                <th>
                  {t('tickets')}
                </th>
              </tr>
            </thead>
            <tbody>
              {/* prize?.winners */}
              {[
                '0x8f7f92e0660dd92eca1fad5f285c4dca556e433e',
                '0xa5c3a513645a9a00cb561fed40438e9dfe0d6a69',
                '0x7c738364fea236198dc71c88302d633eb6ad31c1'].map((winner, index) => {
                return <PrizeWinner
                  grandPrizeWinner={index === 0}
                  pool={pool}
                  prize={prize}
                  winnersAddress={winner}
                />
              })}
            </tbody>
          </table>
           
        </span>
      </div>
    </>}
    


    <PrizeBreakdown
      decimals={decimals}
      interestPrize={pool?.interestPrizeUSD}
      externalAwardsValue={pool?.externalAwardsUSD}
    />

    <TopLevelExternalAwards
      ethErc721Awards={pool?.ethErc721Awards}
      historical={!!prize?.awardedBlock}
      pool={pool}
      basePath={`/pools/${pool?.symbol}`}
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
      prize={prize}
    >
      {({ data, error, isFetching }) => {
        if (error) {
          return <>
            {error && <>
              There was an issue loading data:
              <br />{error.message}
            </>}
          </>
        }

        return <PrizePlayerListing
          isFetching={isFetching}
          players={data}
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
