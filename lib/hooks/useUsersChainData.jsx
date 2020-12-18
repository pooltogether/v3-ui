import { useContext } from 'react'
import { uniqWith, isEqual } from 'lodash'

// import {
//   MAINNET_POLLING_INTERVAL
// } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useEthereumUserChainQuery } from 'lib/hooks/useEthereumUserChainQuery'
import { usePools } from 'lib/hooks/usePools'
import { useReadProvider } from 'lib/hooks/useReadProvider'
// import { useInterval } from 'lib/hooks/useInterval'
import { usePoolDripsQuery } from 'lib/hooks/usePoolDripsQuery'
// import { fetchUsersChainData } from 'lib/utils/fetchUsersChainData'

const debug = require('debug')('pool-app:FetchUsersChainData')

export function useUsersChainData(pool) {
  const { usersAddress } = useContext(AuthControllerContext)

  const { readProvider } = useReadProvider()

  const { contractAddresses } = usePools()

  const { data: graphDripData, error } = usePoolDripsQuery()
  if (error) {
    console.error(error)
  }

  let pairs = []
  let dripTokens = []
  let comptrollerAddress
  if (graphDripData?.balanceDrips) {
    const balanceDripPairs = graphDripData?.balanceDrips.map((drip) => [drip.sourceAddress, drip.measureToken])
    const volumeDripPairs = graphDripData?.volumeDrips.map((drip) => [drip.sourceAddress, drip.measureToken])

    pairs = uniqWith(balanceDripPairs?.concat(volumeDripPairs), isEqual)

    const balanceDripTokens = graphDripData?.balanceDrips.map((drip) => drip.dripToken)
    const volumeDripTokens = graphDripData?.volumeDrips.map((drip) => drip.dripToken)

    dripTokens = uniqWith(balanceDripTokens?.concat(volumeDripTokens), isEqual)

    if (graphDripData.balanceDrips.length > 0) {
      comptrollerAddress = graphDripData.balanceDrips[0].comptroller.id
    }
  }



  const {
    data: usersChainData,
    error: usersChainError,
  } = useEthereumUserChainQuery({
    provider: readProvider,
    pool,
    comptrollerAddress,
    dripTokens,
    usersAddress,
    pairs,
    contractAddresses,
  })

  if (usersChainError) {
    console.error(usersChainError)
  }
  
  return { usersChainData }
}
