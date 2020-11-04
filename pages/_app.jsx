import React, { useEffect, useState } from 'react'
import i18next from "../i18n"
import * as Fathom from 'fathom-client'
import * as Sentry from '@sentry/browser'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { ToastContainer } from 'react-toastify'
import { ReactQueryDevtools } from 'react-query-devtools'
import { motion, AnimatePresence } from 'framer-motion'
import { ReactQueryCacheProvider } from 'react-query'

import { useInterval } from 'lib/hooks/useInterval'

import { COOKIE_OPTIONS, REFERRER_ADDRESS_KEY } from 'lib/constants'
import { AllContextProviders } from 'lib/components/contextProviders/AllContextProviders'
import { BodyClasses } from 'lib/components/BodyClasses'
// import { GasStationQuery } from 'lib/components/GasStationQuery'
import { Layout } from 'lib/components/Layout'
import { NewPrizeWinnerEventListener } from 'lib/components/NewPrizeWinnerEventListener'
import { TxRefetchListener } from 'lib/components/TxRefetchListener'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'

import '@reach/dialog/styles.css'
import '@reach/menu-button/styles.css'
import '@reach/tooltip/styles.css'
import 'react-toastify/dist/ReactToastify.css'

import 'assets/styles/utils.css'
import 'assets/styles/index.css'
import 'assets/styles/toast-blur.css'
import 'assets/styles/layout.css'
import 'assets/styles/loader.css'
import 'assets/styles/themes.css'

import 'assets/styles/typography.css'
import 'assets/styles/tables.css'
import 'assets/styles/pool.css'
import 'assets/styles/pool-toast.css'
import 'assets/styles/animations.css'
import 'assets/styles/transitions.css'

import 'assets/styles/interactable-cards.css'
import 'assets/styles/tabs.css'

import 'assets/styles/bnc-onboard--custom.css'
import 'assets/styles/reach--custom.css'
import 'assets/styles/vx--custom.css'

import PoolTogetherMark from 'assets/images/pooltogether-white-mark.svg'

const queryCache = new QueryCache();

if (typeof window !== 'undefined') {
  window.ethers = ethers
}

if (process.env.NEXT_JS_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_JS_SENTRY_DSN,
    release: process.env.NEXT_JS_RELEASE_VERSION
  })
}

function MyApp({ Component, pageProps, router }) {
  const [initialized, setInitialized] = useState(false)
  
  const redirectIfBorked = () => {
    const badPaths = [
      'http://localhost:3000/en',
      'https://app.pooltogether.com/en',
      'https://app.pooltogether.com/es',
      'https://app.pooltogether.com/it',
      'https://app.pooltogether.com/ja',
      'https://app.pooltogether.com/zh',
      'https://app.pooltogether.com/hr',
      'https://app.pooltogether.com/ko',
      'https://app.pooltogether.com/tr',
      'https://app.pooltogether.com/de',
    ]
    // console.log('checking')

    if (badPaths.includes(window.location.href)) {
      router.push(
        '/',
        '/',
        { shallow: true }
      )
    }
  }
  
  useEffect(() => {
    redirectIfBorked()
  }, [])
  
  useInterval(() => {
    redirectIfBorked()
  }, 1000)
  

  useEffect(() => {
    if (router?.query?.referrer) {
      const referrerAddress = router.query.referrer

      try {
        ethers.utils.getAddress(referrerAddress)

        Cookies.set(
          REFERRER_ADDRESS_KEY,
          referrerAddress,
          COOKIE_OPTIONS
        )
      } catch (e) {
        console.error(`referrer address was an invalid Ethereum address:`, e.message)
      }
    }
  }, [])

  useEffect(() => {
    const fathomSiteId = process.env.NEXT_JS_FATHOM_SITE_ID

    if (fathomSiteId) {
      Fathom.load(process.env.NEXT_JS_FATHOM_SITE_ID, {
        url: 'https://goose.pooltogether.com/script.js',
        includedDomains: [
          'app-v3.pooltogether.com',
          'app.pooltogether.com',
          'staging.pooltogether.com',
        ]
      })
  
      function onRouteChangeComplete(url) {
        if (window['fathom']) {
          window['fathom'].trackPageview()
        }
      }
  
      router.events.on('routeChangeComplete', onRouteChangeComplete)
  
      return () => {
        router.events.off('routeChangeComplete', onRouteChangeComplete)
      }
    }
  }, [])

  useEffect(() => {

    const handleExitComplete = () => {
      if (typeof window !== 'undefined') {
        // window.scrollTo({ top: 0 })

        // make sure opacity gets set back to 1 after page transitions!
        setTimeout(() => {
          const elem = document.getElementById('content-animation-wrapper')

          // in case the animation failed
          if (elem) {
            elem.style.opacity = '1'
          }
        }, 1000)
      }
    }

    


    router.events.on('routeChangeComplete', handleExitComplete)
    return () => {
      router.events.off('routeChangeComplete', handleExitComplete)
    }
  }, [])

  useEffect(() => {
    const initi18next = async () => {
      await i18next.initPromise.then(() => {
        setInitialized(true)
      })
    }
    initi18next()
  }, [])

  return <>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <BodyClasses />

      <motion.div
        animate={!initialized ? 'enter' : 'exit'}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        variants={{
          initial: {
            opacity: 1,
          },
          enter: {
            opacity: 1,
          },
          exit: {
            opacity: 0,
            transitionEnd: {
              display: "none",
            },
          }
        }}
        className='h-screen w-screen fixed t-0 r-0 l-0 b-0 text-white flex flex-col items-center justify-center'
        style={{
          backgroundColor: '#1E0B43',
          color: 'white',
          zIndex: 12345678
        }}
      >
        <img
          src={PoolTogetherMark}
          className='w-8 outline-none -mt-20'
          style={{ borderWidth: 0 }}
        />

        <V3LoadingDots />
      </motion.div>

      <V3ApolloWrapper>
        <AllContextProviders>
          <NewPrizeWinnerEventListener />

          <TxRefetchListener />

          <Layout
            props={pageProps}
          >
            <AnimatePresence
              exitBeforeEnter
            >
              <motion.div
                id='content-animation-wrapper'
                key={router.route}
                transition={{ duration: 0.3, ease: 'easeIn' }}
                initial={{
                  opacity: 0
                }}
                exit={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
              >
                <Component {...pageProps} />
              </motion.div>
            </AnimatePresence>
          </Layout>
        </AllContextProviders>

        <ToastContainer
          className='pool-toast'
          position='top-center'
          autoClose={7000}
        />

      </V3ApolloWrapper>

      <ReactQueryDevtools />
    </ReactQueryCacheProvider>
  </>
}

export default MyApp