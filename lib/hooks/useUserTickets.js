import { useQuery } from 'react-query'
import { useMemo } from 'react'
import { ethers } from 'ethers'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useEnvChainIds } from 'lib/hooks/chainId/useEnvChainIds'
import { useAllPoolsKeyedByChainId } from 'lib/hooks/usePools'
import { useReadProviders } from 'lib/hooks/providers/useReadProvider'
import { useSubgraphVersions } from 'lib/hooks/useSubgraphVersions'
import {
  formatTicketsByPool,
  getUserDataRpc,
  getUserDataSubgraph
} from 'lib/utils/useUserTicketsUtils'

/**
 * Flattened list of users tickets without chain information
 * @param {*} usersAddress
 * @returns
 */
export const useUserTickets = (usersAddress) => {
  const { data: userTicketsByChainIds, ...useQueryResponse } =
    useUserTicketsByChainIds(usersAddress)

  return {
    ...useQueryResponse,
    data: userTicketsByChainIds ? Object.values(userTicketsByChainIds).flat() : null
  }
}

/**
 * Fetches user's ticket and sponsorship info across multiple chains
 * tried Infura first then falls back to the Graph if there's errors
 * @param {*} usersAddress Address of user
 */
export const useUserTicketsByChainIds = (usersAddress) => {
  let subgraphIsFetched, rpcIsFetched

  const rpcUseQueryResponse = useUserTicketsByChainIdsRpc(usersAddress)
  const { error: rpcError } = rpcUseQueryResponse
  rpcIsFetched = rpcUseQueryResponse.isFetched
  let userTicketsData = rpcUseQueryResponse.data

  if (rpcError) {
    console.warn(`error fetching user tickets from rpc: `, rpcError)
  }

  const subgraphUseQueryResponse = useUserTicketsByChainIdsSubgraph(usersAddress)
  const { error: subgraphError } = subgraphUseQueryResponse
  subgraphIsFetched = subgraphUseQueryResponse.isFetched
  if (rpcError || (rpcIsFetched && !userTicketsData)) {
    userTicketsData = subgraphUseQueryResponse.data
  }

  if (subgraphError) {
    console.error(`error fetching user tickets from subgraphs: `, subgraphError)
  }

  const refetch = async () => {
    rpcUseQueryResponse.refetch()
    subgraphUseQueryResponse.refetch()
  }

  return {
    data: userTicketsData,
    isFetched: rpcIsFetched,
    rpcUseQueryResponse,
    subgraphUseQueryResponse,
    refetch
  }
}

/**
 * Fetches user data across multiple chains
 * @param {*} usersAddress Address of user
 */
export const useUserTicketsByChainIdsRpc = (usersAddress) => {
  const chainIds = useEnvChainIds()
  const { data: poolsKeyedByChainId } = useAllPoolsKeyedByChainId()

  const { data: readProviders, isFetched: readProvidersAreReady } = useReadProviders(chainIds)

  const enabled =
    Boolean(poolsKeyedByChainId) &&
    Boolean(chainIds) &&
    Boolean(usersAddress) &&
    readProvidersAreReady

  return useQuery(
    [QUERY_KEYS.userTicketData, usersAddress, chainIds],
    () => getUserDataRpc(readProviders, usersAddress, chainIds, poolsKeyedByChainId),
    {
      enabled,
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}

/**
 * Fetches user data across multiple chains
 * @param {*} usersAddress Address of user
 * Ex. {
 *  1: ["3.1.0", "3.3.0"],
 *  136: ["3.1.0"]
 * }
 */
export const useUserTicketsByChainIdsSubgraph = (usersAddress, blockNumber = -1) => {
  const subgraphVersionsByChainId = useSubgraphVersions()

  return useQuery(
    [QUERY_KEYS.userData, usersAddress, Object.keys(subgraphVersionsByChainId)],
    () => getUserDataSubgraph(usersAddress, subgraphVersionsByChainId, blockNumber),
    {
      enabled: Boolean(usersAddress),
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}

/**
 * Fetches user data across multiple chains
 * @param {*} usersAddress Address of user
 */
export const useUserTicketsFormattedByPool = (usersAddress) => {
  const { data: poolsKeyedByChainId, ...allPoolsUseQueryResponse } = useAllPoolsKeyedByChainId()

  const { data: userTicketsDataByChainIds, ...userTicketsUseQueryResponse } =
    useUserTicketsByChainIds(usersAddress)

  const formattedTickets = useMemo(
    () => formatTicketsByPool(userTicketsDataByChainIds, poolsKeyedByChainId),
    [userTicketsDataByChainIds, poolsKeyedByChainId]
  )

  const refetch = async () => {
    userTicketsUseQueryResponse.refetch()
    allPoolsUseQueryResponse.refetch()
  }

  return {
    ...userTicketsUseQueryResponse,
    data: formattedTickets,
    isFetched: userTicketsUseQueryResponse.isFetched && allPoolsUseQueryResponse.isFetched,
    refetch
  }
}

// Related hooks

/**
 * Sums the total usd values of all tickets of all of the pools
 * @param {*} playersAddress
 * @returns
 */
export const usePlayerTotalDepositValue = (playersAddress) => {
  const { data: playerTickets, ...playerTicketData } = useUserTicketsFormattedByPool(playersAddress)
  const totalValueUsdScaled =
    playerTickets?.reduce(
      (total, poolTickets) => total.add(poolTickets.total.totalValueUsdScaled),
      ethers.constants.Zero
    ) || ethers.constants.Zero
  return {
    ...playerTicketData,
    data: {
      totalValueUsdScaled,
      totalValueUsd: ethers.utils.formatUnits(totalValueUsdScaled, 2)
    }
  }
}

/**
 * Format player tickets for a single pool
 * @param {*} poolAddress
 * @param {*} playersAddress
 * @returns
 */
export const useUserTicketsByPool = (poolAddress, playersAddress) => {
  const { data, ...response } = useUserTicketsFormattedByPool(playersAddress)
  const poolTicketData = data?.find((poolTicketData) => poolTicketData.poolAddress === poolAddress)
  return {
    ...response,
    ...poolTicketData
  }
}
