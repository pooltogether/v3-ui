import { Card } from 'lib/components/Card'
import { useUniswapLPPoolAddress } from 'lib/hooks/useUniswapLPPoolAddress'
import React from 'react'

export const UniswapLPStakingCard = (props) => {
  const poolAddress = useUniswapLPPoolAddress()

  if (!poolAddress) {
    return null
  }

  return <Card></Card>
}
