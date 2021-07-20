import React from 'react'
import classnames from 'classnames'

import PoolTogetherTrophyDetailed from 'assets/images/pooltogether-trophy--detailed.svg'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'

export const TicketPrize = (props) => {
  const { prize, hideCountdown, className } = props

  return (
    <div className={classnames('flex flex-row', className)}>
      <img
        src={PoolTogetherTrophyDetailed}
        className='relative w-3 sm:w-4 mr-1 sm:mr-2 opacity-70 mt-auto'
        style={{
          filter: 'brightness(5)',
          top: 2
        }}
      />
      <span className='mt-auto'>
        $
        <PoolCountUp
          fontSansRegular
          decimals={0}
          duration={3}
          end={parseFloat(prize.totalValueUsd)}
        />
      </span>
      <span className='text-xxxxs sm:text-xxs font-regular mt-auto'>
        {!hideCountdown && (
          <NewPrizeCountdownInWords
            onTicket
            extraShort
            prizePeriodSeconds={prize.prizePeriodSeconds}
            prizePeriodStartedAt={prize.prizePeriodSeconds}
            isRngRequested={prize.isRngRequested}
          />
        )}
      </span>
    </div>
  )
}
