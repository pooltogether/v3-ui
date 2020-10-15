import { batch, contract } from '@pooltogether/etherplex'
import { forEach } from 'lodash'

import ERC20Abi from 'ERC20Abi'
import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

// import { DRIP_TOKENS } from 'lib/constants'

const _getUserPoolData = async (provider, usersAddress, pool) => {
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

  return {
    usersTokenAllowance: values.token.allowance[0],
    usersTokenBalance: values.token.balanceOf[0],
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
) => {
  let userPoolData = {}
  let userDripData = {}

  try {
    // Get Balances of Drip Tokens
    if (provider && usersAddress) {
      userDripData = await _getUserDripData(provider, comptrollerAddress, pairs, usersAddress, dripTokens)

      // Get Balances of Pool
      if (pool) {
        userPoolData = await _getUserPoolData(provider, usersAddress, pool)
      }
    }

    return {
      ...userPoolData,
      ...userDripData,
    }

  } catch (e) {
    console.warn(e.message)
    throw new Error(e)
  }
}
