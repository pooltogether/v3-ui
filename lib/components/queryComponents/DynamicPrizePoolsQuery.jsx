import { useQuery } from '@apollo/client'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { dynamicPrizePoolsQuery } from 'lib/queries/dynamicPrizePoolsQuery'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

export const DynamicPrizePoolsQuery = (
  props,
) => {
  const { addresses, children } = props
 
  let poolData

  const { loading, error, data } = useQuery(dynamicPrizePoolsQuery, {
    pollInterval: MAINNET_POLLING_INTERVAL
  })

  if (error) {
    poolToast.error(error)
    console.error(error)
  }

  poolData = getPoolDataFromQueryResult(addresses, data)

  return children(poolData)
}
