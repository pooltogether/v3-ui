import gql from 'graphql-tag'

export const prizePlayersQuery = (number) => {
  let blockFilter = ''

  if (number > 0) {
    blockFilter = `, block: { number: ${number} }`
  }

  return gql`
    query prizePlayersQuery($prizePoolAddress: ID!, $first: Int!, $skip: Int!) {
      prizePoolAccounts(
        first: $first,
        skip: $skip,
        orderBy: balance,
        orderDirection: desc,
        where: { prizePool: $prizePoolAddress }${blockFilter}
      ) {
        id

        prizePool {
          id
        }

        account {
          id
          controlledTokenBalances {
            balance
            controlledToken {
              id
              name
              decimals
            }
          }
        }

        timelockedBalance
        unlockTimestamp
        cumulativeWinnings
      }
    }
  `
}
