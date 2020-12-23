import { useContext } from 'react'
import { useQueryCache } from 'react-query'

import { POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { usePoolsQuery } from 'lib/hooks/usePoolsQuery'
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
  
  const { chainId } = useContext(AuthControllerContext)
  const { readProvider } = useReadProvider()

  const graphExternalErc721Awards = prize?.awardedExternalErc721Nfts

  // this is being used in the compileHistoricalPool method with a direct query cache read!
  const {
    status: externalErc721ChainStatus,
    data: externalErc721ChainData,
    error: externalErc721ChainError,
    isFetching: externalErc721IsFetching
  } = useEthereumErc721Query({
    blockNumber,
    provider: readProvider,
    graphErc721Awards: graphExternalErc721Awards,
    poolAddress,
  })

  if (externalErc721ChainError) {
    console.warn(externalErc721ChainError)
  }


  const { data: graphPools, error } = usePoolsQuery([poolAddress], blockNumber)

  if (error) {
    console.warn(error)
  }


  const graphPool = graphPools?.find(_graphPool => _graphPool.id === poolAddress)
  
  const poolInfo = POOLS[chainId]?.find(POOL => POOL.symbol === querySymbol)
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
}
