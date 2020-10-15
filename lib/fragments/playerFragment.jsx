import gql from 'graphql-tag'

export const playerFragment = gql`
  fragment playerFragment on Player {
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

export const playerDripTokenFragment = gql`
  fragment playerDripTokenFragment on DripTokenPlayer {
    id
    address
    balance
  }
`

export const playerBalanceDripFragment = gql`
  fragment playerBalanceDripFragment on BalanceDripPlayer {
    id
    address
    # lastExchangeRateMantissa

    balanceDrip {
      id

      # prizePool {
      #   id
      # }

      dripRatePerSecond
      exchangeRateMantissa
      timestamp
      deactivated

      measureToken
      dripToken
    }
  }
`

export const playerVolumeDripFragment = gql`
  fragment playerVolumeDripFragment on VolumeDripPlayer {
    id
    address
    periodIndex
    balance

    volumeDrip {
      id

      measureToken
      dripToken

      # prizePool {
      #   id
      # }

      referral
      periodSeconds
      dripAmount
      
      periodCount
      deactivated
    }
  }
`
