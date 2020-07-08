import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { useInterval } from 'lib/hooks/useInterval'
import { BlueLineStat } from 'lib/components/BlueLineStat'
import { StatContainer } from 'lib/components/StatContainer'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolStats = (props) => {
  const {
    genericChainValues,
  } = props

  const [secondsRemainingNow, setSecondsRemainingNow] = useState('--')

  useEffect(() => {
    
  }, [/*didUpdateVar?*/])

  useInterval(() => {
    
  }, 1000)

  console.log({genericChainValues})

  return <>
    <div
      className={classnames(
        'flex flex-col sm:flex-row sm:flex-wrap justify-center',
        'mt-2 mb-4 rounded-xl text-base sm:text-lg',
      )}
    >
      <div className='text-left mt-10'>
        <div className={`text-xs sm:text-xs lg:text-base uppercase font-bold`}># of Tickets Sold</div>
        <div className={`text-3xl sm:text-3xl lg:text-5xl font-bold text-inverse`}>
          <span className='font-number'>${displayAmountInEther(genericChainValues.ticketTotalSupply, { precision: 2 })} ${genericChainValues.tokenSymbol || 'TOKEN'}</span>
        </div>
      </div>

      <div className='text-left mt-10'>
        <div className={`text-xs sm:text-xs lg:text-base uppercase font-bold`}># of Players</div>
        <div className={`text-3xl sm:text-3xl lg:text-5xl font-bold text-inverse`}>
          <span className='font-number'>num players</span>
        </div>
      </div>


{/* 
      <StatContainer>
        <BlueLineStat
          title='Seconds until rewardable'
          value={secondsRemainingNow}
        />
      </StatContainer> */}
{/* 
      <StatContainer>
        <BlueLineStat
          title='Ticket Name &amp; Symbol'
          value={`${genericChainValues.ticketSymbol}: ${genericChainValues.ticketName}`}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title='Sponsorship Name &amp; Symbol'
          value={`${genericChainValues.sponsorshipSymbol}: ${genericChainValues.sponsorshipName}`}
        />
      </StatContainer> */}

    </div>
    
  </>
}

