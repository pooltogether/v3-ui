import React from 'react'
import classnames from 'classnames'

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
      wide
      size='lg'
      onClick={handleDepositClick}
      disabled={disabled}
      className={classnames({
        'w-49-percent': needsApproval,
        'mx-auto w-full': !needsApproval
      })}
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
        <div
          className='opacity-70 mx-auto w-full bg-inverse border-2 border-inverse pt-button inline-block text-center leading-snug cursor-pointer outline-none focus:outline-none active:outline-none no-underline px-2 sm:px-8 lg:px-12 py-2 sm:py-2 rounded-xl lg text-match text-lg sm:text-xl lg:text-2xl trans trans-fast'
        >
          Deposit
        </div>
      </PTHint>
    </> : button}
  </>
}
