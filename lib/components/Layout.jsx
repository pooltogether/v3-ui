import React, { useContext, useState } from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { AnimatePresence, motion, useViewportScroll } from 'framer-motion'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { NavAccount } from 'lib/components/NavAccount'
import { DepositWizardContainer } from 'lib/components/DepositWizardContainer'
import { HeaderLogo } from 'lib/components/HeaderLogo'
import { Modal } from 'lib/components/Modal'
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

  const [yScrollPosition, setYScrollPosition] = useState()
  const { scrollY } = useViewportScroll()

  scrollY.onChange(y => {
    console.log({y})
    setYScrollPosition(y)
  })
  
  const router = useRouter()

  const signIn = router.query.signIn
  const deposit = /deposit/.test(router.asPath)
  const withdraw = /withdraw/.test(router.asPath)


  const authControllerContext = useContext(AuthControllerContext)
  const { supportedNetwork, usersAddress, chainId } = authControllerContext

  const showingNetworkBanner = chainId !== 1
  const supportedNetworkNames = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME

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

    <Modal
      visible={!supportedNetwork}
      header={<>
        Ethereum network mismatch
      </>}
    >
      Your Ethereum wallet is connected to the wrong network. Please set your network to: <span
        className='font-bold text-purple'
      >
        {supportedNetworkNames}
      </span>
    </Modal>
    
    <div
      className='flex flex-col w-full'
      style={{
        minHeight: '100vh'
      }}
    >
      <div
        className='banner fixed l-0 r-0 w-full z-30'
      >
        <StaticNetworkNotificationBanner />
      </div>

      <motion.div
        animate={yScrollPosition > 1 ? 'enter' : 'exit'}
        variants={{
          enter: {
            boxShadow: '0 2px 6px 0 rgba(0, 0, 0, .07), 0 1px 2px -1px rgba(0, 0, 0, .04)',
            transition: {
              duration: 1
            }
          },
          exit: {
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0)',
            transition: {
              duration: 0.3
            }
          }
        }}

        className={classnames(
          'header fixed w-full bg-body z-30 py-2 mx-auto l-0 r-0',
          {
            'showing-network-banner': showingNetworkBanner
          }
        )}
      >
        <div
          className='mx-auto'
        >
          <div
            className='flex justify-between items-center px-8 sm:px-10 py-4 sm:pt-5 sm:pb-3'
          >
            <HeaderLogo />

            <div
              className='flex items-center justify-end relative'
            >
              <NavAccount />

              <Settings />
            </div>
          </div>
        </div>
      </motion.div>


      <div
        className={classnames(
          'grid-wrapper',
          {
            'showing-network-banner': showingNetworkBanner
          }
        )}
      >
        <div
          className={classnames(
            'sidebar hidden sm:block z-20',
            {
              'showing-network-banner': showingNetworkBanner
            }
          )}
        >
          <div>
            <Nav />
          </div>
        </div>

        <div className='content'>
          <div
            className='pool-container flex flex-grow relative z-10 h-full page px-8 sm:px-10'
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

        </div>

      <NavMobile />
    </div>
  </>
}
