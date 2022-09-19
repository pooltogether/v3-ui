import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'

export const getPoolTogetherDepositUrl = (chainId: number) =>
  `https://app.pooltogether.com/deposit?network=${getNetworkNiceNameByChainId(chainId)}`
