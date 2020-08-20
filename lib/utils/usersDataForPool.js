import { ethers } from 'ethers'

export function usersDataForPool(pool, usersChainData) {
  const decimals = pool?.underlyingCollateralDecimals

  const usersTokenAllowance = usersChainData?.usersTokenAllowance ?
    usersChainData.usersTokenAllowance :
    ethers.utils.bigNumberify(0)

  const usersBalanceBN = usersChainData?.usersTokenBalance ?
    usersChainData.usersTokenBalance :
    ethers.utils.bigNumberify(0)

  let usersBalance = 0
  if (decimals) {
    usersBalance = Number(
      ethers.utils.formatUnits(
        usersBalanceBN,
        Number(decimals)
      )
    )
  }

  return {
    usersBalanceBN,
    usersBalance,
    usersTokenAllowance,
  }
}
