import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { useInterval } from 'lib/hooks/useInterval'
import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
// import { PoolCountUp } from 'lib/components/PoolCountUp'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const TicketQuantityForm = (props) => {
  const { getValues, handleSubmit, register, errors, formState } = useForm({ mode: 'all' })
  // const [qty, setQty] = useState(0)

  const { nextStep } = props

  const router = useRouter()

  const onSubmit = (values) => {
    if (formState.isValid) {
      queryParamUpdater.add(router, { quantity: values.quantity })

      nextStep()
    }
  }

  // useInterval(() => {
  //   setQty(Math.random() * 100000)
  // }, 2000)
  

  return <>
    <PaneTitle>
      Get tickets
    </PaneTitle>

    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='w-10/12 sm:w-2/3 mx-auto'>
        <TextInputGroup
          large
          unsignedWholeNumber
          id='quantity'
          name='quantity'
          register={register}
          label={<>
            Quantity <span className='text-purple-600 italic'></span>
          </>}
          required='ticket quantity required'
        />
      </div>
      <div className='text-red'>
        {errors.quantity && errors.quantity.message}
      </div>

      {/* <div className='font-number font-bold'>
        <PoolCountUp
          start={0}
          end={qty}
          duration={1.8}
        />
      </div> */}

      {/* {overBalance && <>
              <div className='text-yellow-400'>
                You only have {displayAmountInEther(usersTokenBalance, { decimals: underlyingCollateralDecimals })} {underlyingCollateralSymbol}.
                <br />The maximum you can deposit is {displayAmountInEther(usersTokenBalance, { precision: 2, decimals: underlyingCollateralDecimals })}.
              </div>
            </>} */}

      <div
        className='my-5'
      >
        <Button
          disabled={!formState.isValid}
          // disabled={overBalance}
          color='green'
        >
          Continue
        </Button>
      </div>
    </form>
  </>
}
