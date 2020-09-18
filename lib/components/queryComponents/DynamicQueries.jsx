import { useContext } from 'react'
import { useQuery } from '@apollo/client'

import {
  CREATOR_ADDRESS,
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { dynamicPlayerQuery } from 'lib/queries/dynamicPlayerQuery'
import { dynamicSponsorQuery } from 'lib/queries/dynamicSponsorQuery'
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

  const variables = {
    creator: CREATOR_ADDRESS
  }


  let dynamicPoolData

  // multiple queries at the same time this (or use apollo-link-batch) to prevent multiple re-renders
  const { loading: poolQueryLoading, error: poolQueryError, data: poolQueryData } = useQuery(dynamicPrizePoolsQuery, {
    variables,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL
  })

  if (poolQueryError) {
    poolToast.error(poolQueryError)
    console.error(poolQueryError)
  }

  dynamicPoolData = getPoolDataFromQueryResult(poolAddresses, poolQueryData)



  let dynamicPrizeStrategiesData

  const { loading: prizeStrategyQueryLoading, error: prizeStrategyQueryError, data: prizeStrategyQueryData } = useQuery(dynamicPrizeStrategiesQuery, {
    variables,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL
  })

  if (prizeStrategyQueryError) {
    poolToast.error(prizeStrategyQueryError)
    console.error(prizeStrategyQueryError)
  }

  dynamicPrizeStrategiesData = getPrizeStrategyDataFromQueryResult(poolAddresses, prizeStrategyQueryData)





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
    // console.log('DynamicQueries', {...playerQueryData})
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
  //   poolToast.error(sponsorQueryError)
    console.log(sponsorQueryError)
  }

  if (sponsorQueryData) {
    dynamicSponsorData = sponsorQueryData.sponsor
  }



  const dynamicDataLoading = poolQueryLoading || prizeStrategyQueryLoading || playerQueryLoading || sponsorQueryLoading

  return children({
    dynamicDataLoading,
    dynamicPoolData,
    dynamicPrizeStrategiesData,
    dynamicPlayerData,
    dynamicPlayerDrips,
    dynamicSponsorData,
    refetchPlayerQuery,
    refetchSponsorQuery,
  })
}
