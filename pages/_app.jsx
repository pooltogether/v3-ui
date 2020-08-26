import React, { useEffect, useState } from 'react'
import i18next from "../i18n"
import * as Fathom from 'fathom-client'
import * as Sentry from '@sentry/browser'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'

import { AllContextProviders } from 'lib/components/contextProviders/AllContextProviders'
// import { Chart } from 'lib/components/Chart'
import { Layout } from 'lib/components/Layout'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'

// import "@reach/dialog/styles.css";
import "@reach/menu-button/styles.css"
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

if (process.env.NEXT_JS_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_JS_SENTRY_DSN,
    release: process.env.NEXT_JS_RELEASE_VERSION
  })
}

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [initialized, setInitialized] = useState(false)

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

  if (!initialized) {
    return <div
      className='h-full w-full fixed t-0 r-0 l-0 b-0 text-white flex flex-col items-center justify-center'
      style={{ backgroundColor: '#1E0B43', color: 'white' }}
    >
      <V3LoadingDots />
      <h4
        className='-mt-6'
      >
        Filling up the pools ...
      </h4>
    </div>
  }
  
  return <>
    {/* <Chart /> */}

    <V3ApolloWrapper>
      <AllContextProviders>
        <Layout
          props={pageProps}
        >
          <AnimatePresence
            exitBeforeEnter
            onExitComplete={() => {
              setTimeout(() => {
                const elem = document.getElementById('content-animation-wrapper')
                
                // in case the animation failed
                elem.style.opacity = '1'
              }, 300)
              
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
        autoClose={15000}
      />
    </V3ApolloWrapper>
  </>
}

export default MyApp