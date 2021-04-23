import { useClaimableTokenFromTokenFaucets } from 'lib/hooks/useClaimableTokenFromTokenFaucets'

export const useClaimableTokenFromTokenFaucet = (tokenFaucetAddress, usersAddress) => {
  const {
    data,
    ...remaininguseClaimableTokenFromTokenFaucetsResult
  } = useClaimableTokenFromTokenFaucets(usersAddress)

  return {
    ...remaininguseClaimableTokenFromTokenFaucetsResult,
    data: data?.[tokenFaucetAddress]
  }
}
