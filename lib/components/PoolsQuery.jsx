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
  const { contractAddresses } = useContext(PoolDataContext)

  const { status, data, error, isFetching } = usePoolsQuery(chainId, contractAddresses.pools, blockNumber)

  if (error) {
    console.warn(error)
  }

  return children(data)
}
