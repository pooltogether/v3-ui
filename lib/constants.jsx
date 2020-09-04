export const SUPPORTED_CHAIN_IDS = [4, 42, 31337, 1234]

export const MAINNET_POLLING_INTERVAL = 15000

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
    DAI_POOL_CONTRACT_ADDRESS: '',
    USDC_POOL_CONTRACT_ADDRESS: '',
    USDT_POOL_CONTRACT_ADDRESS: '',
  },
  31337: {
    DAI_POOL_CONTRACT_ADDRESS: '',
    USDC_POOL_CONTRACT_ADDRESS: '',
    USDT_POOL_CONTRACT_ADDRESS: '',
  },
  4: {
    DAI_POOL_CONTRACT_ADDRESS: '0xf2668e44d206A73CdAC69F243B978173c1E11595',
    USDC_POOL_CONTRACT_ADDRESS: '0xA235daE8021E02B93A63aAd1677bAa9e78E8F54A',
    DAI_PRIZE_STRATEGY_CONTRACT_ADDRESS: '0xE198C2C9A6bf092527FC86bc965329E334D1Cd05',
    USDC_PRIZE_STRATEGY_CONTRACT_ADDRESS: '0x7A7f3E1B43965F9E920EcCDeFADB37dC2B33e482',
  },
  42: {
    DAI_POOL_CONTRACT_ADDRESS: '0xe5FeC839C1F713f509D938D85dc9b0293E8eeDC7',
    USDC_POOL_CONTRACT_ADDRESS: '0x3318bF4A2c5473EebdF4892Bc893F1089c2B7DA8',
    // USDT_POOL_CONTRACT_ADDRESS: '0x5f5E108A29292029034e24eF86D5c91D08879B28',
    // WBTC_POOL_CONTRACT_ADDRESS: '0x1b0ebC8357339d278173a5E21553b1f1DD770894',
    DAI_PRIZE_STRATEGY_CONTRACT_ADDRESS: '0x3166F055aBF101D22DaaC3a78Fc38883132e85c8',
    USDC_PRIZE_STRATEGY_CONTRACT_ADDRESS: '0x5b71562DFc63969b788F769b0583CE96b8053B64',
    // USDT_PRIZE_STRATEGY_CONTRACT_ADDRESS: '0x13b934744D76B57D8ea7FAff9f4a7E4609AB836a',
    // WBTC_PRIZE_STRATEGY_CONTRACT_ADDRESS: '0xAA4437bd828f466FEAE3b97b4228947B0DAAEE46',
  }
}
