import React from 'react'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import { NavAccount } from 'lib/components/NavAccount'
import { DepositWizardContainer } from 'lib/components/DepositWizardContainer'
import { HeaderLogo } from 'lib/components/HeaderLogo'
import { NavMobile } from 'lib/components/NavMobile'
import { WithdrawWizardContainer } from 'lib/components/WithdrawWizardContainer'
import { StaticNetworkNotificationBanner } from 'lib/components/StaticNetworkNotificationBanner'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'
import { Settings } from 'lib/components/Settings'
import { SignInFormContainer } from 'lib/components/SignInFormContainer'

export const Layout = (props) => {
  const {
    children
  } = props

  const router = useRouter()
  const signIn = router.query.signIn
  const deposit = /deposit/.test(router.asPath)
  const withdraw = /withdraw/.test(router.asPath)

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

    <AnimatePresence>
      {withdraw && <WithdrawWizardContainer
        {...props}
      />}
    </AnimatePresence>
    
    <div
      className='flex flex-col w-full'
      style={{
        minHeight: '100vh'
      }}
    >



      <div className='grid-wrapper'>
        <div className='whitespace-1'>
        </div>

        <div className='banner'>
          <StaticNetworkNotificationBanner />
        </div>

        <div className='sidebar hidden sm:block z-30'>
          <div>
            <Nav />
          </div>
        </div>

        <div
          className='header w-full bg-body z-20 shadow-xl py-2'
        >
          <div
            className='flex justify-between items-center px-8 sm:px-10 py-4 sm:pt-5 sm:pb-3'
          >
            {/* <div
              className='sm:hidden'
            > */}
              <HeaderLogo />
            {/* </div> */}

            <div
              className='flex items-center justify-end relative'
            >
              <NavAccount />
              
              <Settings />
            </div>
          </div>
        </div>

{/* bg-card */}
        

        <div className='content'>
          <div
            className='pool-container flex flex-grow relative z-10 h-full page'
          >
            <div
              className='flex flex-col flex-grow'
            >


              <div
                className='relative flex flex-col flex-grow h-full z-10 text-white'
                style={{
                  flex: 1
                }}
              >
                <div
                  className='my-0 text-inverse'
                >
                  {React.cloneElement(children, {
                    ...props,
                  })}
                </div>
              </div>

              {/* 
              <div
                className='main-footer z-10'
              >
                <Footer />
              </div> */}
              </div>
            </div>
          </div>

          <div className='whitespace-2'>
          </div>
        </div>

      <NavMobile />
    </div>
  </>
}
