import { CONTRACT_ADDRESSES } from 'lib/constants'

export const poolTokenSupportsPermitSign = (chainId, token) => {
  return CONTRACT_ADDRESSES[chainId]?.Dai?.toLowerCase === token?.toLowerCase
}
