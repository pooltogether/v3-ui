import gql from 'graphql-tag'

export const erc1155BalanceFragment = gql`
  fragment erc1155BalanceFragment on ERC1155BalanceFragment {
    id
    balance
    tokenId
    lootbox
    erc1155Entity {
      id
    }
  }
`
