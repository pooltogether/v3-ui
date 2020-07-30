import React from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import FeatherIcon from 'feather-icons-react'
import { AnimatePresence, motion } from 'framer-motion'

import { CurrencyAndYieldSource } from 'lib/components/CurrencyAndYieldSource'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { PrizePoolCountdown } from 'lib/components/PrizePoolCountdown'

export const PoolRow = (
  props,
) => {
  const {
    pool,
    selected,
  } = props

  if (!pool || !pool.symbol) {
    return null
  }

  const symbol = pool.symbol

  return <>
    <AnimatePresence>
      <Link
        href='/pools/[symbol]'
        as={`/pools/${symbol}`}
      >
        <motion.a
          animate
          className={classnames(
            'w-full px-3 sm:px-4 sm:px-4 mb-3 py-3 sm:py-4 inline-block  trans rounded-lg border-0 text-inverse',
            {
              'bg-primary hover:bg-secondary hover:text-primary cursor-pointer shadow-md hover:shadow-xl': !selected,
              'bg-default hover:bg-default hover:text-inverse': selected,
            }
          )}
          style={{
            minHeight: 120
          }}
        >
          <div className='flex items-center'>
            <div
              className='text-lg sm:text-xl font-bold w-6/12 sm:w-4/12 lg:w-3/12'
            >
              {pool.name}
            </div>

            <div
              className='flex items-center w-5/12 sm:w-7/12 lg:w-8/12'
            >
              <CurrencyAndYieldSource
                {...props}
              />
            </div>

            <div
              className='flex items-center w-1/12 justify-end'
            >
              <FeatherIcon
                icon='arrow-right-circle'
                className='stroke-current w-6 h-6 sm:w-8 sm:h-8'
              />
            </div>
          </div>

          <div className='mt-5 flex items-center'>
            <div
              className='w-6/12 sm:w-4/12 lg:w-3/12'
            >
              <PrizeAmount
                {...props}
              />
            </div>

            <div
              className='flex items-center sm:my-1'
            >
              <PrizePoolCountdown
                pool={pool}
              />
            </div>
          </div>
        </motion.a>
      </Link>
    </AnimatePresence>
  </>
}
