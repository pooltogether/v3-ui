import { useReadProvider } from 'lib/hooks/useReadProvider'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'

const debug = require('debug')('pool-app:ChainQueries')

export function useErc721ChainQuery(poolGraphData) {
  const { readProvider } = useReadProvider()

  const poolAddress = poolGraphData?.poolAddress
  const graphExternalErc721Awards = poolGraphData?.externalErc721Awards

  // this is being used via a direct query cache read!
  const {
    status: erc721ChainStatus,
    data: erc721ChainData,
    error: erc721ChainError,
    isFetching: erc721IsFetching
  } = useEthereumErc721Query({
    provider: readProvider,
    graphErc721Awards: graphExternalErc721Awards,
    poolAddress,
  })

  if (erc721ChainError) {
    console.warn(erc721ChainError)
  }
  
  return { erc721ChainData }
}
