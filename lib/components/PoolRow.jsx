import React from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import FeatherIcon from 'feather-icons-react'
import { AnimatePresence, motion } from 'framer-motion'

import { NewButton } from 'lib/components/NewButton'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { NewPrizePoolCountdown } from 'lib/components/NewPrizePoolCountdown'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

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
  const decimals = pool?.underlyingCollateralDecimals

  return <>
    <AnimatePresence>
      <Link
        href='/pools/[symbol]'
        as={`/pools/${symbol}`}
      >
        <motion.a
          animate
          className={classnames(
            'bg-card hover:bg-card-selected border-card w-full px-4 mb-3 py-5 inline-block  trans rounded-lg border-0 text-inverse',
            {
              'border border-card shadow-md hover:shadow-xl cursor-pointer': !selected,
              'border border-card border-dashed': selected,
            }
          )}
          style={{
            minHeight: 120
          }}
        >
          <div className='flex items-center'>
            <div
              className='flex items-center font-bold w-8/12 sm:w-4/12 lg:w-3/12'
            >
              <PoolCurrencyIcon
                pool={pool}
              />
              <div className='inline-flex flex flex-col'>
                <h6
                  className='inline-block'
                  style={{
                    marginTop: -2
                  }}
                >
                  <span
                    className='text-inverse'
                  >
                    Prize ${displayAmountInEther(
                      pool?.estimatePrize,
                      { decimals }
                    )}
                  </span>
                </h6>
                <span className='text-caption font-number uppercase -mt-1'>
                  {pool.frequency}
                </span>
              </div>
            </div>

            <div
              className='flex flex-col items-center w-4/12 sm:w-7/12 lg:w-8/12'
            >
              <NewPrizePoolCountdown
                pool={pool}
              />
            </div>
{/*}
            <div
              className='flex items-center w-1/12 justify-end'
            >
              <FeatherIcon
                icon='arrow-right-circle'
                className='stroke-current w-6 h-6 sm:w-8 sm:h-8'
              />
            </div> */}
          </div>

          <div className='mt-5 flex items-center'>
            <div
              className='w-10/12 sm:w-11/12 lg:w-11/12 pr-2'
            >
              <NewButton
                color='purple'
                width='full'
                size='lg'
                href='/pools/[symbol]/deposit'
                as={`/pools/${pool.symbol}/deposit`}
              >
                Get tickets
              </NewButton>
            </div>

            <div
              className='w-2/12 text-right'
              style={{
                lineHeight: 1.2
              }}
            >
              <NewButton
                color='purple'
                size='lg'
                wide
                href='/pools/[symbol]/deposit'
                as={`/pools/${pool.symbol}/deposit`}
                style={{
                  top: 2
                }}
              >
                <FeatherIcon
                  icon='eye'
                  className='w-5 h-5'
                />
              </NewButton>
            </div>
          </div>
        </motion.a>
      </Link>
    </AnimatePresence>
  </>
}
