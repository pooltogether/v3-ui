import React from 'react'
import Link from 'next/link'

import { useTranslation } from 'lib/../i18n'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'

export const PrizesPageHeader = (props) => {
  const { t } = useTranslation()
  const { showPoolLink, pool } = props

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
            href: '/pools/[symbol]',
            as: `/pools/${pool?.symbol}`,
            name: pool?.name
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
              <PoolCurrencyIcon pool={pool} />{' '}
              <div className='mt-1'>
                <Link href='/prizes/[symbol]' as={`/prizes/${pool?.symbol}`}>
                  <a>{pool?.name}</a>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
