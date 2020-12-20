import { ethers } from 'ethers'

import { useAccount } from 'lib/hooks/useAccount'
import { usePools } from 'lib/hooks/usePools'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

export function usePlayerTickets(address) {
  const { accountData } = useAccount(address)

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
    let decimals = ctBalance.controlledToken.decimals

    balance = ethers.utils.bigNumberify(balance)

    const balanceNormalized = normalizeTo18Decimals(
      balance,
      decimals
    )

    return {
      pool,
      poolAddress,
      balance,
      balanceNormalized
    }
  }


  // playerData?.prizePoolAccounts.forEach(prizePoolAccount => {
  //   const poolAddress = prizePoolAccount?.prizePool?.id
  //   const pool = pools?.find(pool => pool.poolAddress === poolAddress)
  //   if (!pool) return

  //   const ticketAddress = pool?.ticketToken?.id
  //   let balance = playerData?.controlledTokenBalances.find(ct => ct.controlledToken.id === ticketAddress)?.balance
  //   if (!balance) return

  //   const decimals = parseInt(pool?.underlyingCollateralDecimals, 10)
  //   balance = ethers.utils.bigNumberify(balance)

  //   const balanceNormalized = normalizeTo18Decimals(
  //     balance,
  //     decimals
  //   )

  //   totalTickets = totalTickets.add(balanceNormalized)
  // })

  let playerTickets = []
  playerTickets = pools
    .map(mapPlayerTickets)
    .filter(playerTicket => playerTicket !== undefined)

  return { playerTickets }
}
