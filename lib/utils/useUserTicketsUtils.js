import { formatUnits } from '@ethersproject/units'
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'lib/../abis/ERC20Abi'

import { getSubgraphClientFromVersions } from 'lib/utils/getSubgraphClients'
import { accountQuery } from 'lib/queries/accountQuery'
import { calculateTokenValues } from 'lib/utils/poolDataUtils'

const _ticketKey = (ticket) => {
  return `pool-${ticket}-ticket`
}

const _sponsorshipKey = (sponsorship) => {
  return `pool-${sponsorship}-sponsorship`
}

export const getUserDataRpc = async (
  readProviders,
  usersAddress,
  chainIds,
  poolsKeyedByChainId
) => {
  let batchCalls = []
  let ticketValues = {}
  let formattedTicketData = {}

  for (let i = 0; i < chainIds.length; i++) {
    const chainId = chainIds[i]
    const readProvider = readProviders[chainId]
    if (!readProvider) {
      return
    }

    const pools = poolsKeyedByChainId[chainId]
    // console.log(pools)

    pools.forEach((pool) => {
      const ticketAddress = pool.tokens.ticket.address
      const sponsorshipAddress = pool.tokens.sponsorship.address
      const etherplexTicketContract = contract(_ticketKey(ticketAddress), ERC20Abi, ticketAddress)
      const etherplexSponsorshipContract = contract(
        _sponsorshipKey(sponsorshipAddress),
        ERC20Abi,
        sponsorshipAddress
      )

      batchCalls.push(etherplexTicketContract.balanceOf(usersAddress).decimals().totalSupply())
      batchCalls.push(etherplexSponsorshipContract.balanceOf(usersAddress).decimals().totalSupply())
    })

    const batchValues = await batch(readProvider, ...batchCalls)
    ticketValues[chainId] = batchValues
  }

  if (ticketValues) {
    chainIds.forEach((chainId) => {
      formattedTicketData[chainId] = []

      const pools = poolsKeyedByChainId[chainId]

      pools.forEach((pool) => {
        const ticketAddress = pool.tokens.ticket.address
        const sponsorshipAddress = pool.tokens.sponsorship.address
        const userTicketData = ticketValues[chainId][_ticketKey(ticketAddress)]
        const userSponsorshipData = ticketValues[chainId][_sponsorshipKey(sponsorshipAddress)]

        const formatTicketObj = (chainId, ticket, address) => ({
          chainId,
          amountUnformatted: ethers.BigNumber.from(ticket.balanceOf[0]),
          amount: formatUnits(ticket.balanceOf[0], ticket.decimals[0]),
          totalSupplyUnformatted: ethers.BigNumber.from(ticket.totalSupply[0]),
          totalSupply: formatUnits(ticket.totalSupply[0], ticket.decimals[0]),
          decimals: ticket.decimals[0],
          address
          // name: ticket.name[0]
        })

        formattedTicketData[chainId].push(formatTicketObj(chainId, userTicketData, ticketAddress))
        formattedTicketData[chainId].push(
          formatTicketObj(chainId, userSponsorshipData, sponsorshipAddress)
        )
      })

      //     numberOfHolders: token.controlledToken.numberOfHolders
    })
  }

  return formattedTicketData
}

export const getUserDataSubgraph = async (usersAddress, subgraphVersionsByChainId, blockNumber) => {
  const query = accountQuery(blockNumber)
  const variables = {
    accountAddress: usersAddress.toLowerCase()
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

export const formatTicketsByPool = (userTicketsDataByChainIds, poolsByChainIds) => {
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
