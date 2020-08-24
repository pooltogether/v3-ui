import React from 'react'
import { ethers } from 'ethers'

import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const AccountSummary = (props) => {
  const { pools, dynamicPlayerData } = props

  let totalTickets = null
  dynamicPlayerData?.forEach(playerData => {
    const pool = pools.find(pool => pool.poolAddress === playerData.prizePool.id)

    if (!pool) {
      return
    }

    const decimals = pool.underlyingCollateralDecimals
    const what = ethers.utils
    
    const balance = Number(
      ethers.utils.formatUnits(playerData.balance, decimals),
    )

    totalTickets = totalTickets ? totalTickets + balance : balance
  })

  if (!totalTickets) {
    totalTickets = 0
  }

  return <>
    <div
      className='bg-accent-grey-2 rounded-lg px-4 sm:px-8 pt-4 pb-6 text-inverse my-8 sm:mt-20 sm:mb-12 border-flashy mx-auto'
    >
      <div
        className='flex flex-col items-start justify-between'
      >
        <h2>
          {totalTickets && <>
            {parseInt(totalTickets, 10)} Tickets
          </>}
        </h2>
        <div
          className='text-caption -mt-2 uppercase font-bold'
        >
          ${totalTickets} Total Value
        </div>

        <div
          className='w-full mt-5 flex items-center justify-start pt-2 flex-col sm:flex-row py-4'
        >
          <div
            className='flex flex-col w-full xs:w-7/12 sm:w-4/12 lg:w-4/12 sm:border-r border-accent-4 sm:pr-2'
          >
            <h4>$89</h4>
            <div
              className='text-caption uppercase font-bold'
            >
              All-time earned rewards
            </div>
          </div>

          <div
            className='flex flex-col w-full xs:w-7/12 sm:w-6/12 lg:w-6/12 sm:pl-16'
          >
            <h4>0</h4>
            <div
              className='text-caption uppercase font-bold'
            >
              All-time prizes won
            </div>
          </div>
        </div>
      </div>
    </div>

  </>
}
