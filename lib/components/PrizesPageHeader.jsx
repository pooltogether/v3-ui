import React from 'react'
import Link from 'next/link'

import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'

export const PrizesPageHeader = (
  props,
) => {
  const { showPoolLink, pool } = props
  
  return <>
    <PageTitleAndBreadcrumbs
      title={`Prizes`}
      // pool={pool}
      breadcrumbs={[
        // {
        //   href: '/prizes',
        //   as: '/prizes',
        //   name: 'Prizes',
        // }
      ]}
    />

    <div
      className='text-inverse mb-16'
    >
      <h4>
        Total awarded: <span className='text-flashy'>$23,994</span>
      </h4>
    </div>

    {showPoolLink && <>
      <div
        className='bg-card mt-6 mb-6 text-sm py-4 flex items-center justify-center rounded-lg'
      >
        <div className='flex flex-col items-center justify-center text-lg'>
          <PoolCurrencyIcon
            pool={pool}
          /> <div className='mt-1'>
            <Link
              href='/prizes/[symbol]'
              as={`/prizes/${pool?.symbol}`}
            >
              <a>
                {pool?.name}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>}
  </>
}
