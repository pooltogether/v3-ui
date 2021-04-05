import { ethers } from 'ethers'

import { usePools_OLD } from 'lib/hooks/usePools_OLD'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

export function usePlayerTickets(accountData) {
  const { pools, communityPools } = usePools_OLD()

  const mapPlayerTickets = (controlledTokenBalance) => {
    const ticketAddress = controlledTokenBalance.id.split('-')[1]

    let pool = pools?.find((pool) => pool?.ticket?.id === ticketAddress)

    if (!pool) {
      pool = communityPools?.find((pool) => pool?.ticket?.id === ticketAddress)
    }

    if (!pool) return

    const poolAddress = pool.id

    let balance = controlledTokenBalance.balance
    let decimals = pool.underlyingCollateralDecimals

    balance = ethers.BigNumber.from(balance)

    const balanceNormalized = normalizeTo18Decimals(balance, decimals)

    const balanceFormatted =
      balance && pool.underlyingCollateralDecimals
        ? ethers.utils.formatUnits(balance, parseInt(pool.underlyingCollateralDecimals, 10))
        : ''

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
