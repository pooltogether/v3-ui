import { useClaimableTokenFromTokenFaucets } from 'lib/hooks/useClaimableTokenFromTokenFaucets'

export const useClaimableTokenFromTokenFaucet = (chainId, tokenFaucetAddress, usersAddress) => {
  const { data, ...remainingResult } = useClaimableTokenFromTokenFaucets(chainId, usersAddress)

  if (remainingResult.error) {
    remainingResult.error
  }

  return {
    ...remainingResult,
    data: data?.[tokenFaucetAddress]
  }
}
