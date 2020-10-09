export const SUPPORTED_CHAIN_IDS = [4, 42, 31337, 1234]

export const CREATOR_ADDRESS = '0x38e842cfc75951d08e9e13bf6a8def90c639c136'

export const SECONDS_PER_BLOCK = 14

export const DEFAULT_TOKEN_PRECISION = 18

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

// Must be all lower-case addresses
export const DRIP_TOKENS = {
  '0xdb86318ef943027359ecd236b16ad4f82245ad0e': {name: 'Dai Ticket', symbol: 'PT-cDAI'},
  // '0x6540db1f2e837cb2aadeeeb355f7730786c10383': {name: 'Volume Drip Token', symbol: 'VDRIP'},
  // '0x36c75bfb55c69f16c676788587e7e37884d450e8': {name: 'Referral Volume Drip Token', symbol: 'RVDRIP'},
}
