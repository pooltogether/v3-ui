import React, { useContext } from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { AllPoolsTotalAwarded } from 'lib/components/AllPoolsTotalAwarded'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { CardGrid } from 'lib/components/CardGrid'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
import { Meta } from 'lib/components/Meta'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { prizeQuery } from 'lib/queries/prizeQuery'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { formatDate } from 'lib/utils/formatDate'
import { shorten } from 'lib/utils/shorten'

import TicketsIcon from 'assets/images/icon-ticket@2x.png'
import PlayersIcon from 'assets/images/players@2x.png'

export const PrizeShow = (
  props,
) => {
  const { t } = useTranslation()
  const router = useRouter()

  const prizeNumber = router.query?.prizeNumber

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const decimals = pool?.underlyingCollateralDecimals || 18

  if (pool === null) {
    const querySymbol = router.query?.symbol
    return <BlankStateMessage>
      Could not find pool with symbol: ${querySymbol}
    </BlankStateMessage>
  }

  const isCurrentPrize = Number(pool?.prizesCount) + 1 === Number(prizeNumber)
  const poolAddress = pool?.poolAddress

  const prizeId = `${poolAddress}-${prizeNumber}`
  const { loading, error, data } = useQuery(prizeQuery, {
    variables: {
      prizeId
    },
    skip: !poolAddress || !prizeNumber || isCurrentPrize,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  

  let prize = data?.prize
  if (isCurrentPrize) {
    prize = {
      awardedBlock: null,
      net: pool?.prizeEstimate
    }
  }

  if (prize === null) {
    return <div
      className='mt-10'
    >
      {t('couldntFindPrize')}
    </div>
  }

  if (!prize) {
    return <div
      className='mt-10'
    >
      <TableRowUILoader
        rows={5}
      />
    </div>
  }

  const winnerAddress = prize?.winners?.[0]

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
          className='w-full sm:w-1/3'
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
              className='text-caption uppercase font-bold text-sm xs:text-base sm:text-lg'
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
          className='w-full sm:w-2/3 mt-8 sm:mt-0'
        >
          <h2>
            <PoolCurrencyIcon
              pool={pool}
              className='inline-block mx-auto -mt-1'
            /> ${displayAmountInEther(
                prize?.amount || 0,
                { precision: 2, decimals }
              )} {pool?.underlyingCollateralSymbol?.toUpperCase()}
          </h2>

          <h6
            className='mt-4'
          >
            {t('winner')}:
          </h6>
          {prize?.awardedTimestamp ? <>
            
            <Link
              href='/players/[playerAddress]'
              as={`/players/${winnerAddress}`}
            >
              <a
                className='block font-bold text-sm xs:text-base sm:text-lg text-green hover:text-white'
              >
                <div className='block lg:hidden'>
                  {shorten(winnerAddress)}
                </div>
                <div className='hidden lg:block'>
                  {winnerAddress}
                </div>
              </a>
            </Link>
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

    <AllPoolsTotalAwarded />
  </>
}
