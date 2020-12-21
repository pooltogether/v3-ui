import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'
import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'lib/../abis/ERC20Abi'

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
    const usersDripData = await _getDripTokenData(provider, usersAddress, dripTokens, usersDripBalances)

    return usersDripData
  } catch (e) {
    return {}
  }
}

const _getDripTokenData = async (provider, usersAddress, dripTokens, usersDripBalances) => {
  const usersDripData = {}
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

    usersDripData[dripTokenAddress] = {
      ...dripToken,
      name: values[dripTokenAddress].name[0],
      symbol: values[dripTokenAddress].symbol[0],
      decimals: values[dripTokenAddress].decimals[0],
      balance: values[dripTokenAddress].balanceOf[0],
      claimable,
    }
  }

  return usersDripData
}

export const fetchUsersDripData = async ({
  provider,
  comptrollerAddress,
  dripTokens,
  usersAddress,
  pairs,
}) => {
  let usersDripData = {}

  usersDripData = await _getUserDripData(provider, comptrollerAddress, pairs, usersAddress, dripTokens)

  return {
    ...usersDripData,
  }
}
