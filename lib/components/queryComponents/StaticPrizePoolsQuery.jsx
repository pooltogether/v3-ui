import { useQuery } from '@apollo/client'

import { staticPrizePoolsQuery } from 'lib/queries/staticPrizePoolsQuery'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

export const StaticPrizePoolsQuery = (
  props,
) => {
  const { addresses, children } = props

  let poolData

  // this should only run once:
  const { loading, error, data } = useQuery(staticPrizePoolsQuery, {
    fetchPolicy: 'network-only',
  })

  if (error) {
    poolToast.error(error)
    console.error(error)
  }
  
  poolData = getPoolDataFromQueryResult(addresses, data)
  
  return children(poolData)
}
