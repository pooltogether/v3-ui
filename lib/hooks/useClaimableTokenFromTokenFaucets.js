import { useContext } from 'react'
import { ethers } from 'ethers'
import { useQuery } from 'react-query'
import { batch, contract } from '@pooltogether/etherplex'
import TokenFaucetABI from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'

import ERC20Abi from 'abis/ERC20Abi'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { testAddress } from 'lib/utils/testAddress'
import { useAllPools } from 'lib/hooks/usePools'
import { useAppEnv } from 'lib/hooks/useAppEnv'
import { useEnvReadProviders } from 'lib/hooks/providers/useEnvProviders'

// TODO: Update this to read from The Graph
// It'd be nice to copy the style of Sybil and have a large hook fetching as much as possible
// and smaller ones to filter the data
export const useClaimableTokenFromTokenFaucets = (chainId, usersAddress) => {
  const { data: pools, isFetched: poolsIsFetched } = useAllPools()
  const { appEnv } = useAppEnv()
  const { data: readProviders, isFetched: readProvidersIsFetched } = useEnvReadProviders()
  const { pauseQueries } = useContext(AuthControllerContext)

  const addressError = testAddress(usersAddress)

  const enabled = Boolean(
    poolsIsFetched && !pauseQueries && usersAddress && !addressError && readProvidersIsFetched
  )

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
async function getClaimableTokensFromTokenFaucets(readProviders, chainId, pools, usersAddress) {
  const claimableAmounts = {
    totals: {}
  }

  for (const pool of pools) {
    try {
      const tokenFaucetDripToken = pool.tokens.tokenFaucetDripToken
      const tokenFaucetAddress = pool.tokenListener.address

      // Move on if this pool isn't on the supplied chainId
      if (pool.chainId !== chainId) {
        continue
      }

      if (
        !tokenFaucetAddress ||
        !tokenFaucetDripToken ||
        (pool.chainId === 4 && tokenFaucetAddress === '0xe70c3669371be02cde0809df6d9c514804cad2f0')
      ) {
        // This rinkeby contract is bad and causes annoying etherplex/ethers errors when we try to query data against it
        continue
      }

      const provider = readProviders.find(
        (readProvider) => readProvider.network.chainId === pool.chainId
      )
      const tokenFaucetContract = contract('tokenFaucet', TokenFaucetABI, tokenFaucetAddress)
      const { tokenFaucet } = await batch(provider, tokenFaucetContract.claim(usersAddress))
      const claimableAmountUnformatted = tokenFaucet.claim[0]
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
    } catch (e) {
      console.warn(e.message)
    }
  }

  return claimableAmounts
}
