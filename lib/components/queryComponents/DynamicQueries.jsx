import { useQuery } from '@apollo/client'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { dynamicPlayerQuery } from 'lib/queries/dynamicPlayerQuery'
import { dynamicPrizePoolsQuery } from 'lib/queries/dynamicPrizePoolsQuery'
import { dynamicPrizeStrategiesQuery } from 'lib/queries/dynamicPrizeStrategiesQuery'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { getPrizeStrategyDataFromQueryResult } from 'lib/services/getPrizeStrategyDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

export const DynamicQueries = (
  props,
) => {
  const { poolAddresses, usersAddress, children } = props
 
  let dynamicPoolData

  // multiple queries at the same time, this or use apollo-link-batch (to prevent multiple re-renders)
  // const { loading: poolQueryLoading, error: poolQueryError, data: poolQueryData } = useQuery(poolquery, {})
  const { loading: poolQueryLoading, error: poolQueryError, data: poolQueryData } = useQuery(dynamicPrizePoolsQuery, {
    fetchPolicy: 'network-only',
    pollInterval: MAINNET_POLLING_INTERVAL
  })

  if (poolQueryError) {
    poolToast.error(poolQueryError)
    console.error(poolQueryError)
  }

  dynamicPoolData = getPoolDataFromQueryResult(poolAddresses, poolQueryData)



  let dynamicPrizeStrategyData

  // multiple queries at the same time, this or use apollo-link-batch (to prevent multiple re-renders)
  // const { loading: prizeStrategyQueryLoading, error: prizeStrategyQueryError, data: prizeStrategyQueryData } = useQuery(prizeStrategyquery, {})
  const { loading: prizeStrategyQueryLoading, error: prizeStrategyQueryError, data: prizeStrategyQueryData } = useQuery(dynamicPrizeStrategiesQuery, {
    fetchPolicy: 'network-only',
    pollInterval: MAINNET_POLLING_INTERVAL
  })

  if (prizeStrategyQueryError) {
    poolToast.error(prizeStrategyQueryError)
    console.error(prizeStrategyQueryError)
  }

  dynamicPrizeStrategyData = getPrizeStrategyDataFromQueryResult(poolAddresses, prizeStrategyQueryData)





  let dynamicPlayerData

  const { loading: playerQueryLoading, error: playerQueryError, data: playerQueryData } = useQuery(dynamicPlayerQuery, {
    variables: {
      playerAddress: usersAddress
    },
    fetchPolicy: 'network-only',
    pollInterval: MAINNET_POLLING_INTERVAL,
    skip: !usersAddress
  })

  if (playerQueryError) {
    poolToast.error(playerQueryError)
    console.error(playerQueryError)
  }

  if (playerQueryData) {
    dynamicPlayerData = playerQueryData.player
  }

  console.log({asdf: 'polling pollInterval'})


  const dynamicDataLoading = poolQueryLoading || prizeStrategyQueryLoading || playerQueryLoading
  
  return children({ dynamicDataLoading, dynamicPoolData, dynamicPrizeStrategyData, dynamicPlayerData })
}
