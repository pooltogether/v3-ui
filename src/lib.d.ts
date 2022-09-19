interface Window {
  // walletLinkExtension is injected by the Coinbase Wallet extension
  walletLinkExtension?: any
  ethereum?: {
    // value that is populated and returns true by the Coinbase Wallet mobile dapp browser
    isCoinbaseWallet?: true
    isMetaMask?: true
    autoRefreshOnNetworkChange?: boolean
  }
  web3?: Record<string, unknown>
}

type Value = string | number | boolean | undefined | null
type Mapping = { [key: string]: any }
type Argument = Value | Mapping | Argument[]

declare module '*.avif' {
  const src: string
  export default src
}

declare module '*.bmp' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >

  const src: string
  export default src
}
