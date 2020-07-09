import React, { useContext, useState } from 'react'
import Link from 'next/link'
import FeatherIcon from 'feather-icons-react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <AnimatePresence>
      <motion.div
        key='sign-in-scaled-bg'
        className='fixed t-0 l-0 r-0 b-0 w-full h-full z-40 bg-darkened'
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.1 }}
      >
        &nbsp;
      </motion.div>

      <motion.div
        key='sign-in-pane'
        id='signin-container'
        className='fixed t-0 l-0 r-0 b-0 w-full h-full z-40'
        // initial={{ opacity: 0, scale: 0 }}
        // animate={{ opacity: 1, scale: 1 }}
        // exit={{ opacity: 0, scale: 0 }}
      >
        <nav
          className='fixed t-0 l-0 r-0 w-full px-4 pt-4 flex items-start justify-between flex-wrap h-20'
        >
          <div></div>
          {/*<div
            className='w-3/5 sm:w-2/5 justify-start h-full flex items-center truncate'
          >
            <Link
              href='/'
              as='/'
            >
              <a
                title={'Back to home'}
                className='pool-logo border-0 trans block w-full'
              />
            </Link> 
          </div>*/}
          <button
            type='button'
            onClick={handleCloseSignIn}
            className='text-primary hover:text-secondary trans'
          >
            <FeatherIcon
              icon='x-circle'
              className='w-8 h-8 sm:w-16 sm:h-16'
            />
          </button>
        </nav>

        <div className='h-full flex flex-col justify-center px-4 lg:px-64 text-center'>
          <form
            onSubmit={handleSubmit}
            className='-mt-48'
          >
            <div
              className='font-bold mb-2 py-2 text-xl sm:text-3xl lg:text-5xl text-inverse'
            >
              Sign in
            </div>

            <div
              className='pb-1 text-sm sm:text-base text-default-soft'
            >
              Enter your email address to continue:
            </div>

            <div className='w-full sm:w-2/3 mx-auto'>
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
            </div>

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
      </motion.div>
    </AnimatePresence>
  </>
}
