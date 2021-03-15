import { useContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'
import { atom, useAtom } from 'jotai'
import { batch, contract } from '@pooltogether/etherplex'

import DelegateableERC20ABI from 'abis/DelegateableERC20ABI'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useReadProvider } from 'lib/hooks/useReadProvider'

const poolTokenDataAtom = atom({})

export const usePoolTokenData = (usersAddress) => {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  const [poolTokenData, setPoolTokenData] = useAtom(poolTokenDataAtom)
  const { readProvider, isLoaded: readProviderIsLoaded } = useReadProvider()

  const queryResponse = useQuery(
    [QUERY_KEYS.poolTokenDataQuery, chainId, usersAddress],
    async () => {
      return getPoolTokenData(readProvider, chainId, usersAddress, setPoolTokenData)
    },
    {
      enabled: !pauseQueries && chainId && readProviderIsLoaded && usersAddress
    }
  )

  useEffect(() => {
    if (queryResponse !== poolTokenData) {
      setPoolTokenData(queryResponse)
    }
  }, [queryResponse])

  return poolTokenData
}

const getPoolTokenData = async (provider, chainId, usersAddress, setPoolTokenData) => {
  const poolAddress = CONTRACT_ADDRESSES[chainId].GovernanceToken
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
