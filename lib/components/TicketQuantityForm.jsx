import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { Modal } from 'lib/components/Modal'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Odds } from 'lib/components/Odds'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const TicketQuantityForm = (props) => {
  const poolData = useContext(PoolDataContext)
  const { pool, usersTicketBalance } = poolData

  const poolIsLocked = pool && pool.isRngRequested

  const {
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

  const isWithdraw = formName === 'Withdraw'

  let validate = null
  if (isWithdraw) {
    validate = {
      greaterThanBalance: value => parseFloat(value) <= usersTicketBalance ||
        'please enter an amount lower than your ticket balance',
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

    {poolIsLocked && <>
      <Modal
        header='CURRENCY Pool locked'
      >
        <div>
          This Pool's prize is currently being awarded - until awarding is complete it can not accept deposits or withdrawals.

      <br/>
          COUNTDOWN TO UNLOCK:!
        </div>
      </Modal>
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
      <ErrorsBox 
        errors={errors}
      />

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
        className='mt-5 text-sm text-highlight-1'
      >
        <Odds
          showLabel
          pool={pool}
          usersBalance={usersTicketBalance}
          additionalQuantity={watchQuantity}
          isWithdraw={isWithdraw}
          hide={parseFloat(watchQuantity) > usersTicketBalance}
        />
      </div>
    </form>
  </>
}
