import React from 'react'
import Link from 'next/link'

import { useTranslation } from 'lib/../i18n'
import { usePools } from 'lib/hooks/usePools'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolList } from 'lib/components/PoolList'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { Tagline } from 'lib/components/Tagline'
import { V2MessageLarge } from 'lib/components/V2MessageLarge'
import { RetroactivePoolClaimBanner } from 'lib/components/RetroactivePoolClaimBanner'

import UsdcSvg from 'assets/images/usdc-new-transparent.png'

export const IndexUI = (
  props,
) => {
  const { t } = useTranslation()
  
  const { loading, pools } = usePools()

  return <>
    {/* <V2MessageLarge /> */}

    <RetroactivePoolClaimBanner />

    <PageTitleAndBreadcrumbs
      title={`${t('pools')}`}
      breadcrumbs={[]}
    />

    <Link
      href='/pools/[symbol]'
      as={`/pools/PT-cUSDC`}
    >
      <a
        className='block mt-2 mb-3 text-center p-3 rounded-lg border-2 border-secondary font-bold text-inverse text-xxs xs:text-xs sm:text-sm'
      >
        <span
          role='img'
          aria-label='megaphone emoji'
          className='mx-2 text-xl'
        >📣</span>
        <br /> The <img
          src={UsdcSvg}
          alt='usdc logo'
          className='w-4 h-4 inline-block relative'
          style={{
            top: -2
          }}
        /> USDC pool is now open!
      </a>
    </Link>

    {loading ?
      <IndexUILoader /> :
      <PoolList
        pools={pools}
      />
    }

    <Tagline />
  </>
}
