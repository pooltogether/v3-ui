import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useSubgraphVersions } from 'lib/hooks/useSubgraphVersions'
import { useAllPoolsKeyedByChainId } from 'lib/hooks/usePools'
import { formatTicketsByPool, getUserDataSubgraph } from 'lib/utils/useUserTicketsUtils'

/**
 * Fetches user data across multiple chains
 * @param {*} usersAddress Address of user
 * Ex. {
 *  1: ["3.1.0", "3.3.0"],
 *  136: ["3.1.0"]
 * }
 */
export const useUserTicketsByChainIds = (usersAddress, blockNumber = -1) => {
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

// Variants

/**
 * Flattened list of users tickets without chain information
 * @param {*} usersAddress
 * @param {*} blockNumber
 * @returns
 */
export const useUserTickets = (usersAddress, blockNumber = -1) => {
  const { data: userTicketsByChainIds, ...useQueryResponse } = useUserTicketsByChainIds(
    usersAddress,
    blockNumber
  )

  return {
    ...useQueryResponse,
    data: userTicketsByChainIds ? Object.values(userTicketsByChainIds).flat() : null
  }
}

/**
 * Fetches user data across multiple chains
 * @param {*} usersAddress Address of user
 * Ex. {
 *  1: ["3.1.0", "3.3.0"],
 *  137: ["3.1.0"]
 * }
 */
export const useUserTicketsFormattedByPool = (usersAddress, blockNumber = -1) => {
  const { data: poolsKeyedByChainId, ...allPoolsUseQueryResponse } = useAllPoolsKeyedByChainId()

  const { data: userTicketsDataByChainIds, ...userTicketsUseQueryResponse } =
    useUserTicketsByChainIds(usersAddress, blockNumber)

  const formattedTickets = useMemo(
    () => formatTicketsByPool(userTicketsDataByChainIds, poolsKeyedByChainId),
    [userTicketsDataByChainIds, poolsKeyedByChainId]
  )
  console.log({ formattedTickets })

  const refetch = async () => {
    userTicketsUseQueryResponse.refetch()
    allPoolsUseQueryResponse.refetch()
  }

  return {
    ...userTicketsUseQueryResponse,
    data: formattedTickets,
    isFetched: userTicketsUseQueryResponse.isFetched && allPoolsUseQueryResponse.isFetched,
    isFetching: userTicketsUseQueryResponse.isFetching && allPoolsUseQueryResponse.isFetching,
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
