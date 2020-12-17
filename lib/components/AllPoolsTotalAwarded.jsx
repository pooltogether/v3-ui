import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { usePools } from 'lib/hooks/usePools'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

export const AllPoolsTotalAwarded = (
  props,
) => {
  const { t } = useTranslation()

  const { pools } = usePools()

  let cumulativePrizeNetAllPools = ethers.utils.bigNumberify(0)
  pools?.forEach(_pool => {
    if (_pool.cumulativePrizeNet) {
      const decimals = _pool?.underlyingCollateralDecimals

      const cumulativePrizeNetForPool = normalizeTo18Decimals(
        _pool.cumulativePrizeNet,
        decimals
      )

      cumulativePrizeNetAllPools = cumulativePrizeNetAllPools.add(
        cumulativePrizeNetForPool
      )
    }
  })
 
  return <>
    <h4>
      {t('totalAwardedForAllPools')} <span className='text-flashy'>${displayAmountInEther(
        cumulativePrizeNetAllPools,
        { decimals: 18, precision: 2 }
      )}
      </span>
    </h4>
  </>
}
