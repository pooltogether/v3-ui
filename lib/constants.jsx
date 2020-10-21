// const PermitAndDepositDaiMainnet = require(`@pooltogether/pooltogether-contracts/deployments/mainnet/PermitAndDepositDai.json`)
const PermitAndDepositDaiRinkeby = require(`@pooltogether/pooltogether-contracts/deployments/rinkeby/PermitAndDepositDai.json`)
// const PermitAndDepositDaiRopsten = require(`@pooltogether/pooltogether-contracts/deployments/ropsten/PermitAndDepositDai.json`)

export const SUPPORTED_CHAIN_IDS = [3, 4, 31337, 1234]

export const CREATOR_ADDRESS = '0xe0f4217390221af47855e094f6e112d43c8698fe'

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

export const CONTRACT_ADDRESSES = {
  1: {
    Dai: '0x6b175474e89094c44da98b954eedeac495271d0f',
    // PermitAndDepositDai: PermitAndDepositDaiMainnet.address
  },
  3: {
    // Dai: '0xc2118d4d90b274016cb7a54c03ef52e6c537d957',
    // PermitAndDepositDai: PermitAndDepositDaiRopsten.address
  },
  4: {
    PermitAndDepositDai: PermitAndDepositDaiRinkeby.address,
  },
}
