import { useReadProvider } from 'lib/hooks/useReadProvider'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'

const debug = require('debug')('pool-app:ChainQueries')

export function useErc721ChainQuery(poolGraphData) {
  const { readProvider } = useReadProvider()

  const poolAddress = poolGraphData?.poolAddress
  const graphExternalErc721Awards = poolGraphData?.externalErc721Awards

  const { data: erc721ChainData, error: erc721ChainError } = useEthereumErc721Query({
    provider: readProvider,
    graphErc721Awards: graphExternalErc721Awards,
    balanceOfAddress: poolAddress
  })

  if (erc721ChainError) {
    console.warn(erc721ChainError)
  }

  return { erc721ChainData }
}
