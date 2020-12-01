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

  const { chainId } = useContext(AuthControllerContext)

  const { status, data, error, isFetching } = useUniswapTokensQuery(
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
