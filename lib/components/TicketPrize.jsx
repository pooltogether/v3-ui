import React from 'react'
import classnames from 'classnames'
import Image from 'next/image'

import { PoolCountUp } from 'lib/components/PoolCountUp'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'

import PoolTogetherTrophyDetailed from 'images/pooltogether-trophy--detailed.svg'

export const TicketPrize = (props) => {
  const { prize, hideCountdown, className } = props

  return (
    <div className={classnames('flex flex-row text-accent-1 items-center', className)}>
      <div className='w-3 sm:w-4 mr-1 sm:mr-2 flex filter grayscale'>
        <Image src={PoolTogetherTrophyDetailed} />
      </div>
      <span className='mt-auto flex text-xs sm:text-xl font-bold leading-none'>
        $
        <PoolCountUp
          fontSansRegular
          decimals={0}
          duration={3}
          end={parseFloat(prize.totalValueUsd)}
        />
      </span>
      <span className='text-xxxxs sm:text-xxs font-bold mt-auto'>
        {!hideCountdown && (
          <NewPrizeCountdownInWords
            onTicket
            extraShort
            prizePeriodSeconds={prize.prizePeriodSeconds}
            prizePeriodStartedAt={prize.prizePeriodStartedAt}
            isRngRequested={prize.isRngRequested}
          />
        )}
      </span>
    </div>
  )
}
