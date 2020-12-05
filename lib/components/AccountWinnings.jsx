import React, { useContext } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PoolNumber } from 'lib/components/PoolNumber'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

import IconTarget from 'assets/images/icon-target@2x.png'

export const AccountWinnings = () => {
  const { t } = useTranslation()
  
  const { pools, dynamicPlayerData } = useContext(PoolDataContext)

  const totalWinnings = () => {
    let cumulativeWinningsAllPools = ethers.utils.bigNumberify(0)

    dynamicPlayerData?.forEach(playerData => {
      const pool = pools.find(pool => pool.poolAddress === playerData.prizePool.id)

      if (!pool || !playerData.balance) {
        return
      }

      const decimals = parseInt(pool?.underlyingCollateralDecimals, 10)

      // Calculate winnings
      const winnings = normalizeTo18Decimals(
        playerData.cumulativeWinnings,
        decimals
      )

      cumulativeWinningsAllPools = cumulativeWinningsAllPools.add(
        winnings
      )
    })

    return cumulativeWinningsAllPools
  }

  return <>
    <h5
      className='font-normal text-accent-2 mt-16 mb-4'
    >
      {t('myWinnings')}
    </h5>

    <div
      className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-2 sm:px-6 py-3'
    >
      <div className='flex justify-between flex-col xs:flex-row xs:pt-4 pb-0 px-2 xs:px-4'>

        <div className='flex-col order-2 xs:order-1'>
          <h6
            className='flex items-center font-normal'
          >
            {t('allTimeWinnings')}
          </h6>

          <h3>
            $<PoolNumber>
              {displayAmountInEther(totalWinnings(), { precision: 2 })}
            </PoolNumber>
          </h3>
        </div>

        <div
          className='order-1 xs:order-2 ml-auto'
        >
          <img
            src={IconTarget}
            className='w-24 h-24 mx-auto'
          />
        </div>
      </div>

      <div
        className='text-inverse flex flex-col justify-between xs:px-2'
      >
        <table
          className='table-fixed w-full text-xxs xs:text-base sm:text-xl mt-6'
        >
          <tbody>
          </tbody>
        </table>
      </div>

      <div
        className='text-xxxs xs:text-xxs sm:text-xs opacity-70 px-2 xs:px-4 py-4'
      >
        {t('seeAllPastWinnersOn')} <Link
          href='/prizes/PT-cDAI'
          shallow
        >
          <a 
            className='text-accent-grey-1 underline'
          >
            {t('pastWinnersPrizeHistoryLink')}
          </a>
        </Link>
      </div>
    </div>
  </>
}
