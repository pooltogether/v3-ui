import gql from 'graphql-tag'

import { playerFragment } from 'lib/fragments/playerFragment'

export const prizeFragment = gql`
  fragment prizeFragment on Prize {
    id

    balance
    prize
    # reserveFee

    # randomNumber
    # rngRequestId

    prizePeriodStartedAt
    lockBlock
    awardedBlock

    winners {
      ...playerFragment
    }
  }
  ${playerFragment}
`
