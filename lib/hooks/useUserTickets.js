import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useWalletChainId } from 'lib/hooks/chainId/useWalletChainId'
import { getSubgraphClientFromVersions } from 'lib/utils/getSubgraphClients'
import { accountQuery } from 'lib/queries/accountQuery'
import { useQuery } from 'react-query'
import { useSubgraphVersions } from 'lib/hooks/useSubgraphVersions'
import { useContext, useMemo } from 'react'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { formatUnits } from '@ethersproject/units'
import { useAllPools, useAllPoolsKeyedByChainId } from 'lib/hooks/usePools'
import { calculateTokenValues } from 'lib/utils/poolDataUtils'
import { ethers } from 'ethers'

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
  return useQuery(
    [QUERY_KEYS.userData, Object.keys(subgraphVersionsByChainId)],
    () => getUserData(usersAddress, subgraphVersionsByChainId, blockNumber),
    {
      enabled: Boolean(usersAddress) && !pauseQueries
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
 *  136: ["3.1.0"]
 * }
 */
export const useUserTicketsFormattedByPool = (usersAddress, blockNumber = -1) => {
  const { data: poolsKeyedByChainId, ...allPoolsUseQueryResponse } = useAllPoolsKeyedByChainId()

  const {
    data: userTicketsDataByChainIds,
    ...userTicketsUseQueryResponse
  } = useUserTicketsByChainIds(usersAddress, blockNumber)

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

// Tools

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

    userTicketDatas.forEach((userTicketData) =>
      userTicketData.controlledTokenBalances.forEach((token) => {
        formattedTicketData[chainId].push({
          chainId,
          amountUnformatted: ethers.BigNumber.from(token.balance),
          amount: formatUnits(token.balance, token.controlledToken.decimals),
          totalSupplyUnformatted: ethers.BigNumber.from(token.controlledToken.totalSupply),
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

  return formattedTicketData
}

const formatTicketsByPool = (userTicketsDataByChainIds, poolsByChainIds) => {
  if (!userTicketsDataByChainIds || !poolsByChainIds) return null

  const formattedTickets = []
  Object.keys(poolsByChainIds).forEach((chainId) => {
    const pools = poolsByChainIds[chainId]
    const tickets = userTicketsDataByChainIds[chainId]
    pools.forEach((pool) => {
      const ticketAddress = pool.tokens.ticket.address
      const sponsorshipAddress = pool.tokens.sponsorship.address

      const ticketData = tickets.find((ticket) => ticket.address === ticketAddress)
      const sponsorshipData = tickets.find((ticket) => ticket.address === sponsorshipAddress)

      const formattedTicket = {
        ...ticketData,
        ...calculateTokenValues(
          ticketData?.amountUnformatted || ethers.constants.Zero,
          pool.tokens.ticket.usd,
          pool.tokens.ticket.decimals
        )
      }
      const formattedSponsorship = {
        ...ticketData,
        ...calculateTokenValues(
          sponsorshipData?.amountUnformatted || ethers.constants.Zero,
          pool.tokens.sponsorship.usd,
          pool.tokens.sponsorship.decimals
        )
      }
      const formattedCombined = combineTicketAndSponsorshipValues(
        formattedTicket,
        formattedSponsorship
      )

      if (formattedCombined.amountUnformatted.isZero()) return

      formattedTickets.push({
        pool,
        poolAddress: pool.prizePool.address,
        ticket: formattedTicket,
        sponsorship: formattedSponsorship,
        total: formattedCombined
      })
    })
  })

  return formattedTickets
}

const combineTicketAndSponsorshipValues = (ticket, sponsorship) => {
  const decimals = ticket.decimals
  const combinedValues = {
    totalValueUsdScaled: ticket.totalValueUsdScaled.add(sponsorship.totalValueUsdScaled),
    amountUnformatted: ticket.amountUnformatted.add(sponsorship.amountUnformatted)
  }

  combinedValues.totalValueUsd = ethers.utils.formatUnits(combinedValues.totalValueUsdScaled, 2)
  combinedValues.amount = ethers.utils.formatUnits(combinedValues.amountUnformatted, decimals)

  return combinedValues
}
