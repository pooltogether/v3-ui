import { CONTRACT_ADDRESSES } from 'lib/constants'

const MAINNET_ID = '1'

export const poolTokenSupportsPermitSign = (token) => {
  return token?.toLowerCase() === CONTRACT_ADDRESSES[MAINNET_ID].Dai
}
