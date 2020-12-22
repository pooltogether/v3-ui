import React, { useContext } from 'react'
import Link from 'next/link'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePools } from 'lib/hooks/usePools'
import { PoolNumber } from 'lib/components/PoolNumber'
import { usePlayerPrizesQuery } from 'lib/hooks/usePlayerPrizesQuery'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { sumAwardedControlledTokens } from 'lib/utils/sumAwardedControlledTokens'

import IconTarget from 'assets/images/icon-target@2x.png'

export const AccountWinnings = () => {
  const { t } = useTranslation()
  
  const { usersAddress } = useContext(AuthControllerContext)
  
  const { contractAddresses } = usePools()

  // fill this in with a watched address or an address from router params
  const playerAddress = ''
  const address = playerAddress || usersAddress

  const { data: prizesWon } = usePlayerPrizesQuery(address)
  
  let awardedControlledTokens = prizesWon?.awardedControlledTokens || []

  awardedControlledTokens = awardedControlledTokens
    .filter(awardedControlledToken => contractAddresses.pools.includes(awardedControlledToken.prize.prizePool.id))
  const total = sumAwardedControlledTokens(awardedControlledTokens)

  // TODO: We should calculate all of the ERC20s someone won, their value on the day it was awarded
  // as well as the interest prizes!

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
              {displayAmountInEther(total, { precision: 2 })}
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
