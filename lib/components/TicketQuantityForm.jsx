import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const TicketQuantityForm = (props) => {
  const { nextStep } = props

  const router = useRouter()

  // TODO: Consider using a regex to filter only unsigned whole numbers
  const [depositAmount, setDepositAmount] = useState('')

  const disabled = depositAmount.length === 0 || parseInt(depositAmount, 10) <= 0

  const handleSubmit = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { quantity: depositAmount })

    nextStep()
  }

  return <>
    <PaneTitle>
      Get Tickets
    </PaneTitle>

    <form
      onSubmit={handleSubmit}
    >
      <div className='w-full sm:w-2/3 mx-auto'>
        <TextInputGroup
          large
          id='depositAmount'
          label={<>
            Quantity <span className='text-purple-600 italic'></span>
          </>}
          required
          type='number'
          pattern='\d+'
          onChange={(e) => setDepositAmount(e.target.value)}
          value={depositAmount}
        />
      </div>

      {/* {overBalance && <>
              <div className='text-yellow-400'>
                You only have {displayAmountInEther(usersTokenBalance, { decimals: tokenDecimals })} {tokenSymbol}.
                <br />The maximum you can deposit is {displayAmountInEther(usersTokenBalance, { precision: 2, decimals: tokenDecimals })}.
              </div>
            </>} */}

      <div
        className='my-5'
      >
        <Button
          disabled={disabled}
          // disabled={overBalance}
          color='green'
        >
          Continue
        </Button>
      </div>
    </form>
  </>
}
