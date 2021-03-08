import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useUsersChainQuery } from 'lib/hooks/useUsersChainQuery'
import { useReadProvider } from 'lib/hooks/useReadProvider'

export function useUsersChainData(pool) {
  const { usersAddress } = useContext(AuthControllerContext)

  const { readProvider } = useReadProvider()

  const { data: usersChainData, error: usersChainError } = useUsersChainQuery({
    provider: readProvider,
    pool,
    usersAddress
  })

  if (usersChainError) {
    console.error(usersChainError)
  }

  return { usersChainData }
}
