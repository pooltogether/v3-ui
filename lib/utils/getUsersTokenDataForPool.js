import { ethers } from 'ethers'

export function getUsersTokenDataForPool(pool, usersChainData) {
  const decimals = pool?.tokens.underlyingToken.decimals

  const usersTokenAllowance = usersChainData?.usersTokenAllowance
    ? usersChainData.usersTokenAllowance
    : ethers.BigNumber.from(0)

  const usersTokenBalanceUnformatted = usersChainData?.usersTokenBalance
    ? usersChainData.usersTokenBalance
    : ethers.BigNumber.from(0)

  let usersTokenBalance = 0
  if (decimals) {
    usersTokenBalance = ethers.utils.formatUnits(
      usersTokenBalanceUnformatted,
      parseInt(decimals, 10)
    )
  }

  return {
    usersTokenBalanceUnformatted,
    usersTokenBalance,
    usersTokenAllowance
  }
}
