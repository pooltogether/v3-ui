import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { isEmpty } from 'lodash'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { usePlayerQuery } from 'lib/hooks/usePlayerQuery'
import { dynamicSponsorQuery } from 'lib/queries/dynamicSponsorQuery'
import { prizePoolsQuery } from 'lib/queries/prizePoolsQuery'
import { getPoolDataFromQueryResult } from 'lib/services/getPoolDataFromQueryResult'
import { poolToast } from 'lib/utils/poolToast'

const debug = require('debug')('pool-app:GraphDataQueries')

export const GraphDataQueries = (
  props,
) => {
  const { contractAddresses, usersAddress, children } = props

  const { chainId } = useContext(AuthControllerContext)
  const { paused } = useContext(GeneralContext)

  const variables = {
    poolAddresses: contractAddresses.pools
  }

  let poolData

  const {
    loading: poolQueryLoading,
    error: poolQueryError,
    data: poolQueryData,
    refetch: refetchPoolQuery
  } = useQuery(prizePoolsQuery, {
    variables,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL
  })

  if (poolQueryError) {
    poolToast.error(poolQueryError)
    console.error(poolQueryError)
  }

  poolData = getPoolDataFromQueryResult(contractAddresses, poolQueryData)








  const playerAddress = usersAddress

  let playerAddressError
  if (playerAddress) {
    try {
      ethers.utils.getAddress(playerAddress)
    } catch (e) {
      console.error(e)

      if (e.message.match('invalid address')) {
        playerAddressError = 'Incorrectly formatted Ethereum address!'
        console.error(playerAddressError)
      }
    }
  }

  let dynamicPlayerDrips

  const blockNumber = -1
  const {
    status,
    data: playerQueryData,
    error,
    isFetching: playerQueryFetching
  } = usePlayerQuery(chainId, playerAddress, blockNumber, playerAddressError)
  const refetchPlayerQuery = () => { console.warn('implement refetchPlayerQuery!') }
  if (error) {
    console.error(error)
  }


  // const {
  //   loading: playerQueryFetching,
  //   error: playerQueryError,
  //   data: playerQueryData,
  //   refetch: refetchPlayerQuery
  // } = useQuery(dynamicPlayerQuery, {
  //   variables: {
  //     playerAddress: usersAddress
  //   },
  //   fetchPolicy: 'network-only',
  //   pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  //   skip: !usersAddress
  // })

  // if (playerQueryError) {
  //   poolToast.error(playerQueryError)
  //   console.error(playerQueryError)
  // }

  console.log(playerQueryData)
  let dynamicPlayerData
  if (playerQueryData) {
    dynamicPlayerData = playerQueryData
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


  let graphDataLoading = poolQueryLoading ||
    // prizeStrategyQueryLoading ||
    // externalAwardsLoading ||
    playerQueryFetching ||
    sponsorQueryLoading ||
    // !dynamicPrizeStrategiesData ||
    !poolData

  if (usersAddress) {
    graphDataLoading = (graphDataLoading || !dynamicPlayerData || !dynamicSponsorData)
  }

  if (!poolQueryLoading && !isEmpty(poolData)) {
    window.hideGraphError()
  }

  return children({
    graphDataLoading,
    // dynamicExternalAwardsData,
    poolData,
    // dynamicPrizeStrategiesData,
    dynamicPlayerData,
    dynamicPlayerDrips,
    dynamicSponsorData,
    refetchPoolQuery,
    // refetchPrizeStrategyQuery,
    refetchPlayerQuery,
    refetchSponsorQuery,
  })
}
