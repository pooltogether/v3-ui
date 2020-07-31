import gql from 'graphql-tag'

export const transactionsQuery = gql`
  query transactionsQuery($method: String) {
    transactions(where: { method: $method }) @client
  }
`

export const transactionQuery = gql`
  query transactionQuery($txHash: String) {
    transaction(where: { txHash: $txHash }) @client
  }
`
