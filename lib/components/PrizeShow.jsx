import React, { useContext } from 'react'
import FeatherIcon from 'feather-icons-react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { Meta } from 'lib/components/Meta'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { prizeQuery } from 'lib/queries/prizeQuery'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { formatDate } from 'lib/utils/formatDate'

import TicketsIcon from 'assets/images/icon-ticket@2x.png'
import PlayersIcon from 'assets/images/players@2x.png'

export const PrizeShow = (
  props,
) => {
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
  const prizeStrategyAddress = pool?.prizeStrategyAddress

  const prizeId = `${prizeStrategyAddress}-${prizeNumber}`
  const { loading, error, data } = useQuery(prizeQuery, {
    variables: {
      prizeId
    },
    skip: !prizeStrategyAddress || !prizeNumber || isCurrentPrize,
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
      net: displayAmountInEther(
        pool?.estimatePrize || 0,
        { decimals }
      )
    }
  }

  if (prize === null) {
    return <div
      className='mt-10'
    >
      Couldn't find prize
    </div>
  }

  if (!prize) {
    return <div
      className='mt-10'
    >
      <IndexUILoader />
    </div>
  }

  return <>
    {pool?.name && <>
      <Meta title={`${pool?.name} Prize #${prizeNumber}`} />
    </>}

    <ButtonLink
      text='green'
      border='green'
      hoverBorder='green'
      href='/prizes/[symbol]'
      as={`/prizes/${pool?.symbol}`}
    >
      <FeatherIcon
        icon='arrow-left'
        className='stroke-current w-5 h-5 inline-block relative'
        style={{
          top: -2
        }}
      /> Back to prizes
    </ButtonLink>

    <div
      className='bg-highlight-3 rounded-lg px-6 pt-4 pb-6 text-white mt-4 sm:mt-10'
    >
      <div
        className='flex justify-between'
      >
        <div
          className='w-full sm:w-1/2'
        >
          <h2>
            Prize #{prizeNumber}
          </h2>
          
          {prize?.awardedTimestamp && <>
            <h6
              className='mt-3'
            >
              Awarded on:
            </h6>
            <div
              className='text-caption uppercase'
            >
              {formatDate(
                prize?.awardedTimestamp,
                {
                  short: true
                }
              )}
            </div>
          </>}
        </div>

        <div
          className='w-full sm:w-1/2'
        >
          <h2>
            <PoolCurrencyIcon
              pool={pool}
              className='inline-block mx-auto'
            /> ${displayAmountInEther(
                  prize?.net || 0,
                  { decimals, precision: 0 }
                )} {pool?.underlyingCollateralSymbol?.toUpperCase()}
            {/* <br />{prize?.gross} gross
            <br />{prize?.net} net */}
          </h2>
        </div>
      </div>

      <div
        className='w-full sm:w-1/2 mt-3 sm:mt-6'
      >
        <h6>
          Winner:
        </h6>
        <div
          className='text-caption uppercase'
        >
          winner goes here after we fix the subgraph
        </div>
      </div>
    </div>

    <div
      className='flex flex-col sm:flex-row'
    >
      <div
        className='w-full sm:w-1/2 mt-2 sm:mt-10 px-6 py-4 rounded-lg bg-card sm:mr-8 shadow-md'
      >
        <div
          className='text-caption uppercase'
        >
          <img
            src={PlayersIcon}
            className='inline-block mr-2 card-icon'
          /> Players
        </div>
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
      </div>

      <div
        className='w-full sm:w-1/2 mt-2 sm:mt-10 px-6 py-4 rounded-lg bg-card sm:ml-8 shadow-md'
      >
        <div
          className='text-caption uppercase'
        >
          <img
            src={TicketsIcon}
            className='inline-block mr-2 card-icon'
          /> Tickets sold
        </div>
        <h3>
          <TimeTravelPool
            pool={pool}
            prize={prize}
          >
            {(timeTravelPool) => {
              return timeTravelPool?.totalSupply ?
                displayAmountInEther(
                  timeTravelPool.totalSupply,
                  { decimals, precision: 0 }
                ) : null
            }}
          </TimeTravelPool>
        </h3>
      </div>
    </div>  
      

    <h4
      className='mt-16'
    >
      Players
    </h4>
    
    {/*  <br />{prize?.winners} winners */}

    <PrizePlayerListing
      pool={pool}
      prize={prize}
    />

  </>
}
