import { useClaimableTokenFromTokenFaucets } from 'lib/hooks/useClaimableTokenFromTokenFaucets'

export const useClaimableTokenFromTokenFaucet = (chainId, tokenFaucetAddress, usersAddress) => {
  const { data, ...remainingResult } = useClaimableTokenFromTokenFaucets(chainId, usersAddress)

  // console.log(data)
  if (remainingResult.error) {
    remainingResult.error
  }

  console.log(tokenFaucetAddress)
  console.warn(data)
  console.warn(remainingResult)

  return {
    ...remainingResult,
    data: data?.[tokenFaucetAddress]
  }
}
