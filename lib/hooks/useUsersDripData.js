import { uniqWith, isEqual } from 'lodash'
import { useUsersAddress } from '@pooltogether/hooks'

import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { usePoolDripsQuery } from 'lib/hooks/usePoolDripsQuery'
import { useUsersDripQuery } from 'lib/hooks/useUsersDripQuery'
import { usePoolTokenChainId } from 'lib/hooks/chainId/usePoolTokenChainId'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'

// This is deprecated but needs to be around for the old rewards system so people
// can still claim from the drips. It only needs the 3_1_0 subgraph
export function useUsersDripData() {
  const usersAddress = useUsersAddress()

  const chainId = usePoolTokenChainId()
  const { data: readProvider } = useReadProvider(chainId)

  const { contractAddresses } = useContractAddresses(chainId)

  const { data: graphDripData, error } = usePoolDripsQuery()
  if (error) {
    console.error(error)
  }

  let pairs = []
  let dripTokens = []
  let comptrollerAddress
  if (graphDripData?.balanceDrips) {
    const balanceDripPairs = graphDripData?.balanceDrips.map((drip) => [
      drip.sourceAddress,
      drip.measureToken
    ])
    const volumeDripPairs = graphDripData?.volumeDrips.map((drip) => [
      drip.sourceAddress,
      drip.measureToken
    ])

    pairs = uniqWith(balanceDripPairs?.concat(volumeDripPairs), isEqual)

    const balanceDripTokens = graphDripData?.balanceDrips.map((drip) => drip.dripToken)
    const volumeDripTokens = graphDripData?.volumeDrips.map((drip) => drip.dripToken)

    dripTokens = uniqWith(balanceDripTokens?.concat(volumeDripTokens), isEqual)

    if (graphDripData.balanceDrips.length > 0) {
      comptrollerAddress = graphDripData.balanceDrips[0].comptroller.id
    }
  }

  const { data: usersDripData, error: usersDripError } = useUsersDripQuery({
    provider: readProvider,
    comptrollerAddress,
    dripTokens,
    usersAddress,
    pairs,
    contractAddresses
  })

  if (usersDripError) {
    console.error(usersDripError)
  }

  return { graphDripData, usersDripData }
}
