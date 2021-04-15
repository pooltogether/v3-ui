import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useUsersChainQuery } from 'lib/hooks/useUsersChainQuery'
import { useReadProvider } from 'lib/hooks/useReadProvider'

export function useUsersChainData(prizePoolAddress, tokenAddress) {
  const { usersAddress } = useContext(AuthControllerContext)
  const { readProvider } = useReadProvider()

  return useUsersChainQuery({
    provider: readProvider,
    usersAddress,
    prizePoolAddress,
    tokenAddress
  })
}
