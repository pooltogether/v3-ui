import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { usePools } from 'lib/hooks/usePools'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolList } from 'lib/components/PoolList'
import { Tagline } from 'lib/components/Tagline'
import { V2MessageLarge } from 'lib/components/V2MessageLarge'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

export const IndexUI = (
  props,
) => {
  const { t } = useTranslation()
  
  const { loading, pools } = usePools()

  let totalPrizes = ethers.utils.bigNumberify(0)
  pools?.forEach(_pool => {
    const decimals = _pool?.underlyingCollateralDecimals

    const cumulativePrizeAmountsForPool = normalizeTo18Decimals(
      _pool.totalPrizeAmountUSD,
      decimals
    )

    totalPrizes = totalPrizes.add(
      cumulativePrizeAmountsForPool
    )
  })

  return <>
    <V2MessageLarge />

    <PageTitleAndBreadcrumbs
      title={`${t('pools')}`}
      breadcrumbs={[]}
    />

    {loading ?
      <IndexUILoader /> :
      <PoolList
        pools={pools}
      />
    }

    <Tagline />
  </>
}
