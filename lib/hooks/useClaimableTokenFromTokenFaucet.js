import { useClaimableTokenFromTokenFaucets } from 'lib/hooks/useClaimableTokenFromTokenFaucets'

export const useClaimableTokenFromTokenFaucet = (tokenFaucetAddress, usersAddress) => {
  const { data, ...useClaimableTokenFromTokenFaucetsResult } = useClaimableTokenFromTokenFaucets(
    usersAddress
  )

  return {
    ...useClaimableTokenFromTokenFaucetsResult,
    data: data?.[tokenFaucetAddress]
  }
}
