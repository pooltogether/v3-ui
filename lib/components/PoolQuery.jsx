import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePoolQuery } from 'lib/hooks/usePoolQuery'

export function PoolQuery(props) {
  const {
    blockNumber,
    children,
    poolAddress,
  } = props

  const { chainId } = useContext(AuthControllerContext)

  const { status, data, error, isFetching } = usePoolQuery(chainId, poolAddress, blockNumber)

  if (error) {
    console.warn(error)
  }

  return children(data)
}
