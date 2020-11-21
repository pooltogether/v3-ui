import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useTimeTravelPoolQuery } from 'lib/hooks/useTimeTravelPoolQuery'

export function TimeTravelPoolQuery(props) {
  const {
    blockNumber,
    children,
    poolAddress,
  } = props

  const { chainId } = useContext(AuthControllerContext)

  const { status, data, error, isFetching } = useTimeTravelPoolQuery(chainId, poolAddress, blockNumber)

  if (error) {
    console.warn(error)
  }

  return children(data)
}
