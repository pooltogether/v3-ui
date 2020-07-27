import React from 'react'
import { ethers } from 'ethers'

import { PoolCountUp } from 'lib/components/PoolCountUp'
// import { displayUsersChance } from 'lib/utils/displayUsersChance'

export const Odds = (props) => {
  const { pool, usersBalance } = props
  // console.log({pool})
  // console.log({ usersBalance})

  const underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals
  const totalSupply = pool && pool.totalSupply

  let totalSupplyFloat
  if (totalSupply) {
    totalSupplyFloat = Number(ethers.utils.formatUnits(
      totalSupply,
      underlyingCollateralDecimals
    ))
  }


  // for now ...
  const postPurchaseBalance = usersBalance

  const result = totalSupplyFloat / postPurchaseBalance
  
  return <>
    Odds of winning: <PoolCountUp
      end={1}
      decimals={0}
    /> in <PoolCountUp
      end={result}
    />
  </>
}
