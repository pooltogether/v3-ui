import React, { useEffect, useState } from 'react'
import i18next from "../i18n"
import * as Fathom from 'fathom-client'
import * as Sentry from '@sentry/browser'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { ToastContainer } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'

import { REFERRER_ADDRESS_KEY } from 'lib/constants'
import { AllContextProviders } from 'lib/components/contextProviders/AllContextProviders'
import { BodyClasses } from 'lib/components/BodyClasses'
import { Layout } from 'lib/components/Layout'
import { GasStationQuery } from 'lib/components/GasStationQuery'
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

import 'assets/styles/radios.css'
import 'assets/styles/interactable-cards.css'
import 'assets/styles/tabs.css'

import 'assets/styles/bnc-onboard--custom.css'
import 'assets/styles/reach--custom.css'
import 'assets/styles/vx--custom.css'

import PoolTogetherMark from 'assets/images/pooltogether-white-mark.svg'

if (process.env.NEXT_JS_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_JS_SENTRY_DSN,
    release: process.env.NEXT_JS_RELEASE_VERSION
  })
}

function MyApp({ Component, pageProps, router }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (router?.query?.referrer) {
      const referrerAddress = router.query.referrer

      try {
        ethers.utils.getAddress(referrerAddress)

        Cookies.set(REFERRER_ADDRESS_KEY, referrerAddress)
      } catch (e) {
        console.error(`referrer address was an invalid Ethereum address:`, e.message)
      }
    }
  }, [])

  useEffect(() => {
    Fathom.load('ESRNTJKP', {
      includedDomains: ['staging-v3.pooltogether.com']
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])

  useEffect(() => {
    const handleExitComplete = () => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0 })
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
      />

      <V3LoadingDots />
    </motion.div>

    <V3ApolloWrapper>
      <AllContextProviders>
        <Layout
          props={pageProps}
        >
          <AnimatePresence
            exitBeforeEnter
            onExitComplete={() => {
              console.log('onExitComplete')
              setTimeout(() => {
                console.log('run!')
                const elem = document.getElementById('content-animation-wrapper')
                
                // in case the animation failed
                console.log(elem)
                if (elem) {
                  console.log('setting!')
                  elem.style.opacity = '1'
                }
              }, 1200)
              
            }}
          >
            <motion.div
              id='content-animation-wrapper'
              key={router.route}
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

    <GasStationQuery />
  </>
}

export default MyApp