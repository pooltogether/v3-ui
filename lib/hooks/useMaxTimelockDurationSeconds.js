import { useQuery } from 'react-query'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts_3_4/abis/PrizePool'
import { batch, contract } from '@pooltogether/etherplex'
import { useReadProvider, useUsersAddress } from '@pooltogether/hooks'

import { useUserTicketsByPool } from 'lib/hooks/useUserTickets'
import { QUERY_KEYS } from 'lib/constants/queryKeys'

/**
 * This is a workaround since 3.4.X prize pool contracts removed maxTimelockDuration from the schema.
 * If the contract sungraph version is < 3.4.3 just return `maxTimelockDuration` from the pool returned from the API.
 * @param {*} pool
 * @returns
 */
export const useMaxTimelockDurationSeconds = (pool, exitFee) => {
  const { readProvider, isReadProviderReady } = useReadProvider(pool.chainId)
  const usersAddress = useUsersAddress()
  const prizePoolAddress = pool.prizePool.address
  const ticketAddress = pool.tokens.ticket.address

  const { ticket: usersTicketData, isFetched } = useUserTicketsByPool(
    pool.prizePool.address,
    usersAddress
  )

  const enabled = isReadProviderReady && isFetched && Boolean(exitFee)

  return useQuery(
    [
      QUERY_KEYS.getMaxTimelockDuration,
      usersAddress,
      prizePoolAddress,
      ticketAddress,
      exitFee?.toString()
    ],
    () => getMaxTimelockDurationSeconds(readProvider, pool, exitFee, usersTicketData),
    {
      enabled,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false
    }
  )
}

const getMaxTimelockDurationSeconds = async (provider, pool, exitFee, usersTicketData) => {
  let maxTimelockDurationSeconds = pool.config.maxTimelockDurationSeconds
  if (maxTimelockDurationSeconds) return maxTimelockDurationSeconds

  const prizePoolAddress = pool.prizePool.address
  const ticketAddress = pool.tokens.ticket.address
  const principal = usersTicketData.amountUnformatted
  const interest = exitFee

  const prizePoolContract = contract(prizePoolAddress, PrizePoolAbi, prizePoolAddress)

  const response = await batch(
    provider,
    prizePoolContract.estimateCreditAccrualTime(ticketAddress, principal, interest)
  )

  return response[prizePoolAddress].estimateCreditAccrualTime[0].toString()
}
