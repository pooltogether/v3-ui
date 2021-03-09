// import PermitAndDepositDaiAbi from '@pooltogether/pooltogether-contracts/abis/PermitAndDepositDai'
import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'lib/../abis/ERC20Abi'

const _getUserPoolData = async (provider, usersAddress, pool) => {
  const { underlyingCollateralToken, id: poolAddress } = pool

  const etherplexTokenContract = contract('token', ERC20Abi, underlyingCollateralToken)

  const values = await batch(
    provider,
    etherplexTokenContract.balanceOf(usersAddress).allowance(usersAddress, poolAddress)
  )

  // OPTIMIZE: we can improve on this by batching in the same call above if we can figure out how to
  // conditionally query depending on if we have a permitContract
  // let daiPermitValues = {}
  // const { daiPermitContract } = contractAddresses
  // if (daiPermitContract) {
  //   daiPermitValues = await batch(
  //     provider,
  //     etherplexTokenContract
  //       .allowance(usersAddress, daiPermitContract)
  //   )
  // }

  return {
    // usersDaiPermitAllowance: daiPermitValues?.token?.allowance[0],
    usersTokenAllowance: values.token.allowance[0],
    usersTokenBalance: values.token.balanceOf[0]
  }
}

export const fetchUsersChainData = async ({ provider, pool, usersAddress }) => {
  let userPoolData = {}

  // Get Balances of Pool
  if (pool?.underlyingCollateralToken) {
    userPoolData = await _getUserPoolData(provider, usersAddress, pool)
  }

  return {
    ...userPoolData
  }
}
