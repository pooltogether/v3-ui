import { useAccount } from 'lib/hooks/useAccount'

import { getUsersSponsorshipBalance } from 'lib/services/getUsersSponsorshipBalance'
import { getUsersTicketBalance } from 'lib/services/getUsersTicketBalance'

export function usePlayerPoolBalances(address, pool) {
  const { accountData } = useAccount(address)

  const { usersTicketBalance, usersTicketBalanceBN } = getUsersTicketBalance(pool, accountData)

  const { usersSponsorshipBalance, usersSponsorshipBalanceBN } = getUsersSponsorshipBalance(
    pool,
    accountData
  )

  return {
    usersTicketBalance,
    usersTicketBalanceBN,
    usersSponsorshipBalance,
    usersSponsorshipBalanceBN,
  }
}
