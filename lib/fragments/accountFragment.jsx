import gql from 'graphql-tag'

import { controlledTokenFragment } from 'lib/fragments/controlledTokenFragment'
// import { controlledTokenBalanceFragment } from 'lib/fragments/controlledTokenBalanceFragment'

export const accountFragment = gql`
  fragment accountFragment on Account {
    id

    controlledTokenBalances {
      id
      balance
      controlledToken {
        ...controlledTokenFragment
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
  ${controlledTokenFragment}
`
// ${controlledTokenBalanceFragment}
