import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const TXS = gql`
  query Transactions {
    transactions @client
  }
`

export const useTransactions = function () {
  const { loading, error, data } = useQuery(TXS)
  console.log(data)

  if (loading) {
    return []
  }

  if (error) {
    console.error(error)
  }

  return data.transactions
}
