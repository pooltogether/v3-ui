import React from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import FeatherIcon from 'feather-icons-react'
import { AnimatePresence, motion } from 'framer-motion'

import { ButtonLink } from 'lib/components/ButtonLink'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
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
              className='flex items-center font-bold w-8/12 sm:w-3/12 lg:w-3/12'
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
              className='flex flex-col items-end w-4/12 sm:w-9/12 lg:w-9/12'
            >
              <NewPrizeCountdown
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
              <ButtonLink
                border='highlight'
                text='secondary'
                bg='highlight'
                width='w-full'
                size='lg'
                href='/pools/[symbol]/deposit'
                as={`/pools/${pool.symbol}/deposit`}
              >
                Get tickets
              </ButtonLink>
            </div>

            <div
              className='w-2/12 text-right'
              style={{
                lineHeight: 1.2,
                maxWidth: 50
              }}
            >
              <ButtonLink
                border='highlight'
                text='highlight'
                bg='primary'
                width='w-full'
                rounded='full'
                href='/pools/[symbol]/deposit'
                as={`/pools/${pool.symbol}/deposit`}
                style={{
                  top: 2
                }}
              >
                <FeatherIcon
                  strokeWidth='3'
                  icon='eye'
                  className='w-7 h-7 mx-auto'
                />
              </ButtonLink>
            </div>
          </div>
        </motion.a>
      </Link>
    </AnimatePresence>
  </>
}
