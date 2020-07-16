import React from 'react'
import Link from 'next/link'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'

import { CurrencyAndYieldSource } from 'lib/components/CurrencyAndYieldSource'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { getDemoPoolContractAddress } from 'lib/utils/getDemoPoolContractAddress'

export const AccountPoolRow = (
  props,
) => {
  const { pool, player } = props
  // const poolAddress = pool.id
  // const fakeFreq = 'Monthly'
  
  return <>
    <Link
      href='/account/pools/[networkName]/[prizePoolTicker]'
      as={`/account/pools/kovan/${pool.underlyingCollateralSymbol}`}
    >
      <motion.a
        animate
        className='shadow-md hover:shadow-xl cursor-pointer w-full px-3 sm:px-4 sm:px-4 mb-3 py-3 sm:py-4 inline-block bg-primary hover:bg-secondary trans rounded-lg border-0 text-inverse hover:text-primary'
        style={{
          minHeight: 120
        }}
      >
        <div className='flex justify-between items-center'>
          <div
            className='text-lg sm:text-xl font-bold w-5/12 sm:w-3/12'
          >
            {pool.frequency} Pool
          </div>

          <div
            className='flex items-center ml-4 w-6/12 sm:w-3/12 lg:w-1/3'
          >
            <PoolCurrencyIcon
              pool={pool}
            />
          </div>

          <div
            className='flex items-center w-1/12'
          >
            <FeatherIcon
              icon='arrow-right-circle'
              className='stroke-current w-6 h-6 sm:w-8 sm:h-8'
            />
          </div>
        </div>

        <div className='mt-5 flex items-center'>
          {/* <div
            className='w-3/12'
          > 
            <div className='uppercase text-xxxs sm:text-xxs font-bold'>Status</div>
            <div className='text-xxs sm:text-lg'>
              {pool.currentState}
            </div>
          </div> */}

          <div
            className='w-6/12 sm:w-10/12 lg:w-11/12'
          >
            <PrizeAmount
              {...props}
            />
          </div>
          <div
            className='w-6/12 sm:w-2/12 lg:w-1/12'
          >
            {ethers.utils.formatUnits(
              player.balance,
              pool.underlyingCollateralDecimals
            )}
          </div>
        </div>
      </motion.a>
    </Link>
  </>
}
