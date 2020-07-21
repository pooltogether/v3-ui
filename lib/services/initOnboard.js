import Onboard from 'bnc-onboard'

import { networkNameToChainId } from 'lib/utils/networkNameToChainId'

const INFURA_KEY = process.env.NEXT_JS_INFURA_KEY
const FORTMATIC_KEY = process.env.NEXT_JS_FORTMATIC_API_KEY

// let networkName = 'mainnet'
const networkName = 'kovan'
const networkId = networkNameToChainId(networkName)
const RPC_URL = (networkName && INFURA_KEY) ?
  `https://${networkName}.infura.io/v3/${INFURA_KEY}` :
  'http://localhost:8545'

let cookieOptions = { sameSite: 'strict' }
if (process.env.NEXT_JS_DOMAIN_NAME) {
  cookieOptions = {
    ...cookieOptions,
    domain: `.${process.env.NEXT_JS_DOMAIN_NAME}`
  }
}

const WALLETS_CONFIG = [
  { walletName: "coinbase", preferred: true },
  { walletName: "trust", preferred: true, rpcUrl: RPC_URL },
  { walletName: "metamask", preferred: true },
  { walletName: "dapper" },
  // {
  //   walletName: 'trezor',
  //   appUrl: APP_URL,
  //   email: CONTACT_EMAIL,
  //   rpcUrl: RPC_URL,
  //   preferred: true
  // },
  {
    walletName: 'ledger',
    rpcUrl: RPC_URL,
    preferred: true
  },
  {
    walletName: "fortmatic",
    apiKey: FORTMATIC_KEY,
    preferred: true
  },
  {
    walletName: "authereum",
    preferred: true
  },
  {
    walletName: "walletConnect",
    infuraKey: INFURA_KEY,
    preferred: true
  },
  { walletName: "torus" },
  { walletName: "status" },
  { walletName: "unilogin" },
  {
    walletName: "walletLink",
    rpcUrl: RPC_URL,
    preferred: true
  },
  {
    walletName: "imToken",
    rpcUrl: RPC_URL
  }
]

// const apiUrl = process.env.REACT_APP_API_URL
// const dappId = '12153f55-f29e-4f11-aa07-90f10da5d778'

export const initOnboard = (subscriptions) => {
  const onboard = Onboard

  return onboard({
    // dappId,
    // hideBranding: false,
    networkId,
    // apiUrl,
    darkMode: true,
    subscriptions,
    walletSelect: {
      wallets: WALLETS_CONFIG
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
      { checkName: 'balance', minimumBalance: '100000' }
    ]
  })
}