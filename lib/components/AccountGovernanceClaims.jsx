import React, { useState } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'i18n/client'
import { Button } from 'lib/components/Button'
import FeatherIcon from 'feather-icons-react'

import Dai from 'assets/images/dai.svg'
import { SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_WEEK } from 'lib/constants'
import { useTimeCountdown } from 'lib/hooks/useTimeCountdown'


export const AccountGovernanceClaims = (props) => {
  const { t } = useTranslation()
  
  // TODO: Only show if a user has anything deposited in pools

  return <>
    <h6
      className='font-normal text-accent-2 mt-16 mb-4'
    >
      Governance
    </h6>
    <div className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-3 py-3 sm:px-10 sm:py-10'>
      <ClaimHeader />
      <ClaimablePoolPoolItem />
      <ClaimablePoolPoolItem />
    </div>
  </>
}

const ClaimHeader = props => {
  // TODO: disable if there isn't any to claim
  // TODO: Claim All Functionality

  return <div className='flex justify-between flex-col sm:flex-row mb-8'>
    <div className='flex sm:flex-col justify-between sm:justify-start mb-4 sm:mb-0'>
      <h4 className='font-normal my-auto'>Claimable POOL</h4>
      <h2 className='leading-none'>1,000</h2>
    </div>
    <div className='flex flex-col-reverse sm:flex-col'>
      <Button className='mb-4'>Claim All</Button>
      <span className='text-accent-1 text-xxs mb-4' >What can I do with POOL?</span>
    </div>
  </div>
}

const ClaimablePoolPoolItem = props => {

  const givingAwayPerDay = 15000
  const earningPerDay = 15
  const poolToClaim = 500

  return <div className='bg-body p-6 rounded flex flex-col sm:flex-row sm:justify-between mb-4 sm:mb-8 last:mb-0'>
    <div className='flex flex-row-reverse justify-between sm:justify-start mb-2'>
      <img className='h-16 w-16 sm:h-16 sm:w-16 sm:mr-4' src={Dai} />
      <div>
        <h2 className='leading-none'>Dai Pool</h2>
        <div className='text-accent-1 text-xs mt-1' >{givingAwayPerDay} POOL / day</div>
        <RewardTimeLeft initialSecondsLeft={5000} />
      </div>
    </div>

    <div className='sm:text-right'>
      <h2 className='leading-none'>{poolToClaim} POOL</h2>
      <div className='text-accent-1 text-xs mb-4' >@ {earningPerDay} POOL / day</div>
      <Button className='w-full'>Claim</Button>
    </div>
  </div>
}

const RewardTimeLeft = props => {
  const { initialSecondsLeft } = props

  const { days, hours, minutes, secondsLeft } = useTimeCountdown(initialSecondsLeft, 60000)

  const textColor = determineColor(secondsLeft)
  
  return <div className='flex text-accent-1 sm:mt-4'>
    Ends in
    <FeatherIcon className={classnames(`h-4 w-4 stroke-current stroke-2 my-auto ml-2 mr-1`, textColor)} icon='clock' />{' '}
    <span className={classnames(textColor)}>
      {!days ? null : `${days}d, `}
      {!hours && !days ? null :  `${hours}h, `}
      {`${minutes}m`}
    </span>
  </div>
}

const determineColor = (secondsLeft) => {
  // 1 day
  if (secondsLeft <= SECONDS_PER_HOUR) {
    return 'text-red'
  } else if (secondsLeft <= SECONDS_PER_DAY) {
    return 'text-orange'
  }

  return ''
}