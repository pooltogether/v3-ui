import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'

export function UniswapData(props) {
  let blockNumber = props.blockNumber || -1

  const {
    children,
    poolAddress,
    addresses,
  } = props

  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { status, data, error, isFetching } = useUniswapTokensQuery(
    pauseQueries,
    chainId,
    poolAddress,
    blockNumber,
    addresses
  )

  if (error) {
    console.warn(error)
  }

  return children({ 
    data
  })

}
