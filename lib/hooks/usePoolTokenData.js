import { batch, contract } from '@pooltogether/etherplex'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import DelegateableERC20ABI from 'abis/DelegateableERC20ABI'
import { CONTRACT_ADDRESSES, QUERY_KEYS } from 'lib/constants'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

const poolTokenDataAtom = atom({})

export const usePoolTokenData = () => {
  const { usersAddress, chainId, pauseQueries } = useContext(
    AuthControllerContext
  )
  const [poolTokenData, setPoolTokenData] = useAtom(poolTokenDataAtom)
  const { readProvider, isLoaded: readProviderIsLoaded } = useReadProvider()
  
  const queryResponse = useQuery(
    [QUERY_KEYS.poolTokenDataQuery, chainId, usersAddress],
    async () => {
      return getPoolTokenData(readProvider, chainId, usersAddress, setPoolTokenData)
    },
    {
      // TODO: Remove chainId === 4
      enabled:
        !pauseQueries && chainId && chainId === 4 && readProviderIsLoaded && usersAddress
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
      poolContract
        .balanceOf(usersAddress)
        .decimals()
        .totalSupply()
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
