import { useContext, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { useInterval } from 'beautiful-react-hooks'

import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { useEthereumErc20Query } from 'lib/hooks/useEthereumErc20Query'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { useEthereumGenericQuery } from 'lib/hooks/useEthereumGenericQuery'

const debug = require('debug')('pool-app:ChainQueries')

export function ChainQueries(props) {
  const {
    children,
    provider,
    poolData,
  } = props
  
  const { disconnectWallet } = useContext(WalletContext)
  const [reloadTimer, setReloadTimer] = useState(null)
  
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

  const {
    status: externalErc20ChainStatus,
    data: externalErc20ChainData,
    error: externalErc20ChainError,
    isFetching: externalErc20IsFetching
  } = useEthereumErc20Query({
    provider,
    graphErc20Awards: graphExternalErc20Awards,
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



  // Forget wallet and reload -  this typically happens when the Apollo Graph URI is out of sync with Onboard JS's chainId
  useInterval(() => {
    if (poolData.daiPool === null || !poolData.daiPool?.currentState) {
      if (reloadTimer) {
        disconnectWallet()
        window.location.reload()
      } else {
        setReloadTimer(1)
      }
    } else {
      setReloadTimer(null)
    }
  }, 3000)
  
  return children({ 
    genericChainData,
  })
}
