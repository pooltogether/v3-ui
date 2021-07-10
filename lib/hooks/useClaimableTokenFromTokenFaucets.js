import { ethers } from 'ethers'
import { useQuery } from 'react-query'
import { batch, contract } from '@pooltogether/etherplex'
import { useAppEnv } from '@pooltogether/hooks'
import TokenFaucetABI from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'

import ERC20Abi from 'abis/ERC20Abi'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { testAddress } from 'lib/utils/testAddress'
import { useAllPools } from 'lib/hooks/usePools'
import { useEnvReadProviders } from 'lib/hooks/providers/useEnvProviders'

// TODO: Update this to read from The Graph
// It'd be nice to copy the style of Sybil and have a large hook fetching as much as possible
// and smaller ones to filter the data
export const useClaimableTokenFromTokenFaucets = (chainId, usersAddress) => {
  const { data: pools, isFetched: poolsIsFetched } = useAllPools()
  const { appEnv } = useAppEnv()
  const { data: readProviders, isFetched: readProvidersIsFetched } = useEnvReadProviders()

  const addressError = testAddress(usersAddress)

  const enabled = Boolean(poolsIsFetched && usersAddress && !addressError && readProvidersIsFetched)

  return useQuery(
    [QUERY_KEYS.claimablePoolFromTokenFaucets, chainId, usersAddress, appEnv],
    async () => {
      return getClaimableTokensFromTokenFaucets(readProviders, chainId, pools, usersAddress)
    },
    {
      enabled,
      refetchInterval: 10000
    }
  )
}

// TODO: Ideally this data is just shared from the other components
// but the way the hooks are structured it's tricky to get the full list vs
// the individual pools data
let claimableAmounts = {
  totals: {}
}

async function getClaimableTokensFromTokenFaucets(readProviders, chainId, pools, usersAddress) {
  for (const pool of pools) {
    // Move on if this pool isn't on the supplied chainId
    if (pool.chainId !== chainId) {
      continue
    }

    pool.tokenFaucets?.forEach(async (tokenFaucet) => {
      claimableAmounts = await calculateClaimableForTokenFaucet(
        readProviders,
        pool,
        usersAddress,
        tokenFaucet,
        claimableAmounts
      )
    })
  }

  return claimableAmounts
}

const calculateClaimableForTokenFaucet = async (
  readProviders,
  pool,
  usersAddress,
  tokenFaucet,
  claimableAmounts
) => {
  try {
    // const tokenFaucet = pool.tokenFaucets?.[0]

    const tokenFaucetAddress = tokenFaucet?.address
    const tokenFaucetDripToken = tokenFaucet?.dripToken

    // Move on if this pool if we don't have tokenFaucet info
    if (!tokenFaucetAddress || !tokenFaucetDripToken) {
      return claimableAmounts
    }

    const provider = readProviders.find(
      (readProvider) => readProvider.network.chainId === pool.chainId
    )
    const tokenFaucetContract = contract('tokenFaucetValues', TokenFaucetABI, tokenFaucetAddress)
    const { tokenFaucetValues } = await batch(provider, tokenFaucetContract.claim(usersAddress))
    const claimableAmountUnformatted = tokenFaucetValues.claim[0]
    const claimableAmount = ethers.utils.formatUnits(
      claimableAmountUnformatted,
      tokenFaucetDripToken.decimals
    )

    const assetContract = contract('asset', ERC20Abi, tokenFaucetDripToken.address)
    const { asset } = await batch(provider, assetContract.balanceOf(tokenFaucetAddress))

    const tokenFaucetTokenSupplyUnformatted = asset.balanceOf[0]
    const tokenFaucetTokenSupply = ethers.utils.formatUnits(
      tokenFaucetTokenSupplyUnformatted,
      tokenFaucetDripToken.decimals
    )

    claimableAmounts[tokenFaucetAddress] = {
      claimableAmountUnformatted,
      claimableAmount,
      tokenFaucetTokenSupplyUnformatted,
      tokenFaucetTokenSupply
    }

    if (!claimableAmounts.totals[tokenFaucetDripToken.address]) {
      claimableAmounts.totals[tokenFaucetDripToken.address] = {
        totalClaimableAmountUnformatted: ethers.constants.Zero
      }
    }

    const totalClaimableAmountUnformatted = claimableAmounts.totals[
      tokenFaucetDripToken.address
    ].totalClaimableAmountUnformatted.add(claimableAmountUnformatted)

    claimableAmounts.totals[tokenFaucetDripToken.address] = {
      totalClaimableAmountUnformatted,
      totalClaimableAmount: ethers.utils.formatUnits(
        totalClaimableAmountUnformatted,
        tokenFaucetDripToken.decimals
      )
    }

    return claimableAmounts
  } catch (e) {
    console.warn(e.message)
  }
}
