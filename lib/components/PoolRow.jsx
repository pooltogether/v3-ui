import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

import { PoolShow } from 'lib/components/PoolShow'
import { getDemoPoolContractAddress } from 'lib/utils/getDemoPoolContractAddress'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'

function range1(i) { return i ? range1(i - 1).concat(i) : [] }

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
            className='shadow-md hover:shadow-xl cursor-pointer w-full px-3 sm:px-4 sm:px-4 mb-3 py-3 sm:py-4 inline-block bg-secondary hover:bg-primary trans border border-default rounded-lg'
            style={{
              minHeight: 120
            }}
          >
            <div className='flex justify-between items-center'>
              <div>
                <span className='text-xl font-bold'>{pool.frequency} Pool</span>
              </div>

              <div
                className='flex items-center'
              >
                <div className='bg-primary rounded-full px-2 uppercase text-sm font-bold mr-1'>{pool.yieldSource}</div>
                <img
                  src={currencyIcon}
                  className='inline-block w-6 h-6 lg:w-8 lg:h-8'
                />
              </div>
            </div>

            <div className='mt-5 flex justify-between items-center'>
              <div>
                <div className='uppercase text-xxs font-bold'>Status</div>
                <div className='text-sm sm:text-lg'>
                  {pool.currentState}
                </div>
              </div>

              <div
                className='w-20 sm:w-40'
              >
                <div className='uppercase text-xxs font-bold'>Prize</div>
                <div className='text-sm sm:text-lg'>
                  ${numberWithCommas(pool.prize)} <span className='text-default-soft'> / {pool.frequency === 'weekly' ? 'week' : 'day'}</span>
                </div>
              </div>

              <div>
                <div className='uppercase text-xxs font-bold'>Risk factor</div>
                <div className='flex w-20 sm:w-24'
                  style={{
                    height: 27
                  }}
                >
                  {pool.risk && range1(pool.risk).map(r => {
                    const color = pool.risk >= 4 ?
                      'red' : 
                      pool.risk <= 2 ? 
                        'green' :
                        'yellow'
                    return <div className={`mt-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-${color} mr-1`}>
                      &nbsp;
                    </div>
                  })}
                </div>
              </div>
            </div>
          </motion.a>
        </Link>

    {/* </AnimatePresence> */}
  </>
}
