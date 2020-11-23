import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { CardGrid } from 'lib/components/CardGrid'
import { Erc20AwardsTable } from 'lib/components/Erc20AwardsTable'
import { Erc721AwardsTable } from 'lib/components/Erc721AwardsTable'
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

  const winnersAddress = prize?.winners?.[0]
  
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
        'purple-pink-gradient rounded-lg px-4 xs:px-6 sm:px-10 pt-4 pb-6 text-white my-4 sm:mt-8 sm:mb-12 mx-auto',
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
      <h6
        className='mt-4'
      >
        {t('awardedOn')}: {formatDate(prize?.awardedTimestamp)}
      </h6>
    </>}




    {prize?.awardedTimestamp && <>
      <div
        className='mt-2 xs:mt-0'
      >
        <span
          className='mt-4 text-sm'
        >
          {t('winner')}: <PrizeWinner
            pool={pool}
            prize={prize}
            winnersAddress={winnersAddress}
          />
        </span>
      </div>
    </>}
    


    <PrizeBreakdown
      decimals={decimals}
      interestPrize={pool?.interestPrizeUSD}
      externalAwardsValue={pool?.externalAwardsUSD}
    />

    <Erc20AwardsTable
      historical={!!prize?.awardedBlock}
      pool={pool}
      basePath={`/prizes/${pool?.symbol}/${prizeNumber}`}
      externalErc20Awards={pool?.externalErc20Awards}
    />

    <Erc721AwardsTable
      historical={!!prize?.awardedBlock}
      basePath={`/prizes/${pool?.symbol}/${prizeNumber}`}
      externalErc721Awards={pool?.externalErc721Awards}
      ethErc721Awards={pool?.ethErc721Awards}
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
