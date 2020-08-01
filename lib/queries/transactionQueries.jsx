import gql from 'graphql-tag'

export const transactionFragment = gql`
  fragment transactionFragment on Transaction {
    # __typename: 'Transaction',
    id
    name
    completed
    hash
    chainId
    sent
    inWallet
  }
`

export const transactionsQuery = gql`
  query transactionsQuery($method: String) {
    transactions(where: { method: $method }) @client # {
      # ...transactionFragment
    # }
  }
  # ${transactionFragment}
`

export const transactionQueryById = gql`
  query transactionQueryById($id: String) {
    transaction(where: { id: $id }) @client
  }
`
  
export const transactionQueryByHash = gql`
  query transactionQueryByHash($hash: String) {
    transaction(where: { hash: $hash }) @client
  }
`
