import gql from 'graphql-tag'

import { playerFragment } from 'lib/fragments/playerFragment'

export const prizeFragment = gql`
  fragment prizeFragment on Prize {
    id

    awardedTimestamp
    gross
    net
    # reserveFee
    awardedBlock

    prizePeriodStartedTimestamp

    winners {
      ...playerFragment
    }
  }
  ${playerFragment}
`
