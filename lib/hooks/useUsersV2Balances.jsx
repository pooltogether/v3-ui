import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { useUsersV2Query } from 'lib/hooks/useUsersV2Query'
import { useReadProvider } from 'lib/hooks/useReadProvider'

export function useUsersV2Balances(usersAddress) {
  const { readProvider } = useReadProvider()

  const { contractAddresses } = useContractAddresses()

  const { data: usersV2Balances, error: usersChainError } = useUsersV2Query({
    provider: readProvider,
    usersAddress,
    contractAddresses
  })

  if (usersChainError) {
    console.error(usersChainError)
  }

  return { usersV2Balances }
}
