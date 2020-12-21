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

  return <>
    <V2MessageLarge />

    <PageTitleAndBreadcrumbs
      title={`${t('pools')}`}
      breadcrumbs={[]}
    />

    <div>
      <span
        role='img'
        aria-label='megaphone emoji'
      >📣</span> The Uniswap UNI pool is now open! <span
        role='img'
        aria-label='megaphone emoji'
      >📣</span>
    </div>

    {loading ?
      <IndexUILoader /> :
      <PoolList
        pools={pools}
      />
    }

    <Tagline />
  </>
}
