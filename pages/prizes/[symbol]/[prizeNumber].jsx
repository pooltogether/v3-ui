import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useTimeTravelUniswapTokensQuery } from 'lib/hooks/useTimeTravelUniswapTokensQuery'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { PrizeShow } from 'lib/components/PrizeShow'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
// import { useEthereumErc20Query } from 'lib/hooks/useEthereumErc20Query'
// import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { externalAwardsQuery } from 'lib/queries/externalAwardsQuery'
import { prizeQuery } from 'lib/queries/prizeQuery'
import { getExternalAwardsDataFromQueryResult } from 'lib/services/getExternalAwardsDataFromQueryResult'

export default function PrizeShowPage(props) {
  const { t } = useTranslation()
  const router = useRouter()

  const prizeNumber = router.query?.prizeNumber

  const { paused } = useContext(GeneralContext)
  const { coingeckoData, defaultReadProvider, pool, poolAddresses } = useContext(PoolDataContext)

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

  let prize = data?.prize








  const externalAwardsQuery = externalAwardsQuery(prize?.awardedBlock)
  const {
    loading: timeTravelExternalAwardsLoading,
    error: timeTravelExternalAwardsError,
    data: timeTravelExternalAwardsData,
  } = useQuery(externalAwardsQuery, {
    variables: {
      prizeStrategyAddress: pool?.prizeStrategyAddress
    },
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
    skip: !prize?.awardedBlock || !pool?.prizeStrategyAddress
  })

  if (timeTravelExternalAwardsError) {
    poolToast.error(timeTravelExternalAwardsError)
    console.error(timeTravelExternalAwardsError)
  }

  // TODO: We shouldn't need this, we should be able to just get the external awards for a particular prize strategy
  const compiledExternalAwardsData = getExternalAwardsDataFromQueryResult(poolAddresses, timeTravelExternalAwardsData)

  const externalErc20GraphData = compiledExternalAwardsData?.daiPool?.externalErc20Awards
  const externalErc721GraphData = compiledExternalAwardsData?.daiPool?.externalErc721Awards


  const {
    status: timeTravelUniswapTokensStatus,
    data: timeTravelUniswapTokensData,
    error: timeTravelUniswapTokensError,
    isFetching: timeTravelUniswapTokensFetching
  } = useTimeTravelUniswapTokensQuery(compiledExternalAwardsData, prize?.awardedBlock)

  if (error) {
    console.warn(error)
  }

  console.log(timeTravelUniswapTokensData)






  // console.log(externalErc20GraphData)
  // const {
  //   status: externalErc20ChainStatus,
  //   data: externalErc20ChainData,
  //   error: externalErc20ChainError,
  //   isFetching: externalErc20IsFetching
  // } = useEthereumErc20Query({
  //   blockNumber: prize?.awardedBlock,
  //   provider: defaultReadProvider,
  //   graphErc20Awards: externalErc20GraphData,
  //   coingeckoData, // replace coingecko with uniswap data!
  //   poolAddress,
  // })

  // if (externalErc20ChainError) {
  //   console.warn(externalErc20ChainError)
  // }
  // console.log(externalErc20ChainData)



  // const {
  //   status: externalErc721ChainStatus,
  //   data: externalErc721ChainData,
  //   error: externalErc721ChainError,
  //   isFetching: externalErc721IsFetching
  // } = useEthereumErc721Query({
  //   blockNumber: prize?.awardedBlock,
  //   provider: defaultReadProvider,
  //   graphErc721Awards: externalErc721GraphData,
  //   poolAddress,
  // })

  // if (externalErc721ChainError) {
  //   console.warn(externalErc721ChainError)
  // }





  if (pool === null) {
    const querySymbol = router.query?.symbol
    return <BlankStateMessage>
      Could not find pool with symbol: ${querySymbol}
    </BlankStateMessage>
  }


  if (error) {
    console.error(error)
  }



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




  return <PrizeShow
    externalErc20ChainData={externalErc20ChainData}
    externalErc721ChainData={externalErc721ChainData}
    externalErc721GraphData={externalErc721GraphData}
    pool={pool}
    prize={prize}
  />
}
