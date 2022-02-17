import React from 'react'
import { useTranslation } from 'react-i18next'

import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

import GiftIcon from 'assets/images/icon-gift@2x.png'

export const PrizeFromInterestCard = (props) => {
  const { t } = useTranslation()

  const { ticketPrize, decimals, pool } = props

  const numWinners = pool.config.numberOfWinners

  const numberOfWinnersMinusOne = parseInt(numWinners, 10) - 1

  if (typeof numberOfWinnersMinusOne !== 'number') {
    return null
  }

  return (
    <>
      <div className='non-interactable-card my-6 py-4 xs:py-6 px-4 xs:px-6 sm:px-10 bg-card rounded-lg card-min-height-desktop'>
        <div className='mt-1 text-caption uppercase'>
          <img src={GiftIcon} className='inline-block mr-2 card-icon' /> {t('prizeFromInterest')}
        </div>

        <h3 className='mt-1'>
          $
          {displayAmountInEther(ticketPrize, {
            decimals
          })}
        </h3>

        <p>
          {t('prizeInterestSplitBetweenNWinners', {
            numberOfWinnersMinusOne
          })}
        </p>
      </div>
    </>
  )
}
