import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { map } from 'lodash'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { extractPoolRewardsFromUserDrips } from 'lib/utils/extractPoolRewardsFromUserDrips'

export const AccountRewardsUI = () => {
  const {pools, dynamicPlayerDrips} = useContext(PoolDataContext)

  const poolAddresses = map(pools, 'poolAddress')
  const playerRewards = extractPoolRewardsFromUserDrips({poolAddresses, dynamicPlayerDrips})
  // console.log({playerRewards})

  return <>
    <div
      className='non-interactable-card mt-2 py-4 sm:py-6 px-4 xs:px-10 bg-card rounded-lg card-min-height-desktop'
    >
      <div
        className='text-caption uppercase font-bold'
      >
        Earned referral rewards (i)
      </div>

      <div className='flex flex-col'>
        <div className='flex items-center justify-between mt-4'>

          <div>
            <h3>10</h3>

            <div
              className='text-caption -mt-2 uppercase font-bold'
            >
              Sign ups (TODO: add $ value claimable here!)
            </div>
          </div>

          <div>
            <Button
              textSize='xl'
              onClick={(e) => {
                e.preventDefault()
                console.log('run claim fxn')
              }}
            >
              Claim
            </Button>
          </div>

        </div>

        <div
          className='border-t border-dashed border-highlight-2 pt-6 mt-6'
        >
          <div
            className='text-caption uppercase font-bold'
          >
            Balance Drips
          </div>
          {playerRewards.balance.map((balanceDrip, index) => <div
            key={index}
            className='bg-primary px-4 py-2 text-inverse flex items-center justify-between rounded-lg mt-4'
          >
            <p>{balanceDrip.dripToken.name} ({balanceDrip.dripToken.symbol}): {balanceDrip.balance / 1e18}</p>
          </div>)}
        </div>

        <div
          className='border-t border-dashed border-highlight-2 pt-6 mt-6'
        >
          <div
            className='text-caption uppercase font-bold'
          >
            Volume Drips
          </div>
          {playerRewards.volume.map((volumeDrip, index) => <div
            key={index}
            className='bg-primary px-4 py-2 text-inverse flex items-center justify-between rounded-lg mt-4'
          >
            <p>{volumeDrip.dripToken.name} ({volumeDrip.dripToken.symbol}): {volumeDrip.balance / 1e18}</p>
          </div>)}
        </div>

        <div
          className='border-t border-dashed border-highlight-2 pt-6 mt-6'
        >
          <div
            className='text-caption uppercase font-bold'
          >
            Referral Volume Drips
          </div>
          {playerRewards.refVolume.map((volumeDrip, index) => <div
            key={index}
            className='bg-primary px-4 py-2 text-inverse flex items-center justify-between rounded-lg mt-4'
          >
            <p>{volumeDrip.dripToken.name} ({volumeDrip.dripToken.symbol}): {volumeDrip.balance / 1e18}</p>
          </div>)}
        </div>

        <div
          className='border-t border-dashed border-highlight-2 pt-6 mt-6'
        >
          <div
            className='text-caption uppercase font-bold'
          >
            Share more, earn more
          </div>
          <div
            className='bg-primary px-4 py-2 text-inverse w-1/2 flex items-center justify-between rounded-lg mt-4'
          >
            <div>
              referral URL with
            </div>

            <div>
              TODO: copy/paste feature w/ icon
            </div>
          </div>
        </div>
      </div>

    </div>
  </>
}
