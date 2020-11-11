import { useContext, useEffect, useState } from 'react'

import {
  QUERY_KEYS,
} from 'lib/constants'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { useEthereumErc20Query } from 'lib/hooks/useEthereumErc20Query'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { useEthereumGenericQuery } from 'lib/hooks/useEthereumGenericQuery'

const debug = require('debug')('pool-app:FetchGenericChainData')

export function ChainQueries(props) {
  const {
    cache,
    children,
    // coingeckoData,
    dynamicExternalAwardsData,
    provider,
    poolData,
  } = props
  
  const { disconnectWallet } = useContext(WalletContext)
  const [retryAttempts, setRetryAttempts] = useState(0)
  
  const {
    status: genericChainStatus,
    data: genericChainData,
    error: genericChainError,
    isFetching: genericIsFetching
  } = useEthereumGenericQuery({
    provider,
    poolData: poolData?.daiPool
  })

  if (genericChainError) {
    console.warn(genericChainError)
  }





  // const graphExternalErc20Awards = dynamicExternalAwardsData?.daiPool?.externalErc20Awards
  const poolAddress = poolData?.daiPool?.poolAddress

  const graphExternalErc20Awards = poolData?.daiPool?.prizeStrategy?.externalErc20Awards

  const uniswapPriceData = cache.getQueryData([QUERY_KEYS.uniswapTokensQuery, poolData?.daiPool?.poolAddress, -1])

  const {
    status: externalErc20ChainStatus,
    data: externalErc20ChainData,
    error: externalErc20ChainError,
    isFetching: externalErc20IsFetching
  } = useEthereumErc20Query({
    provider,
    graphErc20Awards: graphExternalErc20Awards,
    priceData: uniswapPriceData,
    // coingeckoData,
    poolAddress,
  })

  if (externalErc20ChainError) {
    console.warn(externalErc20ChainError)
  }



  const graphExternalErc721Awards = poolData?.daiPool?.prizeStrategy?.externalErc721Awards
  // const graphExternalErc721Awards = dynamicExternalAwardsData?.daiPool?.externalErc721Awards

  const {
    status: externalErc721ChainStatus,
    data: externalErc721ChainData,
    error: externalErc721ChainError,
    isFetching: externalErc721IsFetching
  } = useEthereumErc721Query({
    provider,
    graphErc721Awards: graphExternalErc721Awards,
    poolAddress,
  })

  if (externalErc721ChainError) {
    console.warn(externalErc721ChainError)
  }




  

  useEffect(() => {
    const underlyingCollateralName = poolData?.daiPool?.underlyingCollateralName
    if (!underlyingCollateralName) {
      setRetryAttempts(retryAttempts + 1)
    }
  }, [poolData])

  // Forget wallet and releoad -  this typically happens when the Graph URI is out of sync with Onboard JS's chainId
  useEffect(() => {
    // console.log({ retryAttempts})
    if (retryAttempts > 12) {
      disconnectWallet()
      window.location.reload()
    }
  }, [retryAttempts])
  
  return children({ 
    genericChainData,
  })
}
