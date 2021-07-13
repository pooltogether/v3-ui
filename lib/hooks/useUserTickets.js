import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { formatUnits } from '@ethersproject/units'
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'
import { isEmpty } from 'lodash'

import ERC20Abi from 'lib/../abis/ERC20Abi'
import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useEnvChainIds } from 'lib/hooks/chainId/useEnvChainIds'
import { useAllPoolsKeyedByChainId } from 'lib/hooks/usePools'
import { useReadProvider, useReadProviders } from 'lib/hooks/providers/useReadProvider'
import { accountQuery } from 'lib/queries/accountQuery'
import { calculateTokenValues } from 'lib/utils/poolDataUtils'

/**
 * Fetches user data across multiple chains
 * @param {*} usersAddress Address of user
 */
export const useUserTicketsByChainIds = (usersAddress) => {
  const chainIds = useEnvChainIds()
  const { data: poolsKeyedByChainId } = useAllPoolsKeyedByChainId()

  const { data: readProviders, isFetched: readProvidersAreReady } = useReadProviders(chainIds)

  const enabled = Boolean(chainIds) && Boolean(usersAddress) && readProvidersAreReady

  return useQuery(
    [QUERY_KEYS.userTicketData, usersAddress, chainIds],
    () => getUserData(readProviders, usersAddress, chainIds, poolsKeyedByChainId),
    {
      enabled,
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}

// Variants

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

const _ticketKey = (ticket) => {
  return `pool-${ticket}-ticket`
}

const _sponsorshipKey = (sponsorship) => {
  return `pool-${sponsorship}-sponsorship`
}

const getUserData = async (readProviders, usersAddress, chainIds, poolsKeyedByChainId) => {
  let batchCalls = []
  let ticketValues = {}
  let ticketData
  let formattedTicketData = {}

  chainIds.forEach(async (chainId) => {
    const readProvider = readProviders[chainId]
    if (!readProvider) {
      console.warn('exiting early!')
      console.warn('exiting early!')
      console.warn('exiting early!')
      console.warn('exiting early!')
      return
    }
    console.warn(readProvider)

    const pools = poolsKeyedByChainId[chainId]

    pools.forEach((pool) => {
      const ticketAddress = pool.tokens.ticket.address
      const sponsorshipAddress = pool.tokens.sponsorship.address
      const etherplexTicketContract = contract(_ticketKey(ticketAddress), ERC20Abi, ticketAddress)
      const etherplexSponsorshipContract = contract(
        _sponsorshipKey(sponsorshipAddress),
        ERC20Abi,
        sponsorshipAddress
      )

      batchCalls.push(etherplexTicketContract.balanceOf(usersAddress))
      batchCalls.push(etherplexSponsorshipContract.balanceOf(usersAddress))
      // batchCalls.push(etherplexTicketContract.balanceOf(usersAddress).decimals.totalSupply)
      // batchCalls.push(etherplexSponsorshipContract.balanceOf(usersAddress).decimals.totalSupply)
    })

    ticketData = await batch(readProvider, ...batchCalls)
    console.log({ ticketData })
  })

  if (ticketData) {
    chainIds.forEach((chainId) => {
      const userTicketDatas = ticketData
        .filter((ticketData) => {
          const dataChainId = Object.keys(ticketData)[0]
          console.log({ dataChainId })
          return dataChainId === chainId
        })
        .map((ticketData) => ticketData[chainId])
        .filter(Boolean)
      formattedTicketData[chainId] = []

      userTicketDatas.forEach((userTicketData) => {
        console.log({ userTicketData })
        return null
      })

      // userTicketData.controlledTokenBalances.forEach((token) => {
      //   formattedTicketData[chainId].push({
      //     chainId,
      //     amountUnformatted: ethers.BigNumber.from(token.balanceOf),
      //     amount: formatUnits(token.balanceOf, token.controlledToken.decimals),
      //     totalSupplyUnformatted: ethers.BigNumber.from(token.controlledToken.totalSupply),
      //     totalSupply: formatUnits(
      //       token.controlledToken.totalSupply,
      //       token.controlledToken.decimals
      //     ),
      //     decimals: token.controlledToken.decimals,
      //     address: token.controlledToken.id,
      //     name: token.controlledToken.name,
      //     numberOfHolders: token.controlledToken.numberOfHolders
      //   })
      // })
      // )
    })
  }

  return formattedTicketData
}

const formatTicketsByPool = (userTicketsDataByChainIds, poolsByChainIds) => {
  return null
  if (!userTicketsDataByChainIds || !poolsByChainIds) return null

  const formattedTickets = []
  Object.keys(poolsByChainIds).forEach((chainId) => {
    const pools = poolsByChainIds[chainId]
    const tickets = userTicketsDataByChainIds[chainId]
    pools?.forEach((pool) => {
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
        ...sponsorshipData,
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
