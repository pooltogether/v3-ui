import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import { AccountAndSignIn } from 'lib/components/AccountAndSignIn'
import { Button } from 'lib/components/Button'
import { DepositWizardContainer } from 'lib/components/DepositWizardContainer'
import { HeaderLogo } from 'lib/components/HeaderLogo'
import { WithdrawWizardContainer } from 'lib/components/WithdrawWizardContainer'
import { StaticNetworkNotificationBanner } from 'lib/components/StaticNetworkNotificationBanner'
import { Footer } from 'lib/components/Footer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'
import { TransactionsUI } from 'lib/components/TransactionsUI'
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
        <div className='header'>
          <StaticNetworkNotificationBanner />

          <HeaderLogo />

          <TransactionsUI />

          <AccountAndSignIn />

          {/* <div
            id='top'
            className='main-nav relative z-20 pt-2'
          >
            <Nav />
          </div> */}

          <Button
            outline
            className='mr-3 flex-grow'
          >
            <FeatherIcon
              icon='settings'
              className='w-8 h-8'
              strokeWidth='2'
            />
          </Button>
        </div>

        <div className='sidebar'>
          <Nav />
        </div>

        <div className='content'>
        </div>

        <div
          className='pool-container flex flex-grow relative z-30 h-full page'
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
                className='my-4 text-inverse'
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



    </div>
  </>
}
