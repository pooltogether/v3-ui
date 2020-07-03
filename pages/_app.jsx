import React from 'react'
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
  return <>
    <Chart />

    <AllContextProviders>
      <Layout>
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