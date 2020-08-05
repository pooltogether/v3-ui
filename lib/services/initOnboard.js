import Onboard from 'bnc-onboard'

import { networkNameToChainId } from 'lib/utils/networkNameToChainId'

const INFURA_KEY = process.env.NEXT_JS_INFURA_KEY
const FORTMATIC_KEY = process.env.NEXT_JS_FORTMATIC_API_KEY

const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME
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

export const initOnboard = (subscriptions) => {
  const onboard = Onboard

  console.log('RUNNING initOnboard!')

  return onboard({
    hideBranding: true,
    networkId,
    darkMode: false,
    subscriptions,
    walletSelect: {
      wallets: WALLETS_CONFIG
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
      // { checkName: 'balance' }
    ]
  })
}