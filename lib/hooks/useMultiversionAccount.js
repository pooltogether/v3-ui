import { useAccountQuery } from 'lib/hooks/useAccountQuery'

const deepmerge = require('deepmerge')

export function useMultiversionAccount(address, blockNumber = -1) {
  // 3.1.0
  const version310 = '3.1.0'
  const {
    refetch: accountData310Refetch,
    data: accountData310,
    error: accountData310Error,
    isFetched: accountData310IsFetched
  } = useAccountQuery(address, version310, blockNumber)

  if (accountData310Error) {
    console.error(accountData310Error)
  }

  // 3.3.2
  const version332 = '3.3.2'
  let {
    refetch: accountData332Refetch,
    data: accountData332,
    error: accountData332Error,
    isFetched: accountData332IsFetched
  } = useAccountQuery(address, version332, blockNumber)

  if (accountData332Error) {
    console.error(accountData332Error)
  }

  // All Versions Combined
  const accountDataIsFetched = accountData310IsFetched && accountData332IsFetched

  const accountGraphData = accountDataIsFetched ? deepmerge(accountData310, accountData332) : {}

  const refetchAccountData = () => {
    accountData310Refetch()
    accountData332Refetch()
  }

  return {
    refetchAccountData,
    accountData: accountGraphData,
    accountDataIsFetched
  }
}
