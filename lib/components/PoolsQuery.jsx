import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { usePoolsQuery } from 'lib/hooks/usePoolsQuery'

export function PoolsQuery(props) {
  const {
    blockNumber,
    children,
  } = props

  const { chainId } = useContext(AuthControllerContext)
  const { poolAddresses } = useContext(PoolDataContext)

  const { status, data, error, isFetching } = usePoolsQuery(chainId, poolAddresses, blockNumber)

  if (error) {
    console.warn(error)
  }

  return children(data)
}
