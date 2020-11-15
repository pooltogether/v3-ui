import gql from 'graphql-tag'

import { prizeStrategyFragment } from 'lib/fragments/prizeStrategyFragment'

export const prizePoolFragment = gql`
  fragment prizePoolFragment on PrizePool {
    id

    prizeStrategy {
      ...prizeStrategyFragment
    }

    prizePoolType
    compoundPrizePool {
      id
      cToken
    }

    underlyingCollateralToken
    underlyingCollateralDecimals
    underlyingCollateralName
    underlyingCollateralSymbol

    maxExitFeeMantissa
    maxTimelockDuration
    timelockTotalSupply
    liquidityCap

    playerCount
    ticketSupply: totalSupply

    cumulativePrizeNet

    currentPrizeId
    currentState

    prizesCount
  }
  ${prizeStrategyFragment}
`
