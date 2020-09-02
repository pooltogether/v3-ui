import { useContext } from 'react'
import { useQuery } from '@apollo/client'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
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
 
  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  let dynamicPoolData

  // multiple queries at the same time, this or use apollo-link-batch (to prevent multiple re-renders)
  const { loading: poolQueryLoading, error: poolQueryError, data: poolQueryData } = useQuery(dynamicPrizePoolsQuery, {
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL
  })

  if (poolQueryError) {
    poolToast.error(poolQueryError)
    console.error(poolQueryError)
  }

  dynamicPoolData = getPoolDataFromQueryResult(poolAddresses, poolQueryData)



  let dynamicPrizeStrategiesData

  // OPTIMIZE: Batch multiple queries at the same time,
  // this or use apollo-link-batch (to prevent multiple re-renders)
  const { loading: prizeStrategyQueryLoading, error: prizeStrategyQueryError, data: prizeStrategyQueryData } = useQuery(dynamicPrizeStrategiesQuery, {
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL
  })

  if (prizeStrategyQueryError) {
    poolToast.error(prizeStrategyQueryError)
    console.error(prizeStrategyQueryError)
  }

  dynamicPrizeStrategiesData = getPrizeStrategyDataFromQueryResult(poolAddresses, prizeStrategyQueryData)





  let dynamicPlayerData

  const {
    loading: playerQueryLoading,
    error: playerQueryError,
    data: playerQueryData,
    refetch: refetchPlayerQuery
  } = useQuery(dynamicPlayerQuery, {
    variables: {
      playerAddress: usersAddress
    },
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
    skip: !usersAddress
  })

  if (playerQueryError) {
    poolToast.error(playerQueryError)
    console.error(playerQueryError)
  }

  if (playerQueryData) {
    dynamicPlayerData = playerQueryData.player
  }

  const dynamicDataLoading = poolQueryLoading || prizeStrategyQueryLoading || playerQueryLoading
  
  return children({
    dynamicDataLoading,
    dynamicPoolData,
    dynamicPrizeStrategiesData,
    dynamicPlayerData,
    refetchPlayerQuery
  })
}
