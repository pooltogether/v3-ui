import gql from 'graphql-tag'

export const controlledTokenBalancesQuery = (number) => {
  let blockFilter = ''

  if (number > 0) {
    blockFilter = `, block: { number: ${number} }`
  }

  return gql`
    query controlledTokenBalancesQuery($ticketAddress: ID!, $first: Int!, $skip: Int!) {
      controlledTokens(where: { id: $ticketAddress }) {
        id
        balances {
          account {
            id
          }
          balance
        }
      }
    }
  `
}
