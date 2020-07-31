import { useQuery } from '@apollo/client'

import { transactionsQuery } from 'lib/queries/transactionsQuery'

export const useTransactions = function () {
  const { loading, error, data } = useQuery(transactionsQuery)

  if (loading) {
    return []
  }

  if (error) {
    console.error(error)
  }

  const transactions = data.transactions
  const wrong = 'hwll'

  return [transactions, wrong]
}
