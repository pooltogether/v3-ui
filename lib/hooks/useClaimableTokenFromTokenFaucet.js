import { useClaimableTokenFromTokenFaucets } from 'lib/hooks/useClaimableTokenFromTokenFaucets'

export const useClaimableTokenFromTokenFaucet = (chainId, tokenFaucetAddress, usersAddress) => {
  const { data, ...useClaimableTokenFromTokenFaucetsResult } = useClaimableTokenFromTokenFaucets(
    chainId,
    usersAddress
  )

  return {
    ...useClaimableTokenFromTokenFaucetsResult,
    data: data?.[tokenFaucetAddress]
  }
}
