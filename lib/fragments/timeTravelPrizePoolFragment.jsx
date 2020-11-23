import gql from 'graphql-tag'

import { timeTravelPrizeStrategyFragment } from 'lib/fragments/timeTravelPrizeStrategyFragment'

// this looks the same as prizePoolFragment but due to the way Apollo caches and the way
// graphql works, this is unique from prizePoolFragment
export const timeTravelPrizePoolFragment = gql`
  fragment timeTravelPrizePoolFragment on PrizePool {
    id

    prizeStrategy {
      ...timeTravelPrizeStrategyFragment
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
  ${timeTravelPrizeStrategyFragment}
`
