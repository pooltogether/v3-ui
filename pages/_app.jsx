import React, { useEffect, useState } from 'react'
import i18next from "../i18n"
import { ToastContainer } from 'react-toastify'

import { AllContextProviders } from 'lib/components/contextProviders/AllContextProviders'
// import { Chart } from 'lib/components/Chart'
import { Layout } from 'lib/components/Layout'

import 'react-toastify/dist/ReactToastify.css'
import 'assets/styles/index.css'
import 'assets/styles/toast-blur.css'
import 'assets/styles/layout.css'
import 'assets/styles/loader.css'
import 'assets/styles/themes.css'
import 'assets/styles/pool.css'
import 'assets/styles/pool-toast.css'
import 'assets/styles/utils.css'
import 'assets/styles/animations.css'
import 'assets/styles/transitions.css'



function MyApp({ Component, pageProps, router }) {
  const [initialized, setInitialized] = useState(false)

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
    return null // could show loader ...
  }
  
  return <>
    {/* <Chart /> */}

    <AllContextProviders>
      <Layout
        props={pageProps}
      >
        <Component
          {...pageProps}
        />
      </Layout>
    </AllContextProviders>

    <ToastContainer
      className='pool-toast'
      position='top-center'
      autoClose={6000}
    />
  </>
}

export default MyApp