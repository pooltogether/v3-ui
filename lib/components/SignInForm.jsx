import React, { useContext, useState } from 'react'
import Link from 'next/link'
import FeatherIcon from 'feather-icons-react'
import { useRouter } from 'next/router'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useInterval } from 'lib/hooks/useInterval'
import { Button } from 'lib/components/Button'
import { TextInputGroup } from 'lib/components/TextInputGroup'

const validator = require('email-validator')

export const SignInForm = (props) => {
  const router = useRouter()

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


  const handleCloseSignIn = () => {
    let pathname = router.pathname
    let asPath = router.asPath

    if (/signIn/.test(router.asPath)) {
      pathname = '/'
      asPath = '/'
    }

    router.push(
      `${pathname}`,
      `${asPath}`,
      {
        shallow: true
      }
    )
  }

  return <>
    <div
      id='signin-container'
      className='fixed t-0 l-0 r-0 b-0 w-full h-full z-40 bg-primary'
    >
      <div className='nav-and-footer-container'>
        <nav
          className='sm:px-4 lg:px-0 pt-4 nav-min-height flex items-center h-full justify-between flex-wrap'
        >
          <div
            className='w-3/5 sm:w-2/5 justify-start h-full flex items-center truncate'
          >
            <Link
              href='/'
              as='/'
            >
              <a
                title={'Back to home'}
                className='pool-logo border-0 trans block w-full'
              >
                
              </a>
            </Link>
          </div>
          <div
            className='w-2/5 sm:w-3/5 justify-end h-full flex items-center text-inverse'
          >
            <button
              type='button'
              onClick={handleCloseSignIn}
            >
            <FeatherIcon
              icon='x-circle'
              className='w-8 h-8 sm:w-16 sm:h-16'
            />
            </button>
          </div>
        </nav>
      </div>

      <div className='h-full flex flex-col justify-center p-4 sm:p-32 lg:p-64 text-center'>
        <form
          onSubmit={handleSubmit}
          className='-mt-48'
        >
          <div
            className='font-bold mb-2 py-2 text-xl sm:text-3xl lg:text-5xl text-inverse'
          >
            Sign in.
          </div>

          <div
            className='mb-2 py-2 text-sm sm:text-base text-default-soft'
          >
            Enter your email address to continue:
          </div>

          <TextInputGroup
            id='email'
            label={''}
            placeholder='Your email'
            required
            type='email'
            onChange={handleEmailChange}
            value={email}
            onBlur={testEmail}
          />

          <div
            className='my-5'
            disabled={!email}
          >
            <Button
              wide
              disabled={!isValid}
            >
              Sign in
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

      </div>
    </div>
  </>
}
