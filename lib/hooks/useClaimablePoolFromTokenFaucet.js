import { useClaimablePoolFromTokenFaucets } from 'lib/hooks/useClaimablePoolFromTokenFaucets'

export const useClaimablePoolFromTokenFaucet = (tokenFaucetAddress) => {
  const {
    data,
    ...remainingUseClaimablePoolFromTokenFaucetsResult
  } = useClaimablePoolFromTokenFaucets()

  return {
    ...remainingUseClaimablePoolFromTokenFaucetsResult,
    data: data?.[tokenFaucetAddress]
  }
}
