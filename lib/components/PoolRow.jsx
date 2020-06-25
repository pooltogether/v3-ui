import React, { useContext } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
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
    <motion.div
      // initial='hidden'
      // animate='visible'
      variants={{
        hidden: { scale: 0.7 },
        visible: {
          scale: 1,
        },
      }}
      whileHover={{
        scale: 1.02
      }}
      className='relative w-full px-2'
    >
      <Link
        href='/pools/[networkName]/[prizePoolAddress]'
        as={`/pools/kovan/${pool.id}`}
      >
        <motion.a
          className='w-full px-6 sm:px-4 mb-2 py-2 inline-block bg-purple-1100 hover:bg-purple-1000 trans border-2 border-purple-700 hover:border-purple-500 rounded-lg'
          style={{
            minHeight: 120
          }}
        >
          <div className='flex items-center mt-2'>
            <img
              src={currencyIcon}
              className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2'
            />

            <div>
              <span className='text-green-200 text-base'>Daily {name} Pool</span>
            </div>
          </div>

          {pool && pool.currentState && <>
            <p
              className='text-xs'
            ><span className='m-0 text-white'>Status:</span><br /> {pool.currentState}</p>
          </>}
        </motion.a>
      </Link>
    </motion.div>  
  </>
}
