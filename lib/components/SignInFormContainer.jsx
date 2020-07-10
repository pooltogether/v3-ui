import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

import { SignInForm } from 'lib/components/SignInForm'

export const SignInFormContainer = (props) => {
  const router = useRouter()

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
    <motion.div
      key='sign-in-scaled-bg'
      className='fixed t-0 l-0 r-0 b-0 w-full h-full z-40 bg-darkened'
      initial={{ scale: 0 }}
      animate={{ scale: 1, transition: { duration: 0.1 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    />

    <motion.div
      key='sign-in-pane'
      className='fixed t-0 l-0 r-0 b-0 w-full h-full z-40'
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.25 }}
    >
      <nav
        className='fixed t-0 l-0 r-0 w-full px-4 pt-4 flex items-start justify-between flex-wrap h-20'
      >
        <div></div>
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
        <SignInForm />
      </div>
    </motion.div>
  </>
}
