import gql from 'graphql-tag'

import { controlledTokenBalanceFragment } from 'lib/fragments/controlledTokenBalanceFragment'

export const accountFragment = gql`
  fragment accountFragment on Account {
    id

    controlledTokenBalances {
      id
      balance
      controlledToken {
        id
        name
        symbol
        decimals
      }
    }

    prizePoolAccounts {
      id
      timelockedBalance
      unlockTimestamp

      cumulativeWinnings

      prizePool {
        id
      }
    }
  }
  ${controlledTokenBalanceFragment}
`
