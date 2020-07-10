import React, { useContext, useState } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { Button } from 'lib/components/Button'
import { TextInputGroup } from 'lib/components/TextInputGroup'

const validator = require('email-validator')

export const SignInForm = (props) => {
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

  const handleSubmit = (e) => {
    e.preventDefault()

    testEmail()

    if (isValid) {
      authControllerContext.signInMagic(email)
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)

    testEmail()
  }

  return <>
    <form
      onSubmit={handleSubmit}
    >
      <div className='mx-auto'>
        <TextInputGroup
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

      <div
        className='my-5'
        disabled={!email}
      >
        <Button
          wide
          disabled={!isValid}
        >
          Continue
        </Button>
      </div>
    </form>

    <div>
      <button
        onClick={authControllerContext.handleShowOnboard}
        className='font-bold inline mb-2 py-2 text-sm sm:text-base text-primary-soft hover:text-primary trans border-b-2 border-transparent hover:border-secondary'
      >
        or connect to MetaMask, etc.
      </button>
    </div>
  </>
}
