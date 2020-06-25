import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { AnimateSharedLayout, AnimatePresence, motion } from 'framer-motion'

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

function handleExitComplete() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0 })
  }
}

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return <>
    <DynamicWalletContextProvider>
      <PoolDataContextProvider>
        <Layout>
          {/* <AnimateSharedLayout transition={{ duration: 2 }}> */}
          <AnimateSharedLayout type='crossfade'>
            <AnimatePresence
              // exitBeforeEnter
              // onExitComplete={handleExitComplete}
            >
              {console.log('rendering:', router.asPath)}
              <Component
                {...pageProps}
                key={router.asPath}
              />
            </AnimatePresence>
          </AnimateSharedLayout>
        </Layout>
      </PoolDataContextProvider>
    </DynamicWalletContextProvider>
  </>
}

export default MyApp