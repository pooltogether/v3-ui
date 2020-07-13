import React, { useContext, useEffect, useState } from 'react'
import classnames from 'classnames'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { BlueLineStat } from 'lib/components/BlueLineStat'
import { StatContainer } from 'lib/components/StatContainer'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolStats = (props) => {
  const poolDataContext = useContext(PoolDataContext)
  const { pool } = poolDataContext

  const [secondsRemainingNow, setSecondsRemainingNow] = useState('--')

  useEffect(() => {
    
  }, [/*didUpdateVar?*/])

  useInterval(() => {
    
  }, 1000)

  return <>
    <div
      className={classnames(
        'flex flex-col justify-center items-start',
        'mt-2 mb-4 rounded-xl text-base sm:text-lg',
      )}
    >
      <div className='text-left mt-10'>
        <div className={`text-xs sm:text-xs lg:text-base uppercase font-bold`}># of Tickets Sold</div>
        <div className={`text-3xl sm:text-3xl lg:text-5xl font-bold text-inverse`}>
          <span className='font-number'>${displayAmountInEther(pool.totalSupply, {
            precision: 2,
            decimals: pool.underlyingCollateralDecimals
          })} {pool.underlyingCollateralSymbol}</span>
        </div>
      </div>

      <div className='text-left mt-10'>
        <div className={`text-xs sm:text-xs lg:text-base uppercase font-bold`}># of Players</div>
        <div className={`text-3xl sm:text-3xl lg:text-5xl font-bold text-inverse`}>
          <span className='font-number'>{pool.playerCount}</span>
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

