import React from 'react'
import { ethers } from 'ethers'

import { PoolCountUp } from 'lib/components/PoolCountUp'

export const Odds = (props) => {
  const {
    splitLines,
    isWithdraw,
    hide,
    pool,
    showLabel,
    timeTravelTotalSupply,
    usersBalance,
  } = props
  let { additionalQuantity } = props

  let content = null

  const hasBalance = !isNaN(usersBalance) && usersBalance > 0

  const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals
  const totalSupply = timeTravelTotalSupply || pool?.totalSupply

  let totalSupplyFloat
  if (totalSupply && underlyingCollateralDecimals) {
    totalSupplyFloat = Number(ethers.utils.formatUnits(
      totalSupply,
      Number(underlyingCollateralDecimals)
    ))
  }

  additionalQuantity = isWithdraw ?
    Number(additionalQuantity) * - 1 :
    Number(additionalQuantity)
  const hasAdditionalQuantity = !isNaN(additionalQuantity) && additionalQuantity !== 0

  let postPurchaseBalance = usersBalance
  if (hasAdditionalQuantity) {
    postPurchaseBalance = usersBalance + additionalQuantity
    totalSupplyFloat = totalSupplyFloat + additionalQuantity
  }

  const result = totalSupplyFloat / postPurchaseBalance
  
  let label = showLabel && <>
    {hasAdditionalQuantity && additionalQuantity !== 0 ? <>
      {!isWithdraw && <span className='text-flashy'>New odds of winning:</span>}
      {isWithdraw && 'New odds of winning:'}
    </>
       :
      <>Current odds of winning:</>
    }
  </>

  if (isWithdraw && !isFinite(result)) {
    content = <>Withdrawing everything will make you ineligible to win</>
  } else if (!hide && (hasBalance || hasAdditionalQuantity)) {
    content = <>
      {label} {splitLines && <br />}<span
        className='font-number font-bold'
      >1</span> in <PoolCountUp
        start={result}
        end={result}
      />
    </>
  }

  return <div
    style={{
      minHeight: 24
    }}
  >
    {content}
  </div>
}
