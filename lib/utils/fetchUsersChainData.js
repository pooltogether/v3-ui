// import PermitAndDepositDaiAbi from '@pooltogether/pooltogether-contracts/abis/PermitAndDepositDai'
import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'
import { batch, contract } from '@pooltogether/etherplex'

import PoolV21Abi from 'lib/../abis/PoolV21Abi'
import PodAbi from 'lib/../abis/PodAbi'

import ERC20Abi from 'lib/../abis/ERC20Abi'

// import { DRIP_TOKENS } from 'lib/constants'

const _getUserPoolData = async (provider, usersAddress, pool, poolAddresses) => {
  const {
    underlyingCollateralToken,
    poolAddress,
  } = pool

  const etherplexTokenContract = contract(
    'token',
    ERC20Abi,
    underlyingCollateralToken
  )

  const values = await batch(
    provider,
    etherplexTokenContract
      .balanceOf(usersAddress)
      .allowance(usersAddress, poolAddress)
  )
  
  // OPTIMIZE: we can improve on this by batching in the same call above if we can figure out how to
  // conditionally query depending on if we have a permitContract
  // let daiPermitValues = {}
  // const { daiPermitContract } = poolAddresses
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
    usersTokenBalance: values.token.balanceOf[0],
  }
}

const _getUsersV2Data = async (provider, usersAddress, poolAddresses) => {
  const chainId = provider.network.chainId
  if (chainId !== 1) {
    return
  }

  const etherplexV2DaiPoolContract = contract(
    'v2DaiPool',
    PoolV21Abi,
    poolAddresses.v2DAIPool
  )
  
  const etherplexV2UsdcPoolContract = contract(
    'v2UsdcPool',
    PoolV21Abi,
    poolAddresses.v2USDCPool
  )

  const etherplexV2DaiPodContract = contract(
    'v2DaiPod',
    PodAbi,
    poolAddresses.v2DAIPod
  )

  const etherplexV2UsdcPodContract = contract(
    'v2UsdcPod',
    PodAbi,
    poolAddresses.v2USDCPod
  )

  const values = await batch(
    provider,
    etherplexV2DaiPoolContract
      .committedBalanceOf(usersAddress)
      .openBalanceOf(usersAddress),
    etherplexV2UsdcPoolContract
      .committedBalanceOf(usersAddress)
      .openBalanceOf(usersAddress),
    etherplexV2DaiPodContract
      .balanceOfUnderlying(usersAddress)
      .pendingDeposit(usersAddress)
      .balanceOf(usersAddress),
    etherplexV2UsdcPodContract
      .balanceOfUnderlying(usersAddress)
      .pendingDeposit(usersAddress)
      .balanceOf(usersAddress),
  )

  return {
    v2DaiPoolCommittedBalance: values.v2DaiPool.committedBalanceOf[0],
    v2DaiPoolOpenBalance: values.v2DaiPool.openBalanceOf[0],
    v2UsdcPoolCommittedBalance: values.v2UsdcPool.committedBalanceOf[0],
    v2UsdcPoolOpenBalance: values.v2UsdcPool.openBalanceOf[0],
    v2DaiPodCommittedBalance: values.v2DaiPod.balanceOfUnderlying[0],
    v2DaiPodOpenBalance: values.v2DaiPod.pendingDeposit[0],
    v2DaiPodSharesBalance: values.v2DaiPod.balanceOf[0],
    v2UsdcPodCommittedBalance: values.v2UsdcPod.balanceOfUnderlying[0],
    v2UsdcPodOpenBalance: values.v2UsdcPod.pendingDeposit[0],
    v2UsdcPodSharesBalance: values.v2UsdcPod.balanceOf[0],
  }
}

const _getUserDripData = async (provider, comptrollerAddress, pairs, usersAddress, dripTokens) => {
  try {
    const etherplexComptrollerContract = contract(
      'comptroller',
      ComptrollerAbi,
      comptrollerAddress
    )

    const values = await batch(
      provider,
      etherplexComptrollerContract
        .updateDrips(pairs, usersAddress, dripTokens)
    )

    const usersDripBalances = values.comptroller.updateDrips[0]
    const usersDripTokenData = await _getDripTokenData(provider, usersAddress, dripTokens, usersDripBalances)

    return {
      usersDripTokenData
    }
  } catch (e) {
    console.warn(e.message)
    // console.error(e)
    return {}
  }
  
}

const _getDripTokenData = async (provider, usersAddress, dripTokens, usersDripBalances) => {
  const usersDripTokenData = {}
  const batchCalls = []

  let etherplexTokenContract
  let dripTokenAddress
  let dripToken
  let values
  let i

  // Prepare batched calls
  for (i = 0; i < dripTokens.length; i++) {
    dripTokenAddress = dripTokens[i]

    etherplexTokenContract = contract(dripTokenAddress, ERC20Abi, dripTokenAddress)

    batchCalls.push(
      etherplexTokenContract
        .balanceOf(usersAddress)
        .name()
        .symbol()
        .decimals()
    )
  }

  // Execute batched calls
  values = await batch(
    provider,
    ...batchCalls
  )

  // Map batch call results to drip token data
  for (i = 0; i < dripTokens.length; i++) {
    dripTokenAddress = dripTokens[i]
    dripToken = dripTokens[dripTokenAddress]

    const claimable = usersDripBalances.find(dripBalance => {
      return dripBalance.dripToken.toLowerCase() === dripTokenAddress.toLowerCase()
    })
      .balance

    usersDripTokenData[dripTokenAddress] = {
      ...dripToken,
      name: values[dripTokenAddress].name[0],
      symbol: values[dripTokenAddress].symbol[0],
      decimals: values[dripTokenAddress].decimals[0],
      balance: values[dripTokenAddress].balanceOf[0],
      claimable,
    }
  }

  return usersDripTokenData
}


export const fetchUsersChainData = async (
  provider,
  pool,
  comptrollerAddress,
  dripTokens,
  usersAddress,
  pairs,
  poolAddresses
) => {
  let userPoolData = {}
  let usersV2Data = {}
  let userDripData = {}

  try {
    // Get Balances of Drip Tokens
    if (provider && usersAddress) {
      if (comptrollerAddress && pairs && dripTokens) {
        userDripData = await _getUserDripData(provider, comptrollerAddress, pairs, usersAddress, dripTokens)
      }

      // Get Balances of Pool
      if (pool) {
        userPoolData = await _getUserPoolData(provider, usersAddress, pool, poolAddresses)
      }
      
      usersV2Data = await _getUsersV2Data(provider, usersAddress, poolAddresses)
    }

    return {
      ...userPoolData,
      ...userDripData,
      ...usersV2Data,
    }

  } catch (e) {
    console.warn(e.message)
    throw new Error(e)
  }
}
