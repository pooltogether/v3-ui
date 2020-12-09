import gql from 'graphql-tag'

export const controlledTokenBalancesQuery = (number) => {
  let blockFilter = ''

  if (number > 0) {
    blockFilter = `, block: { number: ${number} }`
  }

  return gql`
    query controlledTokenBalancesQuery($ticketAddress: ID!, $first: Int!, $skip: Int!) {
      controlledTokenBalances(
        first: $first,
        skip: $skip,
        orderBy: balance,
        orderDirection: desc,
        where: { controlledToken: $ticketAddress }${blockFilter}
      ) {
        balance
        account {
          id
        }
      }
    }
  `
}
