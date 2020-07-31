import React from 'react'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import { DepositWizardContainer } from 'lib/components/DepositWizardContainer'
import { WithdrawWizardContainer } from 'lib/components/WithdrawWizardContainer'
import { StaticNetworkNotificationBanner } from 'lib/components/StaticNetworkNotificationBanner'
import { Footer } from 'lib/components/Footer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'
import { TransactionsUI } from 'lib/components/TransactionsUI'
import { SignInFormContainer } from 'lib/components/SignInFormContainer'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { isEmptyObject } from 'lib/utils/isEmptyObject'

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

    <V3ApolloWrapper>
      {(client) => {
        // console.log({client})
        // check if client is ready
        if (!isEmptyObject(client)) {
          return <TransactionsUI />
        }
      }}
    </V3ApolloWrapper>

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
      <StaticNetworkNotificationBanner />

      <div
        className='pool-container flex flex-grow relative z-30 h-full page'
      >
        <div
          className='flex flex-col flex-grow'
        >
          <div
            id='top'
            className='main-nav relative z-20 pt-2'
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
