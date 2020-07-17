import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const TicketQuantityForm = (props) => {
  const { handleSubmit, register, errors, formState } = useForm({ mode: 'all' })

  const {
    balanceJsx,
    formName,
    nextStep,
    usersTicketBalance,
  } = props

  const router = useRouter()

  const onSubmit = (values) => {
    if (formState.isValid) {
      queryParamUpdater.add(router, { quantity: values.quantity })

      nextStep()
    }
  }

  let validate = null
  if (formName === 'Withdraw') {
    validate = {
      greaterThanBalance: value => parseFloat(value) < usersTicketBalance,
    }
  }

  return <>
    <PaneTitle>
      {formName}
    </PaneTitle>

    {balanceJsx && <>
      <div className='mt-3 mb-6'>
        {balanceJsx}
      </div>
    </>}

    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='w-10/12 sm:w-2/3 mx-auto'>
        <TextInputGroup
          large
          unsignedNumber
          id='quantity'
          name='quantity'
          register={register}
          validate={validate}
          label={'Quantity'}
          required='ticket quantity required'
          autoComplete='off'
          // placeholder={'# of tickets'}
        />
      </div>
      <div className='text-red'>
        {errors.quantity && errors.quantity.type === 'greaterThanBalance' && <>
          Please enter an amount lower than your ticket balance
        </>}
        {errors.quantity && errors.quantity.message}
      </div>

      <div
        className='my-5'
      >
        <Button
          disabled={!formState.isValid}
          color='green'
        >
          Continue
        </Button>
      </div>
    </form>
  </>
}
