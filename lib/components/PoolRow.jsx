import React from 'react'
import Link from 'next/link'
import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'

import { CurrencyAndYieldSource } from 'lib/components/CurrencyAndYieldSource'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { RiskFactor } from 'lib/components/RiskFactor'
import { getDemoPoolContractAddress } from 'lib/utils/getDemoPoolContractAddress'

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
  if (kovanDaiPrizePoolContractAddress.toLowerCase() === pool.id) {
    ticker = 'dai'
    name = 'DAI'
  } else if (kovanUsdcPrizePoolContractAddress.toLowerCase() === pool.id) {
    ticker = 'usdc'
    name = 'USDC'
  } else if (kovanUsdtPrizePoolContractAddress.toLowerCase() === pool.id) {
    ticker = 'usdt'
    name = 'Tether'
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
                <CurrencyAndYieldSource
                  {...props}
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
                <RiskFactor
                  {...props}
                />
              </div>
            </div>
          </motion.a>
        </Link>

    {/* </AnimatePresence> */}
  </>
}
