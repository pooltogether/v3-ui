import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TextInputGroup } from 'lib/components/TextInputGroup'

export const DepositFiatForm = (props) => {
  const { nextStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const [creditCardNumber, setCreditCardNumber] = useState('')

  const handleContinueClick = (e) => {
    e.preventDefault()
    nextStep()
  }

  return <>
    <PaneTitle small>
      {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      Enter your creds.
    </PaneTitle>

    <div className='flex flex-col mx-auto w-full'>
      <div className='w-full sm:w-2/3 mx-auto'>
        <TextInputGroup
          large
          id='creditCardNumber'
          label={<>
            Credit Card #: <span className='text-purple-600 italic'></span>
          </>}
          required
          type='number'
          pattern='\d+'
          onChange={(e) => setCreditCardNumber(e.target.value)}
          value={creditCardNumber}
        />

        <Button
          onClick={handleContinueClick}
          className='my-2 w-full'
        >
          Confirm deposit
        </Button>
      </div>
    </div>
  </>
}
