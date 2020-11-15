import gql from 'graphql-tag'

export const uniswapTokensQuery = (number) => {
  let blockFilter = ''

  if (number) {
    blockFilter = `, block: { number: ${number} }`
  } 

  return gql`
    query uniswapTokensQuery($ids: [String!]!) {
      tokens(where: { id_in: $ids }${blockFilter}) {
        id
        derivedETH
      }
    }
  `
}
