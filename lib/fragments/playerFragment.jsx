import gql from 'graphql-tag'

export const playerFragment = gql`
  fragment playerFragment on Player {
    id

    address
    balance

    timelockedBalance
    unlockTimestamp

    cumulativeWinnings
  }
`
