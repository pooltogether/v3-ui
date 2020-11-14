import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ProfileAvatar } from 'lib/components/ProfileAvatar'
import { ProfileName } from 'lib/components/ProfileName'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { PoolNumber } from 'lib/components/PoolNumber'
import { SmallLoader } from 'lib/components/SmallLoader'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import AccountPlaceholderImg from 'assets/images/avatar-placeholder.svg'
import ChillWalletIllustration from 'assets/images/pt-illustration-chill@2x.png'

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
      className='purple-pink-gradient rounded-lg px-10 xs:px-12 sm:px-20 pt-4 pb-6 text-inverse my-4 sm:mt-8 sm:mb-12 mx-auto'
    >
      <div
        className='flex justify-between items-center'
      >
        <div
          className='leading-none'
        >
          <h6
            className='font-normal'
          >
            {t('assets')}
          </h6>
          <h1>
            {usersAddress ? <>
              $<PoolCountUp
                fontSansRegular
                end={parseInt(totalTickets, 10)}
                decimals={null}
                duration={0.5}
              />
            </> : <>
              <SmallLoader />
            </>}
          </h1>
        </div>

        <div>
          <img
            src={ChillWalletIllustration}
            alt={`chillin' wallet illustration`}
            className='w-40 mx-auto relative mb-4'
            style={{
              right: -10,
              top: 17
            }}
          />
        </div>

        
      </div>
    </div>

  </>
}
