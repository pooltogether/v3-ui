import gql from 'graphql-tag'

// export const transactionFragment = gql`
//   fragment transactionFragment on Transaction {
//     __typename
//     id
//     name
//     ethersTx
//     completed
//     hash
//     chainId
//     sent
//     inWallet
//     method
//   }
// `

export const coingeckoQuery = gql`
  query coingeckoQuery {
    coingeckoData @client
  }
`
