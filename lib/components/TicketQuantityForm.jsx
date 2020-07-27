import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Odds } from 'lib/components/Odds'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const TicketQuantityForm = (props) => {
  const poolData = useContext(PoolDataContext)
  const { pool, usersTicketBalance } = poolData

  const {
    getValues,
    handleSubmit,
    register,
    errors,
    formState,
    watch
  } = useForm({
    mode: 'all', reValidateMode: 'onChange',
 })

  const watchQuantity = watch('quantity')

  const {
    balanceJsx,
    formName,
    nextStep,
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
      greaterThanBalance: value => parseFloat(value) <= usersTicketBalance,
    }
  }

  const additionalQuantity = Number(watchQuantity)

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
          label={'Amount of tickets'}
          required='ticket quantity required'
          autoComplete='off'
          // placeholder={'# of tickets'}
        />
      </div>
      <div className='text-red'>
        {errors.quantity && errors.quantity.type === 'greaterThanBalance' && <>
          please enter an amount lower than your ticket balance
        </>}
        {errors.quantity && errors.quantity.message}
      </div>

      <div
        className='my-5'
      >
        <Button
          wide
          size='lg'
          disabled={!formState.isValid}
          color='green'
        >
          Continue
        </Button>
      </div>

      <div
        className='mt-5 text-sm text-blue'
      >
        <Odds
          pool={pool}
          usersBalance={usersTicketBalance}
          additionalQuantity={additionalQuantity}
        />
      </div>
    </form>
  </>
}
