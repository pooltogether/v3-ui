import React from 'react'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TextInputGroup } from 'lib/components/TextInputGroup'

export const DepositWizardSignIn = (props) => {
  const { nextStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const handleContinueClick = (e) => {
    e.preventDefault()
    nextStep()
  }

  return <>
    <PaneTitle small>
      {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      Please enter your credit or debit card details:
    </PaneTitle>

    <div className='flex flex-col mx-auto'>
      <div className='w-full sm:w-2/3 mx-auto'>
        <TextInputGroup
          large
          id='quantity'
          label={<>
            Credit Card #: <span className='text-purple-600 italic'></span>
          </>}
          required
          type='number'
          pattern='\d+'
          onChange={(e) => setQuantity(e.target.value)}
          value={quantity}
        />
      </div>

      <Button
        onClick={handleContinueClick}
        color='white'
        className='my-2 w-64'
      >
        Continue
      </Button>
    </div>
  </>
}
