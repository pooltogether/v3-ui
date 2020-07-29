import React, { useContext, useState, useEffect } from 'react'

import { PaneTitle } from 'lib/components/PaneTitle'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'

export const InstantOrScheduledForm = (props) => {
  const { quantity } = props
  const [withdrawType, setWithdrawType] = useState('scheduled')

  const handleWithdrawTypeChange = (e) => {
    setWithdrawType(e.target.value)
  }
  
  return <div
    className='text-inverse'
  >
    <PaneTitle>
      Withdraw {quantity} tickets
    </PaneTitle>

    <RadioInputGroup
      label='Choose how to receive your funds:'
      name='withdrawType'
      onChange={handleWithdrawTypeChange}
      value={withdrawType}
      radios={[
        {
          value: 'scheduled',
          label: 'I want my X CURRENCY back in 4d 22h'
        },
        {
          value: 'instant',
          label: 'I want Y CURRENCY now and will forfeit the interest'
        }
      ]}
    />

    {withdrawType === 'scheduled' ? <>
      <div className='text-primary'>
        Your X CURRENCY will be scheduled for withdrawal in: 4d 22h
      </div>
      <button
        className='trans text-blue hover:text-secondary underline rounded-xl py-2 px-10 outline-none mt-2'
        onClick={(e) => {
          e.preventDefault()
          setWithdrawType('instant')
        }}
      >
        Need your funds right now?
      </button>
    </> : <>
      <div className='text-default-soft'>
        You will receive Y CURRENCY now and forfeit Z CURRENCY as interest. 
      </div>
        <button
          className='trans text-blue hover:text-secondary underline rounded-xl py-2 px-10 outline-none mt-2'
          onClick={(e) => {
            e.preventDefault()
            setWithdrawType('scheduled')
          }}
        >
          Don't want to forfeit your fairness fee?
        </button>
    </>}
  </div> 
}
