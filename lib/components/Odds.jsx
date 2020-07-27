import React from 'react'
import { ethers } from 'ethers'

import { PoolCountUp } from 'lib/components/PoolCountUp'
// import { displayUsersChance } from 'lib/utils/displayUsersChance'

export const Odds = (props) => {
  const { pool, usersBalance, additionalQuantity } = props

  if (!pool || !usersBalance) {
    return ''
  }

  const underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals
  const totalSupply = pool && pool.totalSupply

  let totalSupplyFloat
  if (totalSupply) {
    totalSupplyFloat = Number(ethers.utils.formatUnits(
      totalSupply,
      underlyingCollateralDecimals
    ))
  }

  const hasAdditionalQuantity = !!additionalQuantity && !isNaN(additionalQuantity)

  let postPurchaseBalance = usersBalance
  if (hasAdditionalQuantity) {
    postPurchaseBalance = usersBalance + additionalQuantity
    totalSupplyFloat = totalSupplyFloat + additionalQuantity
  }

  const result = totalSupplyFloat / postPurchaseBalance
  
  return <>
    {hasAdditionalQuantity && additionalQuantity > 0 ? <>
      New o
    </> : <>
      O
    </>}dds of winning: <PoolCountUp
      end={1}
      decimals={0}
    /> in <PoolCountUp
      start={result}
      end={result}
    />
  </>
}
