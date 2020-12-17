import { useReadProvider } from 'lib/hooks/useReadProvider'
import { useEthereumErc20Query } from 'lib/hooks/useEthereumErc20Query'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { useEthereumPoolQuery } from 'lib/hooks/useEthereumPoolQuery'

const debug = require('debug')('pool-app:ChainQueries')

export function useChainQueries(poolsGraphData) {
  const readProvider = useReadProvider()

  console.log(poolsGraphData)
  const {
    status: poolChainStatus,
    data: poolsChainData,
    error: poolChainError,
    isFetching: poolIsFetching
  } = useEthereumPoolQuery({
    poolData: poolsGraphData?.daiPool,
  })

  if (poolChainError) {
    console.warn(poolChainError)
  }



  // const poolAddress = poolsGraphData?.daiPool?.poolAddress
  // const graphExternalErc20Awards = poolsGraphData?.daiPool?.externalErc20Awards

  // this is being used via a direct query cache read!
  // const {
  //   status: externalErc20ChainStatus,
  //   data: externalErc20ChainData,
  //   error: externalErc20ChainError,
  //   isFetching: externalErc20IsFetching
  // } = useEthereumErc20Query({
  //   graphErc20Awards: graphExternalErc20Awards,
  //   poolAddress,
  // })

  // if (externalErc20ChainError) {
  //   console.warn(externalErc20ChainError)
  // }



  // const graphExternalErc721Awards = poolsGraphData?.daiPool?.externalErc721Awards

  // this is being used via a direct query cache read!
  // const {
  //   status: externalErc721ChainStatus,
  //   data: externalErc721ChainData,
  //   error: externalErc721ChainError,
  //   isFetching: externalErc721IsFetching
  // } = useEthereumErc721Query({
  //   graphErc721Awards: graphExternalErc721Awards,
  //   poolAddress,
  // })

  // if (externalErc721ChainError) {
  //   console.warn(externalErc721ChainError)
  // }
  
  return { poolsChainData }
}
