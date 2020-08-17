import React, { useContext, useEffect } from 'react'
import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { SignInForm } from 'lib/components/SignInForm'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const SignInFormContainer = (props) => {
  const router = useRouter()

  const walletContext = useContext(WalletContext)
  const { handleLoadOnboard } = walletContext

  // lazy load onboardjs when sign-in is shown
  useEffect(() => {
    console.log('handleLoadOnboard on sign in show')
    handleLoadOnboard()
  }, [])

  const handleCloseSignIn = () => {
    queryParamUpdater.remove(router, 'signIn')

    if (router.asPath.match('account')) {
      router.push('/', '/', { shallow: true })
    }
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
        className='fixed t-0 l-0 r-0 w-full px-4 pt-4 flex items-start justify-between h-20'
      >
        <div></div>
        <button
          type='button'
          onClick={handleCloseSignIn}
          className='text-accent-1 hover:text-inverse trans outline-none focus:outline-none active:outline-none'
        >
          <FeatherIcon
            icon='x-circle'
            className='w-8 h-8 sm:w-16 sm:h-16'
            strokeWidth='1'
          />
        </button>
      </nav>

      <div
        className='h-full flex flex-col justify-center px-4 sm:px-12 lg:px-64 -mt-4 text-center mx-auto'
        style={{
          maxWidth: 1460
        }}
      >
        <SignInForm
          postSignInCallback={() => {
            queryParamUpdater.remove(router, 'signIn')
          }}
        />
      </div>
    </motion.div>
  </>
}
