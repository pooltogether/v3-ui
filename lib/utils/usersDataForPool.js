import { ethers } from 'ethers'

export function usersDataForPool(pool, usersChainData) {
  const decimals = pool?.underlyingCollateralDecimals

  const usersTokenAllowance = usersChainData?.usersTokenAllowance
    ? usersChainData.usersTokenAllowance
    : ethers.utils.bigNumberify(0)

  const usersTokenBalanceBN = usersChainData?.usersTokenBalance
    ? usersChainData.usersTokenBalance
    : ethers.utils.bigNumberify(0)

  let usersTokenBalance = 0
  if (decimals) {
    usersTokenBalance = ethers.utils.formatUnits(usersTokenBalanceBN, parseInt(decimals, 10))
  }

  // const usersDaiPermitAllowance = usersChainData?.usersDaiPermitAllowance ?
  //   usersChainData.usersDaiPermitAllowance :
  //   ethers.utils.bigNumberify(0)

  return {
    usersTokenBalanceBN,
    usersTokenBalance,
    usersTokenAllowance,
    // usersDaiPermitAllowance,
  }
}
