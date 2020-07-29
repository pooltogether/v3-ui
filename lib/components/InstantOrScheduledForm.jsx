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
      <div
        className='flex items-center justify-center py-2 px-4 sm:w-7/12 mx-auto rounded-xl -mx-6 sm:mx-auto bg-inverse text-match'
        style={{
          minHeight: 70
        }}
      >
        Your X CURRENCY will be scheduled for withdrawal in: 4d 22h
      </div>
      <button
        className='trans text-blue hover:text-secondary underline rounded-xl py-2 px-6 outline-none mt-2'
        onClick={(e) => {
          e.preventDefault()
          setWithdrawType('instant')
        }}
      >
        Need your funds right now?
      </button>
    </> : <>
      <div
        className='flex items-center justify-center py-2 px-4 sm:w-7/12 mx-auto rounded-xl -mx-6 sm:mx-auto bg-primary text-inverse'
        style={{
          minHeight: 70
        }}
      >
        You will receive Y CURRENCY now and forfeit Z CURRENCY as interest. 
      </div>
        <button
          className='trans text-blue hover:text-secondary underline rounded-xl py-2 px-6 outline-none mt-2'
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
