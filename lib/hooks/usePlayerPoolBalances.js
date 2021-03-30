import { useMultiversionAccount } from 'lib/hooks/useMultiversionAccount'

import { getUsersSponsorshipBalance } from 'lib/services/getUsersSponsorshipBalance'
import { getUsersTicketBalance } from 'lib/services/getUsersTicketBalance'

export function usePlayerPoolBalances(address, pool) {
  const { data: accountData } = useMultiversionAccount(address)

  const { usersTicketBalance, usersTicketBalanceBN } = getUsersTicketBalance(pool, accountData)

  const { usersSponsorshipBalance, usersSponsorshipBalanceBN } = getUsersSponsorshipBalance(
    pool,
    accountData
  )

  return {
    usersTicketBalance,
    usersTicketBalanceBN,
    usersSponsorshipBalance,
    usersSponsorshipBalanceBN
  }
}
