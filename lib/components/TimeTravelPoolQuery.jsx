import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useTimeTravelPoolQuery } from 'lib/hooks/useTimeTravelPoolQuery'

export function TimeTravelPoolQuery(props) {
  const {
    blockNumber,
    children,
    poolAddress,
  } = props

  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { status, data, error, isFetching } = useTimeTravelPoolQuery(pauseQueries, chainId, poolAddress, blockNumber)

  if (error) {
    console.warn(error)
  }

  return children(data)
}
