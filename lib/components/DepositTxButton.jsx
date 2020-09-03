import React from 'react'

import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'

export const DepositTxButton = (props) => {
  const { needsApproval, poolIsLocked, disabled, nextStep } = props

  const handleDepositClick = (e) => {
    e.preventDefault()
    nextStep()
  }

  const button = <>
    <Button
      noAnim
      textSize='lg'
      onClick={handleDepositClick}
      disabled={disabled || poolIsLocked}
      className='w-48-percent'
    >
      Deposit
    </Button>
  </>

  return <>
    {poolIsLocked ? <>
      <PTHint
        title='Pool is locked'
        tip={<>
          <div className='my-2 text-xs sm:text-sm'>
            The Pool is currently being awarded. No deposits or withdrawals can be processed until it's complete.
          </div>
          <div
            className='text-xs sm:text-sm'
          >
            You won't need to refresh the page.
          </div>
        </>}
        className='w-full w-49-percent'
      >
        {button}
      </PTHint>
    </> : button}
  </>
}
