import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { TextInputGroup } from 'lib/components/TextInputGroup'

export const SignInForm = (props) => {
  const { handleSubmit, register, errors, formState } = useForm({ mode: 'onBlur' })

  const { postSignInCallback } = props

  const authControllerContext = useContext(AuthControllerContext)

  const onSubmit = (values) => {
    if (formState.isValid) {
      authControllerContext.signInMagic(values.email, postSignInCallback)
    }
  }

  return <>
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='w-10/12 sm:w-2/3 mx-auto'>
        <TextInputGroup
          id='email'
          name='email'
          type='email'
          register={register}
          label={'Email address:'}
          placeholder='Your email'
          required='Email address required'
        />
      </div>
      <div className='text-red'>
        {errors.email && errors.email.message}
      </div>

      <div
        className='my-5'
      >
        <Button
          wide
          size='lg'
          disabled={!formState.isValid}
          // type='submit'
        >
          Continue
        </Button>
      </div>
    </form>

    <div>
      <button
        onClick={(e) => {
          e.preventDefault()
          authControllerContext.connectWallet(postSignInCallback)
        }}
        className='font-bold inline mb-2 py-2 text-sm sm:text-base text-primary-soft hover:text-primary trans border-b-2 border-transparent hover:border-secondary'
      >
        or connect to MetaMask, etc.
      </button>
    </div>
  </>
}
