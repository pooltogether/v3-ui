import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TextInputGroup } from 'lib/components/TextInputGroup'

export function DepositFiatForm(props) {
  const { handleSubmit, register, errors, formState } = useForm({ mode: 'all' })

  const { nextStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const onSubmit = () => {
    // e.preventDefault()
    nextStep()
  }

  return <>
    <PaneTitle small>
      {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      Enter your creds.
    </PaneTitle>

    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex flex-col mx-auto w-full'>
        <div className='w-full sm:w-2/3 mx-auto'>
          <TextInputGroup
            large
            unsignedWholeNumber
            id='creditCardNumber'
            name='creditCardNumber'
            register={register}
            label={<>
              Credit Card # <span className='text-purple-600 italic'></span>
            </>}
            required='credit card number required'
          />
          <div className='text-red'>
            {errors.creditCardNumber && errors.creditCardNumber.message}
          </div>

          <Button
            textSize='lg'
            disabled={!formState.isValid}
            className='my-2 w-full'
          >
            Confirm deposit
          </Button>
        </div>
      </div>
    </form>
  </>
}
