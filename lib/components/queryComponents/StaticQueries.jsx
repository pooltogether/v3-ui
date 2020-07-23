import { useQuery } from '@apollo/client'

import { staticPrizePoolsQuery } from 'lib/queries/staticPrizePoolsQuery'
import { staticPrizeStrategiesQuery } from 'lib/queries/staticPrizeStrategiesQuery'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { getPrizeStrategyDataFromQueryResult } from 'lib/services/getPrizeStrategyDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

export const StaticQueries = (
  props,
) => {
  const { poolAddresses, children } = props

  let staticPoolData

  // this should only run once:
  const { loading: poolsQueryLoading, error: poolsQueryError, data: poolsQueryData } = useQuery(staticPrizePoolsQuery, {
    fetchPolicy: 'network-only',
  })

  if (poolsQueryError) {
    poolToast.error(poolsQueryError)
    console.error(poolsQueryError)
  }
  
  staticPoolData = getPoolDataFromQueryResult(poolAddresses, poolsQueryData)


  
  let staticPrizeStrategiesData

  const { loading: prizeStrategiesQueryLoading, error: prizeStrategiesQueryError, data: prizeStrategiesQueryData } = useQuery(staticPrizeStrategiesQuery, {
    fetchPolicy: 'network-only',
  })

  if (prizeStrategiesQueryError) {
    poolToast.error(prizeStrategiesQueryError)
    console.error(prizeStrategiesQueryError)
  }

  staticPrizeStrategiesData = getPrizeStrategyDataFromQueryResult(poolAddresses, prizeStrategiesQueryData)



  const staticDataLoading = poolsQueryLoading || prizeStrategiesQueryLoading

  return children({ staticPoolData, staticPrizeStrategiesData, staticDataLoading })
}
