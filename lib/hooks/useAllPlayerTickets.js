import { ethers } from 'ethers'
import { calculateTokenValues } from 'lib/fetchers/getPools'
import { useMultiversionAccount } from 'lib/hooks/useMultiversionAccount'
import { useAllPools } from 'lib/hooks/usePools'

/**
 * Format player tickets for all pools
 * @param {*} playersAddress
 * @returns
 */
export const useAllPlayerTickets = (playersAddress) => {
  const {
    data: accountData,
    isFetched: accountDataIsFetched,
    refetch: refetchAccountData
  } = useMultiversionAccount(playersAddress)
  const { data: pools, isFetched: poolsIsFetched, refetch: refetchPoolData } = useAllPools()

  const mapPlayerTickets = (controlledTokenBalance) => {
    if (!pools) return null
    const ticketAddress = controlledTokenBalance.id.split('-')[1]
    const pool = pools?.find((pool) => pool.tokens.ticket.address === ticketAddress)
    if (!pool) return null
    const poolAddress = pool.prizePool.address
    const ticketTokenValues = getTicketData(pool.tokens.ticket, accountData)
    const sponsorshipTokenValues = getTicketData(pool.tokens.sponsorship, accountData)
    const combinedValues = combineValues(
      ticketTokenValues,
      sponsorshipTokenValues,
      pool.tokens.ticket.decimals
    )

    return {
      pool,
      poolAddress,
      ticket: ticketTokenValues,
      sponsorship: sponsorshipTokenValues,
      total: combinedValues
    }
  }

  let playerTickets = []
  if (accountDataIsFetched && poolsIsFetched) {
    playerTickets = accountData?.controlledTokenBalances?.map(mapPlayerTickets).filter(Boolean)
  }

  const refetch = () => {
    refetchAccountData()
    refetchPoolData()
  }

  return { data: playerTickets, isFetched: poolsIsFetched && accountDataIsFetched, refetch }
}

/**
 * Format player tickets for a single pool
 * @param {*} poolAddress
 * @param {*} playersAddress
 * @returns
 */
export const usePlayerTicketsByPool = (poolAddress, playersAddress) => {
  const { data, ...response } = useAllPlayerTickets(playersAddress)
  const poolTicketData = data.find((poolTicketData) => poolTicketData.poolAddress === poolAddress)
  return {
    ...response,
    ...poolTicketData
  }
}

/**
 * Sums the total usd values of all tickets of all of the pools
 * @param {*} playersAddress
 * @returns
 */
export const usePlayerTotalDepositValue = (playersAddress) => {
  const { data: playerTickets, ...playerTicketData } = useAllPlayerTickets(playersAddress)
  const totalValueUsdScaled = playerTickets?.reduce(
    (total, poolTickets) => total.add(poolTickets.total.totalValueUsdScaled),
    ethers.constants.Zero
  )
  return {
    ...playerTicketData,
    data: {
      totalValueUsdScaled,
      totalValueUsd: ethers.utils.formatUnits(totalValueUsdScaled, 2)
    }
  }
}

// Utils

const getTicketData = (token, playerData) => {
  if (!playerData) {
    return {
      totalValueUsd: '0',
      totalValueUsdScaled: ethers.constants.Zero,
      amount: '0',
      amountUnformatted: ethers.constants.Zero
    }
  }

  const ticketData = playerData.controlledTokenBalances.find(
    (data) => data.controlledToken.id === token.address
  )

  if (!ticketData) {
    return {
      totalValueUsd: '0',
      totalValueUsdScaled: ethers.constants.Zero,
      amount: '0',
      amountUnformatted: ethers.constants.Zero
    }
  }

  const balanceUnformatted = ethers.BigNumber.from(ticketData.balance)
  return calculateTokenValues(balanceUnformatted, token.usd, token.decimals)
}

const combineValues = (ticket, sponsorship, decimals) => {
  const combinedValues = {
    totalValueUsdScaled: ticket.totalValueUsdScaled.add(sponsorship.totalValueUsdScaled),
    amountUnformatted: ticket.amountUnformatted.add(sponsorship.amountUnformatted)
  }

  combinedValues.totalValueUsd = ethers.utils.formatUnits(combinedValues.totalValueUsdScaled, 2)
  combinedValues.amount = ethers.utils.formatUnits(combinedValues.amountUnformatted, decimals)

  return combinedValues
}
