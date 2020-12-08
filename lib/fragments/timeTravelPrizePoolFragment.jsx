import gql from 'graphql-tag'

import { controlledTokenFragment } from 'lib/fragments/controlledTokenFragment'
import { prizePoolAccountFragment } from 'lib/fragments/prizePoolAccountFragment'
import { prizeStrategyFragment } from 'lib/fragments/prizeStrategyFragment'
import { timeTravelPrizeStrategyFragment } from 'lib/fragments/timeTravelPrizeStrategyFragment'

// this looks the same as prizePoolFragment but due to the way Apollo caches and the way
// graphql works, this is unique from prizePoolFragment
export const timeTravelPrizePoolFragment = gql`
  fragment timeTravelPrizePoolFragment on PrizePool {
    id

    prizeStrategy {
      ...prizeStrategyFragment
    }

    # prizePoolType
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

    cumulativePrizeNet

    currentPrizeId
    currentState

    prizesCount

    prizePoolAccounts {
      ...prizePoolAccountFragment
    }
    controlledTokens {
      ...controlledTokenFragment
    }
  }
  ${prizeStrategyFragment}
  ${prizePoolAccountFragment}
  ${controlledTokenFragment}
`
