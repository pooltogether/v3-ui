import gql from 'graphql-tag'

export const erc20BalanceFragment = gql`
  fragment erc20BalanceFragment on ERC20BalanceFragment {
    id
    balance
    erc20Entity {
      id
      name
      decimals
    }
  }
`
