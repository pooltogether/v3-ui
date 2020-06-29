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

  return <>
    <div
      className={classnames(
        'flex flex-col sm:flex-row sm:flex-wrap justify-center items-center',
        'mt-2 mb-4 rounded-xl text-base sm:text-lg',
      )}
    >
      <StatContainer>
        <BlueLineStat
          title='Total tickets'
          value={`$${displayAmountInEther(genericChainValues.ticketTotalSupply, { precision: 2 })} ${genericChainValues.tokenSymbol || 'TOKEN'}`}
        />
      </StatContainer>

      <StatContainer>
        <BlueLineStat
          title={<div className='flex flex-col leading-tight'>
            next prize
            <span className='text-purple-700 italic'>
              (estimate)
            </span></div>}
          value={`$${displayAmountInEther(genericChainValues.estimateRemainingPrize, { precision: 0 })} ${genericChainValues.tokenSymbol || 'TOKEN'}`}
        />
      </StatContainer>
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

