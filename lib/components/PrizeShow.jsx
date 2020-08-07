import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { Meta } from 'lib/components/Meta'
import { PrizesPageHeader } from 'lib/components/PrizesPageHeader'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { prizeQuery } from 'lib/queries/prizeQuery'

export const PrizeShow = (
  props,
) => {
  const router = useRouter()
  const prizeNumber = router.query?.prizeNumber

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData
  
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
  const decimals = pool?.underlyingCollateralDecimals || 18
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

    <PrizesPageHeader
      showPoolLink
      pool={pool}
    />
    
{/* 
    <br />Prize:
    <br />{prize?.awardedTimestamp} awardedTimestamp
    <br />{prize?.id} id
    <br />{prize?.gross} gross
    <br />{prize?.net} net
    <br />{prize?.awardedBlock} awardedBlock
    <br />{prize?.prizePeriodStartedTimestamp} prizePeriodStartedTimestamp
    <br />{prize?.winners} winners */}

    <PrizePlayerListing
      pool={pool}
      prize={prize}
    />

  </>
}
