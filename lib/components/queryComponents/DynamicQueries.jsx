import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { isEmpty } from 'lodash'

import {
  CREATOR_ADDRESS,
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { dynamicPlayerQuery } from 'lib/queries/dynamicPlayerQuery'
import { dynamicSponsorQuery } from 'lib/queries/dynamicSponsorQuery'
import { dynamicPrizePoolsQuery } from 'lib/queries/dynamicPrizePoolsQuery'
import { dynamicSingleRandomWinnerQuery } from 'lib/queries/dynamicSingleRandomWinnerQuery'
import { externalAwardsQuery } from 'lib/queries/externalAwardsQuery'
import { getExternalAwardsDataFromQueryResult } from 'lib/services/getExternalAwardsDataFromQueryResult'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { getPrizeStrategyDataFromQueryResult } from 'lib/services/getPrizeStrategyDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

const debug = require('debug')('pool-app:DynamicQueries')

export const DynamicQueries = (
  props,
) => {
  const { poolAddresses, usersAddress, children } = props

  const { paused } = useContext(GeneralContext)

  const variables = {
    owner: CREATOR_ADDRESS
  }

  let dynamicPoolData

  // multiple queries at the same time this (or use apollo-link-batch) to prevent multiple re-renders
  const {
    loading: poolQueryLoading,
    error: poolQueryError,
    data: poolQueryData,
    refetch: refetchPoolQuery
  } = useQuery(dynamicPrizePoolsQuery, {
    variables,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL
  })

  // useEffect(() => {
  //   const onCompleted = (data) => {
  //     debug('updating dynamic prize pool data after MAINNET_POLLING_INTERVAL expired', MAINNET_POLLING_INTERVAL)
  //   };
  //   if (onCompleted && !poolQueryLoading && !poolQueryError) {
  //     onCompleted(poolQueryData)
  //   }
  // }, [poolQueryLoading, poolQueryData, poolQueryError]);

  if (poolQueryError) {
    poolToast.error(poolQueryError)
    console.error(poolQueryError)
  }

  dynamicPoolData = getPoolDataFromQueryResult(poolAddresses, poolQueryData)










  let dynamicPrizeStrategiesData

  const {
    loading: prizeStrategyQueryLoading,
    error: prizeStrategyQueryError,
    data: prizeStrategyQueryData,
    refetch: refetchPrizeStrategyQuery
  } = useQuery(dynamicSingleRandomWinnerQuery, {
    variables,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL
  })

  if (prizeStrategyQueryError) {
    poolToast.error(prizeStrategyQueryError)
    console.error(prizeStrategyQueryError)
  }

  dynamicPrizeStrategiesData = getPrizeStrategyDataFromQueryResult(poolAddresses, prizeStrategyQueryData)






  let dynamicExternalAwardsData

  const {
    loading: externalAwardsLoading,
    error: externalAwardsError,
    data: externalAwardsData,
    refetch: refetchExternalAwards
  } = useQuery(externalAwardsQuery, {
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL
  })

  if (externalAwardsError) {
    poolToast.error(externalAwardsError)
    console.error(externalAwardsError)
  }

  // TODO: We shouldn't need this, we should be able to just get the external awards for a particular prize
  // strategy
  dynamicExternalAwardsData = getExternalAwardsDataFromQueryResult(poolAddresses, externalAwardsData)









  let dynamicPlayerData
  let dynamicPlayerDrips

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
    dynamicPlayerDrips = {
      dripTokens: playerQueryData.playerDripToken,
      balanceDrips: playerQueryData.playerBalanceDrip,
      volumeDrips: playerQueryData.playerVolumeDrip,
    }
  }



  let dynamicSponsorData

  const {
    loading: sponsorQueryLoading,
    error: sponsorQueryError,
    data: sponsorQueryData,
    refetch: refetchSponsorQuery
  } = useQuery(dynamicSponsorQuery, {
    variables: {
      sponsorAddress: usersAddress
    },
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
    skip: !usersAddress
  })

  if (sponsorQueryError) {
    if (sponsorQueryError.message.match('service is overloaded')) {
      poolToast.warn('The Graph protocol service is currently overloaded, please try again in a few minutes')
    }
  }

  if (sponsorQueryData) {
    dynamicSponsorData = sponsorQueryData.sponsor
  }



  const dynamicDataLoading = poolQueryLoading || prizeStrategyQueryLoading || externalAwardsLoading || playerQueryLoading || sponsorQueryLoading

  if (!poolQueryLoading && !isEmpty(dynamicPoolData)) {
    window.hideGraphError()
  }

  return children({
    dynamicDataLoading,
    dynamicExternalAwardsData,
    dynamicPoolData,
    dynamicPrizeStrategiesData,
    dynamicPlayerData,
    dynamicPlayerDrips,
    dynamicSponsorData,
    refetchPoolQuery,
    refetchPrizeStrategyQuery,
    refetchPlayerQuery,
    refetchSponsorQuery,
  })
}
