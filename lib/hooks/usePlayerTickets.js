import { ethers } from 'ethers'

import { usePools } from 'lib/hooks/usePools'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

export function usePlayerTickets(accountData) {
  const { pools, poolsGraphData } = usePools()

  const mapPlayerTickets = (poolInfo) => {
    const pool = {
      symbol: poolInfo.symbol,
      ...poolsGraphData[poolInfo.symbol]
    }
    const poolAddress = poolInfo.id.toLowerCase()
    const ticketAddress = pool?.ticketToken?.id?.toLowerCase()
    if (!ticketAddress) return

    let ctBalance = accountData
      ?.controlledTokenBalances
      .find(ct => ct.controlledToken.id === ticketAddress)

    if (!ctBalance) return

    let balance = ctBalance.balance
    let decimals = pool.underlyingCollateralDecimals

    balance = ethers.utils.bigNumberify(balance)

    const balanceNormalized = normalizeTo18Decimals(
      balance,
      decimals
    )
    
    const balanceFormatted = balanceNormalized && pool.underlyingCollateralDecimals ?
      ethers.utils.formatUnits(
        balanceNormalized,
        parseInt(pool.underlyingCollateralDecimals, 10)
      ) :
      ''

    return {
      pool,
      poolAddress,
      balance,
      balanceNormalized,
      balanceFormatted
    }
  }

  let playerTickets = []
  playerTickets = pools
    .map(mapPlayerTickets)
    .filter(playerTicket => playerTicket !== undefined)

  return { playerTickets }
}
