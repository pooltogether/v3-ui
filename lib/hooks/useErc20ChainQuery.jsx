import { useReadProvider } from 'lib/hooks/useReadProvider'
import { useEthereumErc20Query } from 'lib/hooks/useEthereumErc20Query'

const debug = require('debug')('pool-app:ChainQueries')

export function useErc20ChainQuery(poolsGraphData) {
  const { readProvider } = useReadProvider()

  const poolAddress = poolsGraphData?.['PT-cDAI']?.poolAddress
  const graphExternalErc20Awards = poolsGraphData?.['PT-cDAI']?.externalErc20Awards

  // this is being used via a direct query cache read!
  const {
    status: erc20ChainStatus,
    data: erc20ChainData,
    error: erc20ChainError,
    isFetching: erc20IsFetching
  } = useEthereumErc20Query({
    provider: readProvider,
    graphErc20Awards: graphExternalErc20Awards,
    poolAddress,
  })

  if (erc20ChainError) {
    console.warn(erc20ChainError)
  }

  return { erc20ChainData }
}
