import gql from 'graphql-tag'

import { playerFragment } from 'lib/fragments/playerFragment'

export const prizeFragment = gql`
  fragment prizeFragment on Prize {
    id

    awardedTimestamp
    balance
    # amount
    prize
    # reserveFee

    prizePeriodStartedAt
    # prizePeriodStartedTimestamp

    winners {
      ...playerFragment
    }
  }
  ${playerFragment}
`
