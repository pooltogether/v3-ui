import React, { useContext, useState } from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { AnimatePresence, motion, useViewportScroll } from 'framer-motion'

import { SUPPORTED_NETWORKS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { NavAccount } from 'lib/components/NavAccount'
import { DepositWizardContainer } from 'lib/components/DepositWizardContainer'
import { HeaderLogo } from 'lib/components/HeaderLogo'
import { NavMobile } from 'lib/components/NavMobile'
import { NetworkText } from 'lib/components/NetworkText'
import { ManageTicketsWizardContainer } from 'lib/components/ManageTicketsWizardContainer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'
import { PendingTxButton } from 'lib/components/PendingTxButton'
import { LanguagePicker } from 'lib/components/LanguagePicker'
import { Settings } from 'lib/components/Settings'
import { SignInFormContainer } from 'lib/components/SignInFormContainer'
import { WrongNetworkModal } from 'lib/components/WrongNetworkModal'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { ClaimRetroactivePoolWizardContainer } from 'lib/components/ClaimRetroactivePoolWizard'
import { NavPoolBalance } from 'lib/components/NavPoolBalance'
import { NotificationBanners } from 'lib/components/NotificationBanners'
import useScreenSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { Tagline } from 'lib/components/Tagline'

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index
}

export function Layout(props) {
  const { children } = props

  const shouldReduceMotion = useReducedMotion()

  const [yScrollPosition, setYScrollPosition] = useState()
  const { scrollY } = useViewportScroll()

  scrollY.onChange((y) => {
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
  const manage = /\/manage-tickets/.test(router.asPath)

  const { usersAddress, chainId } = useContext(AuthControllerContext)

  // this is useful for showing a big banner at the top that catches
  // people's attention
  const showingBanner = false
  // const showingBanner = chainId !== 1

  let supportedNetworkNames = SUPPORTED_NETWORKS.map((chainId) => chainIdToNetworkName(chainId))
  supportedNetworkNames = supportedNetworkNames.filter(onlyUnique)

  return (
    <>
      <Meta />

      <AnimatePresence>{signIn && <SignInFormContainer />}</AnimatePresence>

      <AnimatePresence>{deposit && <DepositWizardContainer {...props} />}</AnimatePresence>

      <AnimatePresence>{manage && <ManageTicketsWizardContainer {...props} />}</AnimatePresence>

      <ClaimRetroactivePoolWizardContainer />

      <WrongNetworkModal />

      <div
        className='flex flex-col w-full'
        style={{
          minHeight: '100vh'
        }}
      >
        <Header
          usersAddress={usersAddress}
          openTransactions={openTransactions}
          closeTransactions={closeTransactions}
          showTransactionsDialog={showTransactionsDialog}
        />

        <div
          className={classnames('grid-wrapper', {
            'showing-network-banner': showingBanner
          })}
        >
          <div
            className={classnames('sidebar hidden sm:block z-20', {
              'showing-network-banner': showingBanner
            })}
          >
            <Nav />
          </div>

          <div className='content'>
            <div className='pool-container w-full flex flex-grow relative z-10 h-full page px-4 xs:px-12 sm:px-10 pt-6 xs:pt-6 sm:pt-8 pb-32'>
              <div className='flex flex-col flex-grow'>
                <div
                  className='relative flex flex-col flex-grow h-full z-10 text-white'
                  style={{
                    flex: 1
                  }}
                >
                  <div className='my-0 text-inverse sm:pt-2 lg:pt-4'>
                    {React.cloneElement(children, {
                      ...props
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
  )
}

const Header = () => {
  const { usersAddress } = useContext(AuthControllerContext)
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

  return (
    <div className='w-full z-30 bg-body'>
      <div className='flex flex-row justify-between mx-auto max-w-screen-lg px-4 xs:px-12 sm:px-10 py-4 xs:pb-6 sm:pt-5 sm:pb-7 '>
        <HeaderLogo />
        <div className='flex flex-col xs:flex-row'>
          <div className='flex flex-row'>
            {usersAddress && <NetworkText openTransactions={openTransactions} />}
            <NavPoolBalance />
            <PendingTxButton openTransactions={openTransactions} />
            {usersAddress && (
              <NavAccount
                openTransactions={openTransactions}
                closeTransactions={closeTransactions}
                showTransactionsDialog={showTransactionsDialog}
              />
            )}
          </div>
          <div className='flex flex-row justify-end'>
            <LanguagePicker />
            <Settings />
          </div>
        </div>
      </div>
    </div>
  )
}

export const PageLayout = (props) => {
  const { Component, pageProps, router } = props

  return (
    <AnimatedPageGrid
      router={router}
      banner={<NotificationBanners />}
      header={<Header />}
      content={<Component {...pageProps} />}
      sideNavigation={<Nav />}
      bottomNavigation={<NavMobile />}
      footer={<Tagline />}
    />
  )
}

/**
 * Generic page layout component
 * Small screens displays navigation at the bottom of the page
 * Anything larger than xs has a sidebar
 */
const PageGrid = ({ banner, header, sideNavigation, bottomNavigation, content, footer }) => {
  const screenSize = useScreenSize()

  if (screenSize === ScreenSize.xs) {
    return (
      <div className='page-grid-wrapper h-screen'>
        <div className='grid-banner'>{banner}</div>
        <div className='grid-header'>{header}</div>
        <ContentWithFooter content={content} footer={footer} />
        <div className='grid-bottom-navigation'>{bottomNavigation}</div>
      </div>
    )
  }

  return (
    <div className='page-grid-wrapper h-screen'>
      <div className='grid-banner'>{banner}</div>
      <div className='grid-header'>{header}</div>
      <ContentWithSideNavigation
        content={content}
        footer={footer}
        sideNavigation={sideNavigation}
      />
    </div>
  )
}

/**
 * Simple wrapper for PageGrid with animations on the page content
 */
const AnimatedPageGrid = ({
  banner,
  header,
  sideNavigation,
  bottomNavigation,
  content,
  footer,
  router
}) => (
  <PageGrid
    banner={banner}
    header={header}
    content={<AnimateContent router={router}>{content}</AnimateContent>}
    footer={footer}
    sideNavigation={sideNavigation}
    bottomNavigation={bottomNavigation}
  />
)

/**
 * Page content with a footer pushed to the bottom of the screen
 */
const ContentWithFooter = ({ content, footer }) => (
  <div className='content-grid-wrapper grid-content-with-footer overflow-y-auto'>
    <Content>{content}</Content>
    <div className='grid-footer'>{footer}</div>
  </div>
)

/**
 * Page content with a footer pushed to the bottom of the screen
 * and a navigation bar to the left side
 */
const ContentWithSideNavigation = ({ content, footer, sideNavigation }) => (
  <div className='grid-content-with-side-navigation overflow-y-auto'>
    <div className='content-grid-wrapper'>
      <div className='grid-side-navigation'>{sideNavigation}</div>
      <Content>{content}</Content>
      <div className='grid-footer'>{footer}</div>
    </div>
  </div>
)

/**
 * Lowest level wrapper of page content
 * Base padding so content isn't touching the edge of the screen
 */
const Content = ({ children }) => <div className='grid-content p-4 sm:p-8 lg:p-10'>{children}</div>

/**
 * Simple wrapper for Content with animation
 */
const AnimateContent = (props) => {
  const { router } = props
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        id='content-animation-wrapper'
        key={router.route}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeIn' }}
        initial={{
          opacity: 0
        }}
        exit={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className='max-w-screen-lg mx-auto w-full'
      >
        {props.children}
      </motion.div>
    </AnimatePresence>
  )
}
