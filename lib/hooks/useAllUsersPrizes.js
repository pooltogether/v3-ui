import { useQuery } from 'react-query'

import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useAllPools } from 'lib/hooks/usePools'
import { playerPrizesQuery } from 'lib/queries/playerPrizesQuery'
import { getSubgraphClientFromChainIdAndVersion } from 'lib/utils/getSubgraphClients'
import { useSubgraphVersions } from 'lib/hooks/useSubgraphVersions'

/**
 * Fetches a users won prizes across all pools on all networks
 * @param {*} usersAddress
 * @returns
 */
export const useAllUsersPrizes = (usersAddress) => {
  const subgraphVersionsByChainId = useSubgraphVersions()

  const chainIds = Object.keys(subgraphVersionsByChainId)

  return useQuery(
    [QUERY_KEYS.allUsersPrizesQuery, chainIds, usersAddress],
    () => getAllUsersPrizes(usersAddress, subgraphVersionsByChainId),
    {
      enabled: Boolean(usersAddress)
    }
  )
}

// Array Fetcher

const getAllUsersPrizes = (usersAddress, subgraphVersionsByChainId) => {
  const chainIds = Object.keys(subgraphVersionsByChainId)

  return Promise.all(
    chainIds
      .map((chainId) => {
        const subgraphVersions = subgraphVersionsByChainId[chainId]
        return subgraphVersions.map((subgraphVersion) =>
          getUsersPrizes(chainId, subgraphVersion, usersAddress)
        )
      })
      .flat()
  )
}

// Singular Fetcher

const getUsersPrizes = async (chainId, subgraphVersion, usersAddress) => {
  const graphQLClient = getSubgraphClientFromChainIdAndVersion(chainId, subgraphVersion)
  const query = playerPrizesQuery()

  const variables = {
    playerAddress: usersAddress
  }

  try {
    return await graphQLClient.request(query, variables).then((prize) => ({
      chainId,
      subgraphVersion,
      ...prize
    }))
  } catch (error) {
    console.error(error)
    return null
  }
}
