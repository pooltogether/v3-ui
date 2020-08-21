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
import { NetworkText } from 'lib/components/NetworkText'
import { WithdrawWizardContainer } from 'lib/components/WithdrawWizardContainer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'
import { LanguagePicker } from 'lib/components/LanguagePicker'
import { Settings } from 'lib/components/Settings'
import { SignInFormContainer } from 'lib/components/SignInFormContainer'

export const Layout = (props) => {
  const {
    children
  } = props

  const [yScrollPosition, setYScrollPosition] = useState()
  const { scrollY } = useViewportScroll()

  scrollY.onChange(y => {
    setYScrollPosition(y)
  })

  const [showTransactionsDialog, setShowTransactionsDialog] = useState(false)

  const openTransactions = (e) => {
    e.preventDefault()
    setShowTransactionsDialog(true)
  }

  const closeTransactions = (e) => {
    if (e) {
      e.preventDefault()
    }
    setShowTransactionsDialog(false)
  }
  
  const router = useRouter()

  const signIn = router.query.signIn
  const deposit = /deposit/.test(router.asPath)
  const withdraw = /withdraw/.test(router.asPath)


  const authControllerContext = useContext(AuthControllerContext)
  const { supportedNetwork, usersAddress, chainId } = authControllerContext

  // this is useful for showing a big banner at the top that catches
  // people's attention
  const showingBanner = false
  // const showingBanner = chainId !== 1
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
      Your Ethereum wallet is connected to the wrong network. Please set your network to: <div
        className='font-bold text-white text-center mt-2'
      >
        <div
          className='bg-purple px-2 py-1 w-24 rounded-full mr-2 mt-2'
        >
          {supportedNetworkNames}
        </div>
      </div>
    </Modal>
    
    <div
      className='flex flex-col w-full'
      style={{
        minHeight: '100vh'
      }}
    >
      <motion.div
        // animate={yScrollPosition > 1 ? 'enter' : 'exit'}
        // variants={{
        //   enter: {
        //     boxShadow: '0 2px 6px 0 rgba(0, 0, 0, .07), 0 1px 2px -1px rgba(0, 0, 0, .04)',
        //     transition: {
        //       duration: 1
        //     }
        //   },
        //   exit: {
        //     boxShadow: '0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0)',
        //     transition: {
        //       duration: 0.3
        //     }
        //   }
        // }}

        className={classnames(
          'header fixed w-full bg-body z-30 py-2 mx-auto l-0 r-0',
          {
            'showing-network-banner': showingBanner
          }
        )}
      >
      
        <div
          className='flex justify-between items-center px-4 xs:px-12 sm:px-10 py-4 sm:pt-5 sm:pb-3'
        >
          <HeaderLogo />

          <div
            className={classnames(
              'flex items-center justify-end flex-row flex-wrap relative',
              {
                // 'items-end xs:items-center justify-end sm:justify-center': usersAddress,
                // 'items-center': !usersAddress
              }
            )}
            style={{
              lineHeight: 0
            }}
          >
            {usersAddress && <>
              <NavAccount
                openTransactions={openTransactions}
                closeTransactions={closeTransactions}
                showTransactionsDialog={showTransactionsDialog}
              />
            </>}
            
            {usersAddress && <>
              <NetworkText
                openTransactions={openTransactions}
              />
            </>}

            <LanguagePicker />

            <Settings />
          </div>
        </div>
      </motion.div>


      <div
        className={classnames(
          'grid-wrapper',
          {
            'showing-network-banner': showingBanner
          }
        )}
      >
        <div
          className={classnames(
            'sidebar hidden sm:block z-20',
            {
              'showing-network-banner': showingBanner
            }
          )}
        >
          <Nav />
        </div>

        <div className='content'>
          <div
            className='pool-container w-full flex flex-grow relative z-10 h-full page px-4 xs:px-12 sm:px-10 pt-6 xs:pt-6 sm:pt-8'
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
                  className='my-0 text-inverse sm:pt-2 lg:pt-4'
                >
                  {React.cloneElement(children, {
                    ...props,
                  })}

                  <div
                    className='text-accent-1 text-center text-base sm:text-lg lg:text-xl mt-20 opacity-40'
                  >
                    The more you pool, the more you save, the more you win.
                  </div>
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
