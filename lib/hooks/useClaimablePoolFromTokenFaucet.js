import { useClaimablePoolFromTokenFaucets } from 'lib/hooks/useClaimablePoolFromTokenFaucets'

export const useClaimablePoolFromTokenFaucet = (tokenFaucetAddress, usersAddress) => {
  const {
    data,
    ...remainingUseClaimablePoolFromTokenFaucetsResult
  } = useClaimablePoolFromTokenFaucets(usersAddress)

  return {
    ...remainingUseClaimablePoolFromTokenFaucetsResult,
    data: data?.[tokenFaucetAddress]
  }
}
