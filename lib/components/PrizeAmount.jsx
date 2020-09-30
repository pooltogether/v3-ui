import React from 'react'
import { padStart } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { PTHint } from 'lib/components/PTHint'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

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
        ${numberWithCommas(
          pool?.estimatePrize,
          { precision: 2 }
        )}
        
        {/* <PTHint
          label=""
          tip={<>
            {pool && pool.estimatePrize && <>
              <span className='text-xxs text-yellow'>
                ({padStart(pool.estimatePrize.toString(), Number(decimals) + 1, 0)} {collatSymbol})
              </span>
            </>}
          </>}
        >
          <>
            ${displayAmountInEther(pool.estimatePrize, { decimals })}
          </>
        </PTHint> */}
       {/* / week */}
      </span>
    </div>
  </>
}
