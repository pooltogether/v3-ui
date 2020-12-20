import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePools } from 'lib/hooks/usePools'
import { useUsersV2Query } from 'lib/hooks/useUsersV2Query'
import { useReadProvider } from 'lib/hooks/useReadProvider'

export function useUsersV2Data() {
  const { usersAddress } = useContext(AuthControllerContext)

  const { readProvider } = useReadProvider()

  const { contractAddresses } = usePools()

  const {
    data: usersChainData,
    error: usersChainError,
  } = useUsersV2Query({
    provider: readProvider,
    usersAddress,
    contractAddresses,
  })

  if (usersChainError) {
    console.error(usersChainError)
  }
  
  return { usersChainData }
}
