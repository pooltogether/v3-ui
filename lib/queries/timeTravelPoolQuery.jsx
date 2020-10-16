import gql from 'graphql-tag'

export const timeTravelPoolQuery = (number) => {
  let blockFilter = ''

  if (number) {
    blockFilter = `, block: { number: ${number} }`
  }

  return gql`
    query timeTravelPoolQuery($prizePoolAddress: ID!) {
      timeTravelPrizePool: prizePool(id: $prizePoolAddress ${blockFilter}) {
        id
        playerCount
        ticketSupply: totalSupply
        # cumulativePrizeNet
      }
    }
  `
}
