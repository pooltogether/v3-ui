import { useReadProvider } from 'lib/hooks/useReadProvider'
import { useEthereumPoolQuery } from 'lib/hooks/useEthereumPoolQuery'

const debug = require('debug')('pool-app:ChainQueries')

export function usePoolChainQuery(poolGraphData) {
  const { readProvider } = useReadProvider()

  const {
    data: poolChainData,
    error: poolChainError,
    isFetching: poolIsFetching
  } = useEthereumPoolQuery({
    provider: readProvider,
    poolGraphData,
  })

  if (poolChainError) {
    console.warn(poolChainError)
  }

  return { poolChainData }
}
