import React, { useEffect, useState } from 'react'
import i18next from "../i18n"
import { Slide, ToastContainer } from 'react-toastify'

import { AllContextProviders } from 'lib/components/contextProviders/AllContextProviders'
import { Chart } from 'lib/components/Chart'
import { Layout } from 'lib/components/Layout'

import 'react-toastify/dist/ReactToastify.css'
import 'assets/styles/index.css'
import 'assets/styles/layout.css'
import 'assets/styles/loader.css'
import 'assets/styles/themes.css'
import 'assets/styles/pool.css'
import 'assets/styles/pool-toast.css'
import 'assets/styles/utils.css'
import 'assets/styles/animations.css'
import 'assets/styles/transitions.css'


function handleExitComplete() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0 })
  }
}

function MyApp({ Component, pageProps }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initi18next = async () => {
      // console.log({ i18next})
      await i18next.initPromise.then(() => {
        // console.log(a)
        // console.log(i18next.i18n.language)
        setInitialized(true)
      })
    }
    initi18next()
  }, [])

  if (!initialized) {
    return null // could show loader ...
  }
  console.log({pageProps})
  
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
      transition={Slide}
    />
  </>
}

export default MyApp