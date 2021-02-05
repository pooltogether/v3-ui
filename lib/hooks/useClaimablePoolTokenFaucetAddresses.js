import { batch, contract } from '@pooltogether/etherplex'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'
import { QUERY_KEYS } from 'lib/constants'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { usePrizePoolAddresses } from 'lib/hooks/usePrizePoolAddresses'

export const useClaimablePoolTokenFaucetAddresses = () => {
  const prizePoolAddresses = usePrizePoolAddresses()

  const { refetch, data, isFetching, isFetched, error } = useFetchPoolTokenFaucets(
    prizePoolAddresses
  )

  return {
    refetch,
    data,
    isFetching,
    isFetched,
    error
  }
}

const useFetchPoolTokenFaucets = (poolAddresses) => {
  const { pauseQueries, chainId } = useContext(AuthControllerContext)
  const { readProvider, isLoaded: readProviderIsLoaded } = useReadProvider()

  return useQuery(
    [QUERY_KEYS.poolTokenFaucetsQuery, chainId, poolAddresses],
    async () => {
      return getPoolTokenFaucets(readProvider, poolAddresses)
    },
    {
      enabled: poolAddresses.length !== 0 && !pauseQueries && readProviderIsLoaded,
      placeholderData: []
    }
  )
}

// TODO: This is quite ugly and slow. Ideally we had all of this information inside of a hook
// like `usePools` but that is only subgraph data, `usePool` can't be looped over as it's a hook.
const getPoolTokenFaucets = async (provider, poolAddresses) => {
  let batchCalls = []
  poolAddresses.forEach((poolAddress) => {
    const prizePool = contract(poolAddress, PrizePoolAbi, poolAddress)
    batchCalls.push(prizePool.prizeStrategy())
  })

  const prizePoolResponse = await batch(provider, ...batchCalls)

  batchCalls = []
  poolAddresses.forEach((poolAddress) => {
    const prizeStrategyAddresss = prizePoolResponse[poolAddress].prizeStrategy[0]
    const prizeStrategy = contract(poolAddress, PrizeStrategyAbi, prizeStrategyAddresss)
    batchCalls.push(prizeStrategy.tokenListener())
  })

  const prizeStrategyResponse = await batch(provider, ...batchCalls)

  return poolAddresses
    .map((poolAddress) => prizeStrategyResponse[poolAddress].tokenListener[0])
    .filter((tokenFaucetAddress) => tokenFaucetAddress !== ethers.constants.AddressZero)
}
