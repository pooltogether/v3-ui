import { useContext } from 'react'
import { useQueryCache } from 'react-query'

import { POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { TimeTravelPoolQuery } from 'lib/components/TimeTravelPoolQuery'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { compileHistoricalPool } from 'lib/services/compileHistoricalPool'

export function TimeTravelPool(props){
  const {
    children,
    blockNumber,
    poolAddress,
    prize,
    querySymbol
  } = props

  const queryCache = useQueryCache()
  
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  const { defaultReadProvider } = useContext(PoolDataContext)

  const graphExternalErc721Awards = prize?.awardedExternalErc721Nfts

  const {
    status: externalErc721ChainStatus,
    data: externalErc721ChainData,
    error: externalErc721ChainError,
    isFetching: externalErc721IsFetching
  } = useEthereumErc721Query({
    pauseQueries,
    blockNumber,
    provider: defaultReadProvider,
    graphErc721Awards: graphExternalErc721Awards,
    poolAddress,
  })

  if (externalErc721ChainError) {
    console.warn(externalErc721ChainError)
  }



  return <TimeTravelPoolQuery
    poolAddress={poolAddress}
    blockNumber={blockNumber}
  >
    {(graphPools) => {

      const graphPool = graphPools?.find(_graphPool => _graphPool.id === poolAddress)
      // const addresses = graphPool?.prizeStrategy?.singleRandomWinner?.externalErc20Awards?.map(award => award.address)
      
      const poolInfo = POOLS.find(POOL => POOL.symbol === querySymbol)
      const timeTravelPool = compileHistoricalPool(
        chainId,
        poolInfo,
        queryCache,
        graphPool,
        poolAddress,
        blockNumber,
        prize
      )

      return children(timeTravelPool)
    }}
  </TimeTravelPoolQuery>
   
}
