import React from 'react'
import Link from 'next/link'

import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'

export const PrizesPageHeader = (
  props,
) => {
  const { showPoolLink, pool } = props
  
  return <>
    <div
      className='bg-highlight-3 rounded-lg px-6 pt-5 pb-5 text-white mt-4 sm:mt-4 mb-10 sm:mb-20'
    >
      <div
        className='flex items-center justify-between'
      >
        <div
          className='w-full sm:w-1/2'
        >
          <h2>
            Prizes
          </h2>
        </div>

        <div
          className='w-full sm:w-1/2 text-right'
        >
          <h4>
            Total awarded: <span className='text-flashy'>$23,994</span>
          </h4>
        </div>
      </div>
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
