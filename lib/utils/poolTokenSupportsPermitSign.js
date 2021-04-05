import { CUSTOM_CONTRACT_ADDRESSES } from 'lib/constants'

export const poolTokenSupportsPermitSign = (chainId, token) => {
  return CUSTOM_CONTRACT_ADDRESSES[chainId]?.Dai?.toLowerCase === token?.toLowerCase
}
