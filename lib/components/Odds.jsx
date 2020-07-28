import React from 'react'
import { ethers } from 'ethers'

import { PoolCountUp } from 'lib/components/PoolCountUp'

export const Odds = (props) => {
  const { pool, usersBalance } = props
  let { additionalQuantity } = props

  if (!pool) {
    return null
  }

  const hasBalance = !isNaN(usersBalance) && usersBalance > 0

  const underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals
  const totalSupply = pool && pool.totalSupply

  let totalSupplyFloat
  if (totalSupply) {
    totalSupplyFloat = Number(ethers.utils.formatUnits(
      totalSupply,
      underlyingCollateralDecimals
    ))
  }

  additionalQuantity = Number(additionalQuantity)
  const hasAdditionalQuantity = !isNaN(additionalQuantity) && additionalQuantity > 0

  let postPurchaseBalance = usersBalance
  if (hasAdditionalQuantity) {
    postPurchaseBalance = usersBalance + additionalQuantity
    totalSupplyFloat = totalSupplyFloat + additionalQuantity
  }

  const result = totalSupplyFloat / postPurchaseBalance

  if (hasBalance || hasAdditionalQuantity) {
    return <>
      {hasAdditionalQuantity && additionalQuantity > 0 ? <>
        New o
      </> : <>O</>}dds of winning: <span
        className='font-number font-bold'
      >1</span> in <PoolCountUp
        start={result}
        end={result}
      />
    </>
  } else {
    return null
  }
}
