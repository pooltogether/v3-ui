import React from 'react'
import { padStart } from 'lodash'

import { PTHint } from 'lib/components/PTHint'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PrizeAmount = (
  props,
) => {
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
      Prize estimate
    </div>
    <div
      className={`${amountSize} text-inverse`}
    >
      <span
        className='font-number'
      >
        ${displayAmountInEther(
          pool?.estimatePrize,
          { decimals }
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
