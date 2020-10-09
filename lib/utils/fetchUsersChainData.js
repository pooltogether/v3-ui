import { batch, contract } from '@pooltogether/etherplex'
import { forEach } from 'lodash'

import ERC20Abi from 'ERC20Abi'

import { DRIP_TOKENS } from 'lib/constants'


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

const _getUserDripData = async (provider, usersAddress) => {
  const drips = Object.keys(DRIP_TOKENS)
  const usersDripBalance = {}
  const batchCalls = []

  let etherplexTokenContract
  let dripTokenAddress
  let dripToken
  let values
  let i

  // Prepare batched calls
  for(i = 0; i < drips.length; i++) {
    dripTokenAddress = drips[i]
    etherplexTokenContract = contract(dripTokenAddress, ERC20Abi, dripTokenAddress)
    batchCalls.push(etherplexTokenContract.balanceOf(usersAddress))
  }

  // Execute batched calls
  values = await batch(
    provider,
    ...batchCalls
  )

  // Map batch call results to drip token data
  for(i = 0; i < drips.length; i++) {
    dripTokenAddress = drips[i]
    dripToken = DRIP_TOKENS[dripTokenAddress]

    usersDripBalance[dripTokenAddress] = {
      ...dripToken,
      balance: values[dripTokenAddress].balanceOf[0]
    }
  }

  return {
    usersDripBalance
  }
}


export const fetchUsersChainData = async (
  provider,
  pool,
  usersAddress,
) => {
  let userPoolData = {}
  let userDripData = {}

  try {
    // Get Balances of Drip Tokens
    if (provider && usersAddress) {
      userDripData = await _getUserDripData(provider, usersAddress)

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
