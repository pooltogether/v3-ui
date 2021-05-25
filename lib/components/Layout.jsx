import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { DepositWizardContainer } from 'lib/components/DepositWizardContainer'
import { NavMobile } from 'lib/components/NavMobile'
import { ManageTicketsWizardContainer } from 'lib/components/ManageTicketsWizardContainer'
import { Nav } from 'lib/components/Nav'
import { WrongNetworkModal } from 'lib/components/WrongNetworkModal'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { ClaimRetroactivePoolWizardContainer } from 'lib/components/ClaimRetroactivePoolWizard'
import { NotificationBanners } from 'lib/components/NotificationBanners'
import useScreenSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { Tagline } from 'lib/components/Tagline'
import { Header } from 'lib/components/PageHeader'

export function Layout({ pageProps, Component, router }) {
  const deposit = /deposit/.test(router.asPath)
  const manage = /\/manage-tickets/.test(router.asPath)

  return (
    <>
      <AnimatePresence>{deposit && <DepositWizardContainer />}</AnimatePresence>

      <AnimatePresence>{manage && <ManageTicketsWizardContainer />}</AnimatePresence>

      <ClaimRetroactivePoolWizardContainer />

      <WrongNetworkModal />

      <PageLayout pageProps={pageProps} Component={Component} router={router} />
    </>
  )
}

const PageLayout = (props) => {
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

  if (screenSize <= ScreenSize.sm) {
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
const Content = ({ children }) => (
  <div className='grid-content p-4 sm:p-8 lg:p-10 text-inverse'>{children}</div>
)

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
        className='max-w-screen-sm lg:max-w-screen-lg mx-auto w-full'
      >
        {props.children}
      </motion.div>
    </AnimatePresence>
  )
}
