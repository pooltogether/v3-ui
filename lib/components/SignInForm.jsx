import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { Button } from 'lib/components/Button'
import { TextInputGroup } from 'lib/components/TextInputGroup'

const validator = require('email-validator')

export const SignInForm = (props) => {
  const { handleSubmit, register, errors } = useForm()

  const { postSignInCallback } = props

  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(null)

  const authControllerContext = useContext(AuthControllerContext)

  const testEmail = () => {
    setIsValid(validator.validate(email))
  }

  // This catches autofill clicks in various browsers
  useInterval(() => {
    testEmail()
  }, 1000)

  const onSubmit = (values) => {
    // e.preventDefault()
    console.log(values)
    // const onSubmit = values => console.log(values)
    // handleSubmit

    testEmail()

    if (isValid) {
      authControllerContext.signInMagic(email, postSignInCallback)
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)

    testEmail()
  }

  return <>
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='mx-auto'>
        <TextInputGroup
          ref={register({
            required: "Required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "invalid email address"
            }
          })}

          id='email'
          label={'Email address:'}
          placeholder='Your email'
          required
          type='email'
          onChange={handleEmailChange}
          value={email}
          onBlur={testEmail}
        />
      </div>
      {errors.email && errors.email.message}

      <div
        className='my-5'
        disabled={!email}
      >
        <Button
          wide
          disabled={!isValid}
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
          authControllerContext.handleShowOnboard(postSignInCallback)
        }}
        className='font-bold inline mb-2 py-2 text-sm sm:text-base text-primary-soft hover:text-primary trans border-b-2 border-transparent hover:border-secondary'
      >
        or connect to MetaMask, etc.
      </button>
    </div>
  </>
}
