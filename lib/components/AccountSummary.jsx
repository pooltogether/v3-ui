import React from 'react'
import { ethers } from 'ethers'

import { ProfileAvatar } from 'lib/components/ProfileAvatar'
import { ProfileName } from 'lib/components/ProfileName'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const AccountSummary = (props) => {
  const { pools, dynamicPlayerData } = props

  let totalTickets = null
  let cumulativeWinningsAllPools = ethers.utils.bigNumberify(0)
  dynamicPlayerData?.forEach(playerData => {
    const pool = pools.find(pool => pool.poolAddress === playerData.prizePool.id)

    if (!pool || !playerData.balance) {
      return
    }

    const decimals = pool.underlyingCollateralDecimals
    
    console.log(playerData)
    console.log(playerData.balance)
    const balance = Number(
      ethers.utils.formatUnits(playerData.balance, decimals),
    )

    totalTickets = totalTickets ? totalTickets + balance : balance

    // Calculate winnings
    console.log({'playerData.cumulativeWinnings':playerData.cumulativeWinnings})
    const winnings = normalizeTo18Decimals(
      playerData.cumulativeWinnings,
      decimals
    )

    cumulativeWinningsAllPools = cumulativeWinningsAllPools.add(
      winnings
    )
  })

  if (!totalTickets) {
    totalTickets = 0
  }

  return <>
    <div
      className='bg-accent-grey-2 rounded-lg px-4 xs:px-6 sm:px-8 pt-4 pb-6 text-inverse my-8 sm:mt-20 sm:mb-12 mx-auto'
    >
      <div
        className='flex flex-col items-start justify-between mt-2'
      >

        <div
          className='flex items-center'
        >
          <ProfileAvatar
            xl
          /> 
          <h2
            className='ml-4'
          >
            <ProfileName
              xl
            />
          </h2>
        </div>

        <h3
          className='mt-6'
        >
          {totalTickets && <>
            {parseInt(totalTickets, 10)} Tickets
          </>}
        </h3>
        <div
          className='text-caption uppercase font-bold'
        >
          ${numberWithCommas(totalTickets, { precision: 4 })}
        </div>

        <div
          className='w-full flex sm:items-center justify-start flex-col sm:flex-row mt-12 sm:mt-8'
        >
          <div
            className='flex flex-col w-full xs:w-7/12 sm:w-4/12 lg:w-4/12 sm:border-r border-accent-4 sm:pr-2 mb-4 sm:mb-0'
          >
            <h4>
              ${displayAmountInEther(cumulativeWinningsAllPools, { decimals: 18 })}
            </h4>
            <div
              className='text-caption uppercase font-bold'
            >
              All-time prizes won
            </div>
          </div>

          <div
            className='flex flex-col w-full xs:w-7/12 sm:w-6/12 lg:w-6/12 sm:pl-16'
          >
            <h4>
              $XX.YY
            </h4>
            <div
              className='text-caption uppercase font-bold'
            >
              All-time earned rewards
            </div>
          </div>
        </div>
      </div>
    </div>

  </>
}
