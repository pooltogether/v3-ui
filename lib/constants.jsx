export const SUPPORTED_CHAIN_IDS = [4, 42, 31337, 1234]

export const CREATOR_ADDRESS = '0xa847db8fcea81f5652166de4c073e698de884b40'

export const MAINNET_POLLING_INTERVAL = 30000

export const MAX_SAFE_INTEGER = 9007199254740991

// cookie names
export const REFERRER_ADDRESS_KEY = 'referrerAddress'
export const WIZARD_REFERRER_HREF = 'wizardReferrerHref'
export const WIZARD_REFERRER_AS_PATH = 'wizardReferrerAsPath'
export const STORED_CHAIN_ID_KEY = 'chainId'
export const TRANSACTIONS_KEY = 'txs'
export const SHOW_MANAGE_LINKS = 'showAwardFeatures'
export const MAGIC_EMAIL = 'magicEmail'
export const SELECTED_WALLET_COOKIE_KEY = 'selectedWallet'

export const CONFETTI_DURATION_MS = 12000

const domain = process.env.NEXT_JS_DOMAIN_NAME && `.${process.env.NEXT_JS_DOMAIN_NAME}`

export const COOKIE_OPTIONS = {
  sameSite: 'strict',
  secure: process.env.NEXT_JS_DOMAIN_NAME === 'pooltogether.com',
  domain
}

export const DRIP_TOKENS = {
  '0xdb75b845960c835b6086db1bd3087ea01e7d8bde': {name: 'Balance Drip Token', symbol: 'BDRIP'},
  '0xe5723dcaad584418f2ba31678743e194e9d042d0': {name: 'Volume Drip Token', symbol: 'VDRIP'},
  // '': {name: 'Referral Volume Drip Token', symbol: 'RVDRIP'},
}
