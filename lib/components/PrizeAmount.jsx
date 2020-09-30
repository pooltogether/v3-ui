import React from 'react'
import { padStart } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PrizeAmount = (
  props,
) => {
  const { t } = useTranslation()

  const {
    big,
    pool
  } = props

  const decimals = pool?.underlyingCollateralDecimals
  // const collatSymbol = pool?.underlyingCollateralSymbol

  let labelSize = 'text-xxxs sm:text-xxs'
  let amountSize = 'text-sm sm:text-lg'

  if (big) {
    labelSize = 'text-xs sm:text-xs lg:text-base'
    amountSize = 'text-3xl sm:text-3xl lg:text-5xl font-bold'
  }
  
  return <>
    <div
      className={`${labelSize} uppercase font-bold`}
    >
      {t('prizeEstimate')}
    </div>
    <div
      className={`${amountSize} text-inverse`}
    >
      <span
        className='font-number'
      >
        ${displayAmountInEther(
          pool?.prizeEstimate,
          { precision: 2 }
        )}
        
      </span>
    </div>
  </>
}
