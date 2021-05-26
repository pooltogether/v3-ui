import React from 'react'
import Link from 'next/link'

import { useTranslation } from 'next-i18next'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'

export const PrizesPageHeader = (props) => {
  const { t } = useTranslation()
  const { showPoolLink, pool } = props

  if (!pool) {
    return null
  }

  return (
    <>
      <PageTitleAndBreadcrumbs
        title={t('prizes')}
        pool={pool}
        breadcrumbs={[
          {
            href: '/',
            as: '/',
            name: t('pools')
          },
          {
            href: '/pools/[networkName]',
            as: `/pools/${pool.networkName}`,
            name: getNetworkNiceNameByChainId(pool.chainId)
          },
          {
            href: '/pools/[networkName]/[symbol]',
            as: `/pools/${pool.networkName}/${pool.symbol}`,
            name: pool.name
          },
          {
            name: t('prizes')
          }
        ]}
      />

      {showPoolLink && (
        <>
          <div className='bg-card mt-6 mb-6 text-sm py-4 flex items-center justify-center rounded-lg'>
            <div className='flex flex-col items-center justify-center text-lg'>
              <PoolCurrencyIcon
                symbol={pool.tokens.underlyingToken.symbol}
                address={pool.tokens.underlyingToken.address}
              />{' '}
              <div className='mt-1'>
                <Link
                  href='/prizes/[networkName]/[symbol]'
                  as={`/prizes/${pool.networkName}/${pool.symbol}`}
                >
                  <a>{pool.name}</a>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
