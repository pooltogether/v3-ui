import { useReadProvider } from 'lib/hooks/useReadProvider'
import { useEthereumPoolQuery } from 'lib/hooks/useEthereumPoolQuery'

const debug = require('debug')('pool-app:ChainQueries')

export function usePoolChainQuery(poolsGraphData) {
  const { readProvider } = useReadProvider()

  const {
    status: poolChainStatus,
    data: poolChainData,
    error: poolChainError,
    isFetching: poolIsFetching
  } = useEthereumPoolQuery({
    provider: readProvider,
    poolGraphData: poolsGraphData?.['PT-cDAI'],
  })

  if (poolChainError) {
    console.warn(poolChainError)
  }

  return { poolChainData }
}
