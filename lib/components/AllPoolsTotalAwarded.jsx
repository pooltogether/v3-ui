import React, { useContext } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

export const AllPoolsTotalAwarded = (
  props,
) => {
  const poolData = useContext(PoolDataContext)
  const { pools } = poolData

  let cumulativePrizeNetAllPools = ethers.utils.bigNumberify(0)
  pools?.forEach(pool => {
    const decimals = pool?.underlyingCollateralDecimals
    const cumulativePrizeNetForPool = normalizeTo18Decimals(
      pool.cumulativePrizeNet,
      decimals
    )

    cumulativePrizeNetAllPools = cumulativePrizeNetAllPools.add(
      cumulativePrizeNetForPool
    )
  })
 
  return <>
    <div
      className='text-inverse mt-12 pb-40 text-center'
    >
      <h4>
        Total awarded for all pools: <span className='text-flashy'>${displayAmountInEther(
          cumulativePrizeNetAllPools,
          { decimals: 18, precision: 2 }
        )}
        </span>
      </h4>
    </div>
  </>
}
