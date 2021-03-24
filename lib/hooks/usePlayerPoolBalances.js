import { useAccountQuery } from 'lib/hooks/useAccountQuery'

import { getUsersSponsorshipBalance } from 'lib/services/getUsersSponsorshipBalance'
import { getUsersTicketBalance } from 'lib/services/getUsersTicketBalance'

export function usePlayerPoolBalances(address, pool) {
  const { data: accountData } = useAccountQuery(address, pool.version)

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
