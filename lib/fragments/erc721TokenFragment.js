import gql from 'graphql-tag'

export const erc721TokenFragment = gql`
  fragment erc721TokenFragment on ERC721TokenFragment {
    id
    tokenId
    erc721Entity {
      id
      isLootBox
      name
      uri
    }
  }
`
