import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const TXS = gql`
  query Transactions {
    transactions @client
  }
`

export const useIsLoggedIn = function () {
  const { loading, error, data } = useQuery(TXS)
  console.log(loading, error, data)

  if (data && data.isLoggedIn) {
    return data.isLoggedIn
  } else {
    return false
  }
}
