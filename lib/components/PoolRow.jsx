import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

import { PoolShow } from 'lib/components/PoolShow'
import { getDemoPoolContractAddress } from 'lib/utils/getDemoPoolContractAddress'

import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'

export const PoolRow = (
  props,
) => {
  const {
    pool
  } = props

  const kovanDaiPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'dai')
  const kovanUsdcPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'usdc')
  const kovanUsdtPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'usdt')

  let ticker = 'loading'
  let name = 'Loading'
  let currencyIcon = 'circle'
  if (kovanDaiPrizePoolContractAddress.toLowerCase() === pool.id) {
    ticker = 'dai'
    name = 'DAI'
    currencyIcon = DaiSvg
  } else if (kovanUsdcPrizePoolContractAddress.toLowerCase() === pool.id) {
    ticker = 'usdc'
    name = 'USDC'
    currencyIcon = UsdcSvg
  } else if (kovanUsdtPrizePoolContractAddress.toLowerCase() === pool.id) {
    ticker = 'usdt'
    name = 'Tether'
    currencyIcon = UsdtSvg
  }

  // let featuredPoolContent
  // if (daiPool && daiPool.ticket && daiPool.currentPrizeId) {
  //   featuredPoolContent = <>
  //     <p><span className='text-white'>Prize period in seconds:</span> {daiPool.prizePeriodSeconds}</p>
  //     <p><span className='text-white'>Current Prize ID:</span> {daiPool.currentPrizeId}</p>
  //     <p><span className='text-white'>Current State:</span> {daiPool.currentState}</p>
  //     <p><span className='text-white'>Prize Period Started At:</span> {daiPool.prizePeriodStartedAt}</p>
  //     <p><span className='text-white'>Previous Prize:</span> {daiPool.previousPrize}</p>
  //     <p><span className='text-white'>Previous Prize Avg Tickets:</span> {daiPool.previousPrizeAverageTickets}</p>
  //   </>
  // } else {
  //   featuredPoolContent = <div
  //     className='text-center text-xl'
  //   >
  //     <V3LoadingDots />
  //   </div>
  // }

return <>
    {/* <AnimatePresence
    // onExitComplete={handleExitComplete}
    > */}

        <Link
          href='/pools/[networkName]/[prizePoolAddress]'
          as={`/pools/kovan/${pool.id}`}
        >
          <motion.a
            animate
            className='shadow-md hover:shadow-xl cursor-pointer w-full px-6 sm:px-4 mb-3 py-2 inline-block bg-secondary hover:bg-primary trans border border-default rounded-lg'
            style={{
              minHeight: 120
            }}
          >
            <div className='flex justify-between items-center'>
              <div>
                <span className='text-xl font-bold'>Weekly Pool</span>
                {/* <span className='text-base'>Daily {name} Pool</span> */}
              </div>
              <img
                src={currencyIcon}
                className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8'
              />
            </div>

            {pool && pool.currentState && <>
              <div
                className='mt-5'
              >
                <div className='uppercase text-xxs font-bold'>Status</div>
                <div className='text-lg'>{pool.currentState}</div>
              </div>
            </>}
          </motion.a>
        </Link>

    {/* </AnimatePresence> */}
  </>
}
