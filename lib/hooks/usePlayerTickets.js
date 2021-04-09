import { ethers } from 'ethers'
import { useAllPools } from 'lib/hooks/usePools'

import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

export function usePlayerTickets(accountData) {
  const { data: pools } = useAllPools()

  const mapPlayerTickets = (controlledTokenBalance) => {
    const ticketAddress = controlledTokenBalance.id.split('-')[1]

    let pool = pools?.find((pool) => pool.tokens.ticket.address === ticketAddress)
    if (!pool) return

    const poolAddress = pool.prizePool.address

    let balance = controlledTokenBalance.balance
    let decimals = pool.tokens.underlyingToken.decimals

    balance = ethers.BigNumber.from(balance)

    const balanceNormalized = normalizeTo18Decimals(balance, decimals)

    const balanceFormatted =
      balance && decimals ? ethers.utils.formatUnits(balance, parseInt(decimals, 10)) : ''

    return {
      pool,
      poolAddress,
      balance,
      balanceNormalized,
      balanceFormatted
    }
  }

  let playerTickets = []
  if (accountData?.controlledTokenBalances) {
    playerTickets = accountData?.controlledTokenBalances
      .map(mapPlayerTickets)
      .filter((playerTicket) => playerTicket !== undefined)
  }

  return { playerTickets }
}
