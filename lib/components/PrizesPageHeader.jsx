import React from 'react'
import Link from 'next/link'

import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'

export const PrizesPageHeader = (
  props,
) => {
  const { showPoolLink, pool } = props
  
  return <>
    <div
      className='flex flex-col items-center text-center'
    >
      <div
        className='inline-block text-2xl font-bold pb-4'
      >
        Prizes
      </div>

      <div>
        <div className='text-lg'>
          Total awarded:
        </div>
        <br />
        <div className='text-3xl -mt-6 text-flashy font-bold font-number'>
          $23,994
        </div>
      </div>
    </div>

    {showPoolLink && <>
      <div
        className='bg-default mt-6 mb-6 text-sm py-4 flex items-center justify-center'
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
