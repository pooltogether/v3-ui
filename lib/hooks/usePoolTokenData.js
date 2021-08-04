import { useQuery } from 'react-query'
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'
import { useGovernanceChainId, useOnboard, useReadProvider } from '@pooltogether/hooks'

import DelegateableERC20ABI from 'abis/DelegateableERC20ABI'
import { CUSTOM_CONTRACT_ADDRESSES } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'

export const usePoolTokenData = (addressOverride) => {
  const { address: usersAddress } = useOnboard()
  const chainId = useGovernanceChainId()
  const { readProvider, isReadProviderReady } = useReadProvider(chainId)

  let address = addressOverride || usersAddress

  return useQuery(
    [QUERY_KEYS.poolTokenDataQuery, chainId, address],
    async () => {
      return getPoolTokenData(readProvider, chainId, address)
    },
    {
      enabled: Boolean(chainId && isReadProviderReady && address)
    }
  )
}

const getPoolTokenData = async (provider, chainId, usersAddress) => {
  const poolAddress = CUSTOM_CONTRACT_ADDRESSES[chainId].GovernanceToken
  const poolContract = contract('pool', DelegateableERC20ABI, poolAddress)

  try {
    const poolChainData = await batch(
      provider,
      poolContract.balanceOf(usersAddress).decimals().totalSupply()
    )

    const totalSupplyBN = poolChainData.pool.totalSupply[0]
    const usersBalanceBN = poolChainData.pool.balanceOf[0]
    const decimals = poolChainData.pool.decimals[0]

    return {
      ...poolChainData.pool,
      usersBalanceBN,
      usersBalance: Number(ethers.utils.formatUnits(usersBalanceBN, decimals)),
      decimals,
      totalSupplyBN,
      totalSupply: Number(ethers.utils.formatUnits(totalSupplyBN, decimals))
    }
  } catch (error) {
    console.error(error.message)
    return {}
  }
}
