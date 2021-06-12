import { ethers } from 'ethers'

export function usersDataForPool(pool, usersChainData) {
  const decimals = pool?.tokens.underlyingToken.decimals

  const usersTokenAllowance = usersChainData?.usersTokenAllowance
    ? usersChainData.usersTokenAllowance
    : ethers.BigNumber.from(0)

  const usersTokenBalanceBN = usersChainData?.usersTokenBalance
    ? usersChainData.usersTokenBalance
    : ethers.BigNumber.from(0)

  let usersTokenBalance = 0
  if (decimals) {
    usersTokenBalance = ethers.utils.formatUnits(usersTokenBalanceBN, parseInt(decimals, 10))
  }

  return {
    usersTokenBalanceBN,
    usersTokenBalance,
    usersTokenAllowance
  }
}
