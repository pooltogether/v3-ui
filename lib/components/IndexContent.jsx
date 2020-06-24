import React, { useContext } from 'react'
import Link from 'next/link'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { getDemoPoolContractAddress } from 'lib/utils/getDemoPoolContractAddress'

import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'

export const IndexContent = (
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

  const kovanDaiPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'dai')
  const kovanUsdcPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'usdc')
  const kovanUsdtPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'usdt')

  let daiContent
  if (daiPool && daiPool.ticket) {
    daiContent = <>
      <h1 className='text-blue-500'>Static fragment</h1>
      <p><span className='text-white'>Prize period in seconds:</span> {daiPool.prizePeriodSeconds}</p>
      <p><span className='text-white'>RNG:</span> {daiPool.rng}</p>
      <p><span className='text-white'>Ticket:</span> {daiPool.ticket}</p>
      <p><span className='text-white'>Sponsorship:</span> {daiPool.sponsorship}</p>
      <p><span className='text-white'>Creator:</span> {daiPool.creator}</p>
      <p><span className='text-white'>Prize strategy:</span> {daiPool.prizeStrategy}</p>

      <hr/>

      <h1 className='text-blue-500'>Dynamic fragment</h1>
      <p><span className='text-white'>Current Prize ID:</span> {daiPool.currentPrizeId}</p>
      <p><span className='text-white'>Current State:</span> {daiPool.currentState}</p>
      <p><span className='text-white'>Prize Period Started At:</span> {daiPool.prizePeriodStartedAt}</p>
      <p><span className='text-white'>Previous Prize:</span> {daiPool.previousPrize}</p>
      <p><span className='text-white'>Previous Prize Avg Tickets:</span> {daiPool.previousPrizeAverageTickets}</p>
    </>
  }

  return <>
    <Link
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
    </Link>

    <div
      className='flex -mx-2 justify-between text-xs sm:text-lg lg:text-xl'
    >
      <div className='w-full sm:w-1/3 px-2'>
        <Link
          href='/pools/[networkName]/[prizePoolAddress]'
          as={`/pools/kovan/${kovanDaiPrizePoolContractAddress}`}
        >
          <a
            className='w-full px-6 sm:px-4 mb-2 py-2 inline-block bg-purple-1100 hover:bg-purple-1000 trans border-2 border-purple-700 rounded-lg hover:border-purple-500'
          >
            <div className='flex items-center mt-2'>
              <img src={DaiSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

              <div>
                <span className='text-blue-200 text-base'>Weekly DAI Pool</span>

              </div>
            </div>

            {daiPool && daiPool.ticket && <>
              <p
                className='text-xs'
              ><span className='m-0 text-white'>Ticket:</span><br/> {daiPool.ticket}</p>
            </>}
          </a>
        </Link>
      </div>

      <div className='w-full sm:w-1/3 px-2'>
        <Link
          href='/pools/[networkName]/[prizePoolAddress]'
          as={`/pools/kovan/${kovanUsdcPrizePoolContractAddress}`}
        >
          <a
            className='w-full px-6 sm:px-4 mb-2 py-2 inline-block bg-purple-1100 hover:bg-purple-1000 trans border-2 border-purple-700 rounded-lg hover:border-purple-500'
          >
            <div className='flex items-center mt-2'>
              <img src={UsdcSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

              <div>
                <span className='text-blue-200 text-base'>Daily USDC Pool</span>

              </div>
            </div>

            {usdcPool && usdcPool.ticket && <>
              <p
                className='text-xs'
              ><span className='m-0 text-white'>Ticket:</span><br/> {usdcPool.ticket}</p>
            </>}
          </a>
        </Link>
      </div>

      <div className='w-full sm:w-1/3 px-2'>
        <Link
          href='/pools/[networkName]/[prizePoolAddress]'
          as={`/pools/kovan/${kovanUsdtPrizePoolContractAddress}`}
        >
          <a
            className='w-full px-6 sm:px-4 mb-2 py-2 inline-block bg-purple-1100 hover:bg-purple-1000 trans border-2 border-purple-700 rounded-lg hover:border-purple-500'
          >
            <div className='flex items-center mt-2'>
              <img src={UsdtSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

              <div>
                <span className='text-blue-200 text-base'>Monthly Tether Pool</span>
              </div>
            </div>

            {usdtPool && usdtPool.ticket && <>
              <p
                className='text-xs'
              ><span className='m-0 text-white'>Ticket:</span><br/> {usdtPool.ticket}</p>
            </>}
          </a>
        </Link>
      </div>
      
    </div>
  
  </>
}
