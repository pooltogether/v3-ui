import { useContext, useEffect, useState } from 'react'

import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { useEthereumErc20Query } from 'lib/hooks/useEthereumErc20Query'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { useEthereumGenericQuery } from 'lib/hooks/useEthereumGenericQuery'

const debug = require('debug')('pool-app:FetchGenericChainData')

export function ChainDataQueries(props) {
  const {
    children,
    coingeckoData,
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
    poolData: poolData.daiPool
  })

  if (genericChainError) {
    console.warn(genericChainError)
  }





  const graphExternalErc20Awards = dynamicExternalAwardsData?.daiPool?.externalErc20Awards
  const poolAddress = poolData.daiPool.poolAddress

  const {
    status: external20ChainStatus,
    data: external20ChainData,
    error: external20ChainError,
    isFetching: external20IsFetching
  } = useEthereumErc20Query({
    provider,
    graphErc20Awards: graphExternalErc20Awards,
    coingeckoData,
    poolAddress,
  })

  if (external20ChainError) {
    console.warn(external20ChainError)
  }




  const graphExternalErc721Awards = dynamicExternalAwardsData?.daiPool?.externalErc721Awards

  const {
    status: external721ChainStatus,
    data: external721ChainData,
    error: external721ChainError,
    isFetching: external721IsFetching
  } = useEthereumErc721Query({
    provider,
    graphErc721Awards: graphExternalErc721Awards,
    poolAddress,
  })

  if (external721ChainError) {
    console.warn(external721ChainError)
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
