import React from 'react'
import dynamic from 'next/dynamic'

import { AutoLogin } from 'lib/components/AutoLogin'
import { Layout } from 'lib/components/Layout'
import { PoolDataContextProvider } from 'lib/components/contextProviders/PoolDataContextProvider'

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

const DynamicWalletContextProvider = dynamic(() =>
  import('lib/components/contextProviders/WalletContextProvider').then(mod => mod.WalletContextProvider),
  { ssr: false }
)

function handleExitComplete() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0 })
  }
}

function MyApp({ Component, pageProps }) {
  return <>
    <AutoLogin />

    <DynamicWalletContextProvider>
      <Layout>
        <PoolDataContextProvider>
          <Component
            {...pageProps}
          />
        </PoolDataContextProvider>
      </Layout>
    </DynamicWalletContextProvider>
  </>
}

export default MyApp