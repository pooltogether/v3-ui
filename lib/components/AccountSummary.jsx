import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ProfileAvatar } from 'lib/components/ProfileAvatar'
import { ProfileName } from 'lib/components/ProfileName'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { PoolNumber } from 'lib/components/PoolNumber'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import AccountPlaceholderImg from 'assets/images/avatar-placeholder.svg'

export const AccountSummary = () => {
  const { t } = useTranslation()
  const { pools, dynamicPlayerData } = useContext(PoolDataContext)
  const { usersAddress } = useContext(AuthControllerContext)

  let totalTickets = null
  let cumulativeWinningsAllPools = ethers.utils.bigNumberify(0)
  dynamicPlayerData?.forEach(playerData => {
    const pool = pools.find(pool => pool.poolAddress === playerData.prizePool.id)

    if (!pool || !playerData.balance) {
      return
    }

    const decimals = parseInt(pool?.underlyingCollateralDecimals, 10)

    const balance = Number(
      ethers.utils.formatUnits(playerData.balance, decimals),
    )

    totalTickets = totalTickets ? totalTickets + balance : balance

    // Calculate winnings
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
      className='purple-pink-gradient rounded-lg px-4 xs:px-6 sm:px-10 pt-4 pb-6 text-inverse my-4 sm:mt-8 sm:mb-12 mx-auto'
    >
      <div
        className='flex flex-col items-start justify-between mt-4'
      >
        <div
          className='flex items-center justify-center'
          style={{
            lineHeight: 0
          }}
        >
          {usersAddress ? <>
            <ProfileAvatar />
            <h6
              className='ml-2 font-normal'
            >
              <ProfileName />
            </h6>
          </> : <>
            <img
              alt='profile avatar placeholder'
              src={AccountPlaceholderImg}
              className='profile-img relative inline-block rounded-full mr-1 w-6 h-6'
            /> <h6
              className='ml-2 font-normal'
            >
              {t('accountName')}
            </h6>
          </>}
        </div>


        <div
          className='flex flex-col sm:flex-row sm:items-center justify-start w-full'
        >
          <div
            className='sm:w-1/3'
          >
            <h2
              className='mt-6 tickets-line-height'
            >
              {totalTickets && <>
                <PoolCountUp
                  fontSansRegular
                  end={parseInt(totalTickets, 10)}
                  decimals={null}
                  duration={0.5}
                />
              </>} {t('tickets')}
            </h2>

            {usersAddress && <>
              <div
                className='text-caption uppercase font-bold'
              >
                $<PoolNumber>{numberWithCommas(totalTickets, { precision: 18 })}</PoolNumber>
              </div>
            </>}
          </div>

          <div>
            <div
              className='w-full flex sm:items-center justify-start flex-col sm:flex-row mt-4 sm:mt-12 sm:mt-8'
            >
              <div
                className='flex flex-col w-full sm:pr-2 mb-4 sm:mb-0'
              >
                <h4>
                  ${displayAmountInEther(
                    cumulativeWinningsAllPools,
                    { decimals: 18 }
                  )}
                </h4>
                <div
                  className='text-caption uppercase font-bold'
                >
                  {t('allTimePrizesWon')}
                </div>
              </div>

              {/* <div
                className='flex flex-col w-full xs:w-7/12 sm:w-6/12 lg:w-6/12 sm:pl-16'
              >
                <h4>
                  $XX.YY
                </h4>
                <div
                  className='text-caption uppercase font-bold'
                >
                  {t('allTimeEarnedRewards')}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        
      </div>
    </div>

  </>
}
