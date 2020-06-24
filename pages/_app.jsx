import React from 'react'
import dynamic from 'next/dynamic'

import { Layout } from 'lib/components/Layout'
import { PoolDataContextProvider } from 'lib/components/contextProviders/PoolDataContextProvider'

import 'react-toastify/dist/ReactToastify.css'
import 'assets/styles/index.css'
import 'assets/styles/layout.css'
import 'assets/styles/loader.css'
import 'assets/styles/pool.css'
import 'assets/styles/pool-toast.css'
import 'assets/styles/utils.css'
import 'assets/styles/animations.css'
import 'assets/styles/transitions.css'

const DynamicWalletContextProvider = dynamic(() =>
  import('lib/components/contextProviders/WalletContextProvider').then(mod => mod.WalletContextProvider),
  { ssr: false }
)

function MyApp({ Component, pageProps }) {
  return <>
    <DynamicWalletContextProvider>
      <PoolDataContextProvider>
        <Layout>
          <Component
            {...pageProps}
          />
        </Layout>
      </PoolDataContextProvider>
    </DynamicWalletContextProvider>
  </>
}

export default MyApp