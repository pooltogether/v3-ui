import React, { useContext } from 'react'
import Link from 'next/link'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { getDemoPoolContractAddress } from 'lib/utils/getDemoPoolContractAddress'

import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'

export const IndexContent = (
  props,
) => {
  const { poolData } = props
  console.log({ poolData })
  const { daiPool } = poolData || {}
  console.log({ daiPool })

  const walletContext = useContext(WalletContext)
  const walletNetwork = walletContext._onboard.getState().network

  const kovanDaiPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'dai')
  const kovanUsdcPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'usdc')
  const kovanUsdtPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'usdt')

  let dynamicallyLoadedContent
  if (daiPool) {
    dynamicallyLoadedContent = <>
      Prize period in seconds: {daiPool.prizePeriodSeconds}
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
        <div className='flex items-center'>
          {dynamicallyLoadedContent}
          <img src={DaiSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

          <div>
            <span className='text-blue-200 text-base'>Weekly DAI Pool</span>
          </div>
        </div>
      </a>
    </Link>

    {walletNetwork === 42 && <>
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
              <div className='flex items-center'>
                <img src={DaiSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

                <div>
                  <span className='text-blue-200 text-base'>Weekly DAI Pool</span>

                </div>
              </div>
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
              <div className='flex items-center'>
                <img src={UsdcSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

                <div>
                  <span className='text-blue-200 text-base'>Daily USDC Pool</span>

                </div>
              </div>
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
              <div className='flex items-center'>
                <img src={UsdtSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

                <div>
                  <span className='text-blue-200 text-base'>Monthly Tether Pool</span>

                </div>
              </div>
            </a>
          </Link>
        </div>
        
      </div>
    </>}
  
  </>
}
