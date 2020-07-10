import React from 'react'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import { DepositWizardContainer } from 'lib/components/DepositWizardContainer'
import { StaticNetworkNotificationBanner } from 'lib/components/StaticNetworkNotificationBanner'
import { Footer } from 'lib/components/Footer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'
import { SignInFormContainer } from 'lib/components/SignInFormContainer'

export const Layout = (props) => {
  const {
    children
  } = props

  const router = useRouter()
  const signIn = router.query.signIn
  const deposit = /deposit/.test(router.asPath)

  return <>
    <Meta />

    <AnimatePresence>
      {signIn && <SignInFormContainer />}
    </AnimatePresence>

    <AnimatePresence>
      {deposit && <DepositWizardContainer
        {...props}
      />}
    </AnimatePresence>
    
    <div
      className='flex flex-col w-full'
      style={{
        minHeight: '100vh'
      }}
    >
      <StaticNetworkNotificationBanner />

      <div
        className='pool-container flex flex-grow relative z-30 h-full page'
        // className='pool-container flex flex-grow relative z-30 h-full page fadeIn animated'
      >
        <div
          className='flex flex-col flex-grow'
        >
          <div
            id='top'
            className='main-nav relative spinner-hidden z-20 pt-2'
          >
            <Nav />
          </div>


          <div
            className='relative flex flex-col flex-grow h-full z-10 text-white'
            style={{
              flex: 1
            }}
          >
            <div
              className='px-2 lg:px-12 my-4 text-inverse'
            >
              {React.cloneElement(children, {
                ...props,
              })}
            </div>
          </div>

          <div
            className='main-footer z-10'
          >
            <Footer />
          </div>
        </div>

      </div>
    </div>
  </>
}
