import gql from 'graphql-tag'

export const playerPrizesQuery = () => {
  return gql`
    query playerPrizesQuery($playerAddress: String!) {
      awardedExternalErc721Nfts(where: { winner: $playerAddress }) {
        id
        address
        tokenIds
      }
    }
  `
}
