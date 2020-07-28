import React from 'react'
import { ethers } from 'ethers'

import { PoolCountUp } from 'lib/components/PoolCountUp'

export const Odds = (props) => {
  const { splitLines, isWithdraw, hide, pool, usersBalance } = props
  let { additionalQuantity } = props

  let content = null

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
  if (isWithdraw && !isFinite(result)) {
    content = <>Withdrawing everything will make you ineligible to win</>
  } else if (!hide && (hasBalance || hasAdditionalQuantity)) {
    content = <>
      {hasAdditionalQuantity && additionalQuantity !== 0 ? <>
        New o
      </> : <>O</>}dds of winning: {splitLines && <br />}<span
        className='font-number font-bold'
      >1</span> in <PoolCountUp
        start={result}
        end={result}
      />
    </>
  }

  return <div style={{
    minHeight: 24
  }}>
    {content}
  </div>
}
