import { ethers } from 'ethers'
import { useQuery } from 'react-query'
import { batch, contract } from '@pooltogether/etherplex'
import { useAllPools, useIsTestnets } from '@pooltogether/hooks'
import TokenFaucetABI from '@pooltogether/pooltogether-contracts_3_3/abis/TokenFaucet'

import ERC20Abi from 'abis/ERC20Abi'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { testAddress } from 'lib/utils/testAddress'
import { useEnvReadProviders } from 'lib/hooks/providers/useEnvProviders'

// TODO: Update this to read from The Graph
// It'd be nice to copy the style of Sybil and have a large hook fetching as much as possible
// and smaller ones to filter the data
export const useClaimableTokenFromTokenFaucets = (chainId, usersAddress) => {
  const { data: pools, isFetched: poolsIsFetched } = useAllPools()
  const { isTestnets } = useIsTestnets()
  const { readProviders, isReadProvidersReady: readProvidersIsFetched } = useEnvReadProviders()

  const addressError = testAddress(usersAddress)

  const provider = readProviders?.[chainId]

  const tokenFaucets = []
  pools
    ?.filter((pool) => pool?.chainId === chainId)
    ?.forEach((pool) => {
      pool?.tokenFaucets?.forEach((tokenFaucet) => tokenFaucets.push(tokenFaucet))
    })

  const enabled = Boolean(
    tokenFaucets.length > 0 &&
      provider &&
      poolsIsFetched &&
      usersAddress &&
      !addressError &&
      readProvidersIsFetched
  )

  return useQuery(
    [QUERY_KEYS.claimablePoolFromTokenFaucets, chainId, usersAddress, isTestnets],
    async () => {
      return getClaimableTokensFromTokenFaucets(provider, tokenFaucets, usersAddress)
    },
    {
      enabled,
      refetchInterval: 10000
    }
  )
}

async function getClaimableTokensFromTokenFaucets(provider, tokenFaucets, usersAddress) {
  const claimableAmounts = await calculateClaimable(provider, tokenFaucets, usersAddress)

  // console.warn(claimableAmounts)
  return claimableAmounts
}

const calculateClaimable = async (provider, tokenFaucets, usersAddress) => {
  // TODO: Ideally this data is just shared from the other components
  // but the way the hooks are structured it's tricky to get the full list vs
  // the individual pools data
  let amounts

  for (let index = 0; index < tokenFaucets.length; index++) {
    const tokenFaucet = tokenFaucets[index]
    const tokenFaucetAddress = tokenFaucet?.address
    const dripToken = tokenFaucet?.dripToken

    const tokenFaucetContract = contract('tokenFaucetValues', TokenFaucetABI, tokenFaucetAddress)
    const { tokenFaucetValues } = await batch(provider, tokenFaucetContract.claim(usersAddress))
    const claimableAmountUnformatted = tokenFaucetValues.claim[0]
    const claimableAmount = ethers.utils.formatUnits(claimableAmountUnformatted, dripToken.decimals)

    const assetContract = contract('asset', ERC20Abi, dripToken.address)
    const { asset } = await batch(provider, assetContract.balanceOf(tokenFaucetAddress))

    const tokenFaucetTokenSupplyUnformatted = asset.balanceOf[0]
    const tokenFaucetTokenSupply = ethers.utils.formatUnits(
      tokenFaucetTokenSupplyUnformatted,
      dripToken.decimals
    )

    if (!amounts) {
      amounts = {}
    }

    amounts[tokenFaucetAddress] = {
      claimableAmountUnformatted,
      claimableAmount,
      tokenFaucetTokenSupplyUnformatted,
      tokenFaucetTokenSupply
    }

    if (!amounts.totals) {
      amounts.totals = {}
    }

    if (!amounts.totals[dripToken.address]) {
      amounts.totals[dripToken.address] = {
        totalClaimableAmountUnformatted: ethers.constants.Zero
      }
    }

    const totalClaimableAmountUnformatted = amounts.totals[
      dripToken.address
    ].totalClaimableAmountUnformatted.add(claimableAmountUnformatted)

    amounts.totals[dripToken.address] = {
      totalClaimableAmountUnformatted,
      totalClaimableAmount: ethers.utils.formatUnits(
        totalClaimableAmountUnformatted,
        dripToken.decimals
      )
    }
  }

  return amounts
}
