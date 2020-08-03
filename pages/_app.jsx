import React, { useEffect, useState } from 'react'
import i18next from "../i18n"
import { ToastContainer } from 'react-toastify'

import { AllContextProviders } from 'lib/components/contextProviders/AllContextProviders'
// import { Chart } from 'lib/components/Chart'
import { Layout } from 'lib/components/Layout'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'

// import "@reach/dialog/styles.css";
import '@reach/tooltip/styles.css'
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
    return null
    return <div
      className='h-full w-full fixed t-0 r-0 l-0 b-0'
      style={{ backgroundColor: '#1E0B43' }}
    ></div> // could show loader ...
  }
  
  return <>
    {/* <Chart /> */}

    <V3ApolloWrapper>
      <>
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
          autoClose={15000}
        />
      </>
    </V3ApolloWrapper>
  </>
}

export default MyApp