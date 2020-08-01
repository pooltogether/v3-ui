import { useQuery } from '@apollo/client'

import { transactionsQuery } from 'lib/queries/transactionQueries'

export const useTransactions = function () {
  const { loading, error, data } = useQuery(transactionsQuery)

  if (loading) {
    return []
  }

  if (error) {
    console.error(error)
  }

  const transactions = data.transactions

  return [transactions]
}
