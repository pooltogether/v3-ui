import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import PrizeIllustration from 'assets/images/prize-illustration-new@2x.png'
import LootBoxIllustration from 'assets/images/lootbox-closed-halo@2x.png'

export const PrizeBreakdown = (props) => {
  const { t } = useTranslation()

  const { externalAwardsValue, interestPrize, decimals } = props

  return <>
    <div
      className='non-interactable-card mt-6 py-4 sm:py-6 px-4 xs:px-4 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    >
      <div className='flex flex-col xs:flex-row'>
        <div
          className='hidden sm:block sm:w-2/12'
        >&nbsp;</div>

        <div
          className='flex flex-col items-center justify-center text-center w-full xs:w-5/12 xs:w-3/12 h-56 xs:h-64'
        >
          <img
            src={PrizeIllustration}
            className='w-40 mx-auto'
          />
          <div>
            <h3>
              ${displayAmountInEther(interestPrize, {
                decimals
              })}
            </h3>
            <span
              className='text-sm xs:text-base sm:text-xl'
            >
              {t('tickets')}
            </span>
          </div>
        </div>

        <div
          className='w-full xs:w-2/12 text-center my-0 xs:mt-24 xs:pt-3'
        >
          <div
            className='text-5xl font-bold'
          >
            +
          </div>
        </div>

        <div
          className='flex flex-col items-center justify-center text-center w-full xs:w-5/12 xs:w-3/12 h-56 xs:h-64'
        >
          <img
            src={LootBoxIllustration}
            className='w-40 mx-auto -mt-8'
          />
          <div>
            <h3>
              ${numberWithCommas(externalAwardsValue)}
            </h3>
            <span
              className='text-sm xs:text-base sm:text-xl'
            >
              {t('lootBox')}
            </span>
          </div>
        </div>

        <div
          className='hidden sm:block sm:w-2/12'
        >&nbsp;</div>
      </div>
    
    </div>
  </>
}
