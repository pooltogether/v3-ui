import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'

export function UniswapData(props) {
  const {
    blockNumber,
    children,
    poolAddress,
    addresses,
  } = props

  const { chainId } = useContext(AuthControllerContext)
  
  const { status, data, error, isFetching } = useUniswapTokensQuery(chainId, poolAddress, blockNumber, addresses)

  if (error) {
    console.warn(error)
  }

  return children({ 
    data
  })

}
