import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

import GiftIcon from 'assets/images/icon-gift@2x.png'

export const PrizeFromInterestCard = (props) => {
  const { t } = useTranslation()

  const { interestPrize, decimals, pool } = props

  return <>
    <div
      className='non-interactable-card my-6 py-4 sm:py-6 px-4 xs:px-4 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    >
      <div className='mt-1 text-caption uppercase'>
        <img
          src={GiftIcon}
          className='inline-block mr-2 card-icon'
        /> {t('prizeFromInterest')}
      </div>

      <h3
        className='mt-1'
      >
        ${displayAmountInEther(interestPrize, {
          decimals
        })}
      </h3>

      <p>
        {t('prizeInterestSplitBetweenNWinners', {
          numberOfWinners: pool?.numberOfWinners
        })}
      </p>
    </div>
  </>
}
