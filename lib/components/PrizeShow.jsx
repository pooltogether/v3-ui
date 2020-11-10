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
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { PrizeFromInterestCard } from 'lib/components/PrizeFromInterestCard'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { formatDate } from 'lib/utils/formatDate'

import TicketsIcon from 'assets/images/icon-ticket@2x.png'
import PlayersIcon from 'assets/images/players@2x.png'

export function PrizeShow(props) {
  const { t } = useTranslation()
  const router = useRouter()

  const {
    externalErc20ChainData,
    externalErc721ChainData,
    externalErc721GraphData,
    pool,
    prize
  } = props

  const prizeNumber = router.query?.prizeNumber

  const decimals = pool?.underlyingCollateralDecimals || 18

  const isCurrentPrize = Number(pool?.prizesCount) + 1 === Number(prizeNumber)



  let prizeAmountOrEstimate = pool?.prizeEstimate
  if (prize?.awardedTimestamp) {
    prizeAmountOrEstimate = prize?.amount || 0
  }

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
        'bg-highlight-3 rounded-lg px-6 pt-4 pb-6 text-white my-10 sm:mt-10',
        {
          'border-flashy': isCurrentPrize
        }
      )}
    >
      <div
        className='flex flex-col sm:flex-row justify-between'
      >
        <div
          className='w-full sm:w-5/12'
        >
          <h2>
            {t('prize')} #{prizeNumber}
          </h2>
          
          {prize?.awardedTimestamp ? <>
            <h6
              className='mt-4'
            >
              {t('awardedOn')}
            </h6>
            <div
              className='uppercase font-bold text-sm xs:text-base sm:text-lg text-accent-1'
            >
              {formatDate(
                prize?.awardedTimestamp,
                {
                  short: true
                }
              )}
            </div>
          </> : <>
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
          </>}
        </div>

        <div
          className='w-full sm:w-7/12 mt-2 sm:mt-0'
        >
          <h2>
            <PoolCurrencyIcon
              pool={pool}
              className='inline-block mx-auto -mt-1'
            /> ${displayAmountInEther(
                prizeAmountOrEstimate,
                { precision: 2, decimals }
              )} {pool?.underlyingCollateralSymbol?.toUpperCase()}
          </h2>

          <h6
            className='mt-4'
          >
            {t('winner')}:
          </h6>

          {prize?.awardedTimestamp ? <>
            <PrizeWinner
              prize={prize}
              winnersAddress={winnersAddress}
            />
          </> : <>
            <span
              className='block font-bold text-caption uppercase mt-2'
            >
              {t('yetToBeAwarded')}
            </span>
          </>}

          
        </div>
      </div>
    </div>

    <PrizeFromInterestCard
      decimals={decimals}
      interestPrize={prizeAmountOrEstimate}
    />

    <Erc20AwardsTable
      hideContributeUI
      basePath={`/prizes/${pool?.symbol}/${prizeNumber}`}
      externalErc20ChainData={externalErc20ChainData}
    />

    <Erc721AwardsTable
      basePath={`/prizes/${pool?.symbol}/${prizeNumber}`}
      externalErc721ChainData={externalErc721ChainData}
      externalErc721GraphData={externalErc721GraphData}
    />

    <CardGrid
      cardGroupId='prize-cards'
      cards={[
        {
          icon: PlayersIcon,
          title: t('players'),
          content: <>
            <h3>
              <TimeTravelPool
                pool={pool}
                prize={prize}
              >
                {(timeTravelPool) => {
                  return timeTravelPool?.playerCount || null
                }}
              </TimeTravelPool>
            </h3>
          </>
        },
        {
          icon: TicketsIcon,
          title: t('ticketsSold'),
          content: <>
            <h3>
              <TimeTravelPool
                pool={pool}
                prize={prize}
              >
                {(timeTravelPool) => {
                  return timeTravelPool?.ticketSupply ?
                    displayAmountInEther(
                      timeTravelPool.ticketSupply,
                      { decimals, precision: 0 }
                    ) : null
                }}
              </TimeTravelPool>
            </h3>
          </>
        }
      ]}
    />

      

    <h4
      className='mt-16'
    >
      {t('players')}
    </h4>

    <PrizePlayerListing
      pool={pool}
      prize={prize}
    />

    {/* <AllPoolsTotalAwarded /> */}

    <div
      className='text-inverse mt-12 pb-40 text-center'
    ></div>
  </>
}
