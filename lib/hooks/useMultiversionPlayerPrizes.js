import { useContext } from 'react'
import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPlayerPrizesData } from 'lib/fetchers/getPlayerPrizesData'
import { useVersionedPoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/useVersionedPoolTogetherSubgraphClient'

const deepmerge = require('deepmerge')

export function useMultiversionPlayerPrizes(address) {
  // 3.1.0
  const version310 = '3.1.0'
  const {
    refetch: playerPrizes310Refetch,
    data: playerPrizes310,
    error: playerPrizes310Error,
    isFetched: playerPrizes310IsFetched
  } = usePlayerPrizesQuery(address, version310)

  if (playerPrizes310Error) {
    console.error(playerPrizes310Error)
  }

  // 3.3.2
  const version332 = '3.3.2'
  let {
    refetch: playerPrizes332Refetch,
    data: playerPrizes332,
    error: playerPrizes332Error,
    isFetched: playerPrizes332IsFetched
  } = usePlayerPrizesQuery(address, version332)

  if (playerPrizes332Error) {
    console.error(playerPrizes332Error)
  }

  // All Versions Combined
  const isFetched = playerPrizes310IsFetched && playerPrizes332IsFetched

  const data = isFetched ? deepmerge(playerPrizes310, playerPrizes332) : {}

  const refetch = () => {
    playerPrizes310Refetch()
    playerPrizes332Refetch()
  }

  return {
    refetch,
    data,
    isFetched
  }
}

export function usePlayerPrizesQuery(address, version) {
  const { pauseQueries } = useContext(AuthControllerContext)
  const graphQLClient = useVersionedPoolTogetherSubgraphClient(version)

  address = address?.toLowerCase()

  const refetchInterval = MAINNET_POLLING_INTERVAL

  return useQuery(
    [QUERY_KEYS.playerPrizesQuery, graphQLClient.url, address],
    async () => {
      return getPlayerPrizesData(graphQLClient, address)
    },
    {
      enabled: !pauseQueries && graphQLClient.url && address,
      refetchInterval
    }
  )
}
