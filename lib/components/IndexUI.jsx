import React, { useContext } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PoolRow } from 'lib/components/PoolRow'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'

export const IndexUI = (
  props,
) => {
  const poolDataContext = useContext(PoolDataContext)
  let poolData,
    daiPool,
    usdcPool,
    usdtPool

  if (poolDataContext && poolDataContext.poolData) {
    poolData = poolDataContext.poolData
    daiPool = poolData.daiPool
    usdcPool = poolData.usdcPool
    usdtPool = poolData.usdtPool
  }
  
  return <>
    {/* <Link
      href='/pools/[networkName]/[prizePoolAddress]'
      as={`/pools/kovan/${kovanDaiPrizePoolContractAddress}`}
    >
      <a
        className='w-full px-6 sm:px-4 lg:mr-4 mb-2 py-2 inline-block bg-purple-1100 hover:bg-purple-1000 trans border-2 border-purple-700 rounded-lg hover:border-purple-500'
        style={{
          minHeight: 600
        }}
      >
        <div className='flex items-center mt-2'>
          <img src={DaiSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

          <div>
            <span className='text-blue-200 text-base'>Weekly DAI Pool</span>
          </div>
        </div>

        {daiContent}
      </a>
    </Link> */}

    <motion.div
      className='flex flex-col -mx-2 text-xs sm:text-lg lg:text-xl'
      animate='visible'
      initial='hidden'
      variants={{
        hidden: { },
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <h1
        className='px-3 text-purple-500'
      >
        Pools
      </h1>
      <PoolRow
        pool={poolData.daiPool}
      />

      <PoolRow
        pool={poolData.usdcPool}
      />

      <PoolRow
        pool={poolData.usdtPool}
      />
    </motion.div>
  
  </>
}
