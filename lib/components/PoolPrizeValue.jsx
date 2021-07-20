import React from 'react'

import { PoolCountUp } from 'lib/components/PoolCountUp'
import { PrizeValue } from 'lib/components/PrizeValue'

export const PoolPrizeValue = (props) => {
  const { pool } = props

  if (
    pool.prize.sablierStream.id &&
    !pool.prize.sablierStream?.amountThisPrizePeriodUnformatted?.isZero()
  ) {
    return (
      <div className='text-3xl sm:text-5xl text-flashy font-bold ml-2'>
        <PoolCountUp fontSansRegular decimals={0} duration={6}>
          {parseFloat(pool.prize.sablierStream.amountThisPrizePeriod)}
        </PoolCountUp>
        <span className='text-base lg:text-lg text-inverse mb-4 ml-2 mt-auto'>
          {pool.tokens.sablierStreamToken.tokenSymbol}
        </span>
      </div>
    )
  }

  return <PrizeValue totalValueUsd={pool.prize?.totalValueUsd} />
}
