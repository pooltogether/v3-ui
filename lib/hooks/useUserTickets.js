import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useWalletChainId } from 'lib/hooks/useWalletChainId'
import {
  getSubgraphClientFromVersions,
  getSubgraphClientsByVersionFromContracts
} from 'lib/hooks/useSubgraphClients'
import { accountQuery } from 'lib/queries/accountQuery'
import { useQuery } from 'react-query'
import { useSubgraphVersions } from 'lib/hooks/useSubgraphVersions'
import { useContext } from 'react'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { formatUnits } from '@ethersproject/units'
import { useAllPools } from 'lib/hooks/usePools'

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
  const { pauseQueries } = useContext(AuthControllerContext)

  const { data: pools, ...allPoolsUseQueryResponse } = useAllPools()

  const { data: userTicketsData, ...userTicketsUseQueryResponse } = useQuery(
    [QUERY_KEYS.userData, Object.keys(subgraphVersionsByChainId)],
    () => getUserData(usersAddress, subgraphVersionsByChainId, blockNumber),
    {
      enabled: Boolean(usersAddress) && !pauseQueries
    }
  )

  const refetch = async () => {
    userTicketsUseQueryResponse.refetch()
    allPoolsUseQueryResponse.refetch()
  }

  return {
    ...userTicketsUseQueryResponse,
    isFetched: userTicketsUseQueryResponse.isFetched && allPoolsUseQueryResponse.isFetched,
    isFetching: userTicketsUseQueryResponse.isFetching && allPoolsUseQueryResponse.isFetching,
    refetch
  }
}

const getUserData = async (usersAddress, subgraphVersionsByChainId, blockNumber) => {
  const query = accountQuery(blockNumber)
  const variables = {
    accountAddress: usersAddress
  }

  const chainIds = Object.keys(subgraphVersionsByChainId)
  const promises = []

  chainIds.forEach((chainId) => {
    const subgraphVersions = subgraphVersionsByChainId[chainId]
    const subgraphClients = getSubgraphClientFromVersions(chainId, subgraphVersions)

    subgraphVersions.forEach((version) => {
      const client = subgraphClients[version]
      promises.push(
        client
          .request(query, variables)
          .then((d) => ({ [chainId]: d?.account }))
          .catch((e) => {
            console.error(e.message)
            debugger
            return null
          })
      )
    })
  })

  const ticketData = await Promise.all(promises)

  const formattedTicketData = {}
  chainIds.forEach((chainId) => {
    const userTicketDatas = ticketData
      .filter((ticketData) => {
        const dataChainId = Object.keys(ticketData)[0]
        return dataChainId === chainId
      })
      .map((ticketData) => ticketData[chainId])
      .filter(Boolean)
    formattedTicketData[chainId] = []

    debugger

    userTicketDatas.forEach((userTicketData) =>
      userTicketData.controlledTokenBalances.forEach((token) => {
        formattedTicketData[chainId].push({
          chainId,
          balanceUnformatted: token.balance,
          balance: formatUnits(token.balance, token.controlledToken.decimals),
          totalSupplyUnformatted: token.controlledToken.totalSupply,
          totalSupply: formatUnits(
            token.controlledToken.totalSupply,
            token.controlledToken.decimals
          ),
          decimals: token.controlledToken.decimals,
          address: token.controlledToken.id,
          name: token.controlledToken.name,
          numberOfHolders: token.controlledToken.numberOfHolders
        })
      })
    )
  })

  console.log(ticketData, formattedTicketData)
  return formattedTicketData
}

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
    data: userTicketsByChainIds?.map((userTickets) => Object.values(userTickets))
  }
}
