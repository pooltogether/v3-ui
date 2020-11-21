import gql from 'graphql-tag'

// this looks the same as playerFragment but due to the way Apollo caches and the way
// graphql works, this is unique from playerFragment
export const timeTravelPlayerFragment = gql`
  fragment timeTravelPlayerFragment on Player {
    id

    prizePool {
      id
    }

    address
    balance

    timelockedBalance
    unlockTimestamp

    cumulativeWinnings
  }
`
