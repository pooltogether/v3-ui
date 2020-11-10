import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'

export function UniswapData(props) {
  const {
    blockNumber,
    children,
    poolData,
  } = props

  const { chainId } = useContext(AuthControllerContext)

  const { status, data, error, isFetching } = useUniswapTokensQuery(chainId, poolData, blockNumber)

  if (error) {
    console.warn(error)
  }

  return children({ 
    data
  })

}
