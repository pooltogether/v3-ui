// const PermitAndDepositDaiMainnet = require(`@pooltogether/pooltogether-contracts/deployments/mainnet/PermitAndDepositDai.json`)
// const PermitAndDepositDaiRinkeby = require(`@pooltogether/pooltogether-contracts/deployments/rinkeby/PermitAndDepositDai.json`)
// const PermitAndDepositDaiRopsten = require(`@pooltogether/pooltogether-contracts/deployments/ropsten/PermitAndDepositDai.json`)

import TokenFaucetProxyFactoryMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/TokenFaucetProxyFactory.json'
import TokenFaucetProxyFactoryRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/TokenFaucetProxyFactory.json'

export const ETHEREUM_NETWORKS = [1, 3, 4, 5, 42]
export const SUPPORTED_NETWORKS = [1, 4, 137, 80001]

export const SECONDS_PER_BLOCK = 14

export const SECONDS_PER_YEAR = 31536000
export const SECONDS_PER_WEEK = 604800
export const SECONDS_PER_DAY = 86400
export const SECONDS_PER_HOUR = 3600

export const DEFAULT_TOKEN_PRECISION = 18

export const COINGECKO_POLLING_INTERVAL = 120 * 1000
export const UNISWAP_POLLING_INTERVAL = process.env.NEXT_JS_DOMAIN_NAME ? 120 * 1000 : 60 * 1000
export const ERC_721_POLLING_INTERVAL = 120 * 1000
export const MAINNET_POLLING_INTERVAL = process.env.NEXT_JS_DOMAIN_NAME ? 22 * 1000 : 16 * 1000

export const PLAYER_PAGE_SIZE = 10
export const PRIZE_PAGE_SIZE = 10
export const CHART_PRIZE_PAGE_SIZE = 20

export const MAX_SAFE_INTEGER = 7199254740991

// cookie names
export const REFERRER_ADDRESS_KEY = 'referrerAddress'
export const WIZARD_REFERRER_HREF = 'wizardReferrerHref'
export const WIZARD_REFERRER_AS_PATH = 'wizardReferrerAsPath'
export const TRANSACTIONS_KEY = 'txs'
export const SHOW_MANAGE_LINKS = 'showManageLinks'
export const MAGIC_EMAIL = 'magicEmail'
export const SELECTED_WALLET_COOKIE_KEY = 'selectedWallet'

// strings
export const CONFETTI_DURATION_MS = 12000

export const DEFAULT_INPUT_CLASSES =
  'w-full text-inverse inline-flex items-center justify-between trans'

const domain = process.env.NEXT_JS_DOMAIN_NAME && `.${process.env.NEXT_JS_DOMAIN_NAME}`
export const COOKIE_OPTIONS = Object.freeze({
  sameSite: 'strict',
  secure: process.env.NEXT_JS_DOMAIN_NAME === 'pooltogether.com',
  domain
})

export const POOLS = {
  1: {
    '3.1.0': [
      {
        name: 'DAI Pool',
        symbol: 'PT-cDAI'
      },
      {
        name: 'USDC Pool',
        symbol: 'PT-cUSDC'
      },
      {
        name: 'UNI Pool',
        symbol: 'PT-cUNI'
      },
      {
        name: 'COMP Pool',
        symbol: 'PT-cCOMP'
      }
    ],
    '3.3.2': [
      {
        name: 'POOL Pool',
        symbol: 'PT-stPOOL'
      }
    ]
  },
  4: {
    '3.1.0': [
      {
        name: 'DAI Pool',
        symbol: 'PT-cDAI'
      },
      {
        name: 'BAT Pool',
        symbol: 'PT-cBAT'
      },
      {
        name: 'USDC Pool',
        symbol: 'PT-cUSDC'
      }
    ],
    '3.3.2': []
  }
}

export const ALL_POOLS = {
  1: [...POOLS[1]['3.1.0'], ...POOLS[1]['3.3.2']],
  4: [...POOLS[4]['3.1.0'], ...POOLS[4]['3.3.2']]
}

export const PRIZE_STRATEGY_TYPES = {
  singleRandomWinner: 'singleRandomWinner',
  multipleWinners: 'multipleWinners'
}

export const PRIZE_POOL_TYPES = {
  compound: 'compound',
  genericYield: 'genericYield',
  stake: 'stake'
}

export const CUSTOM_CONTRACT_ADDRESSES = {
  1: {
    Stablecoin: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    TokenFaucetProxyFactory: TokenFaucetProxyFactoryMainnet.address,
    MerkleDistributor: '0xBE1a33519F586A4c8AA37525163Df8d67997016f',
    GovernanceToken: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
    Sablier: '0xA4fc358455Febe425536fd1878bE67FfDBDEC59a',
    UniswapLPPool: '0x3af7072d29adde20fc7e173a7cb9e45307d2fb0a',
    UniswapLPTokenFaucet: '0x9a29401ef1856b669f55ae5b24505b3b6faeb370'
  },
  3: {
    Stablecoin: '0x0736d0c130b2ead47476cc262dbed90d7c4eeabd'
  },
  4: {
    Stablecoin: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad',
    TokenFaucetProxyFactory: TokenFaucetProxyFactoryRinkeby.address,
    MerkleDistributor: '0x93a6540DcE05a4A5E5B906eB97bBCBb723768F2D',
    GovernanceToken: '0xc4E90a8Dc6CaAb329f08ED3C8abc6b197Cf0F40A',
    Sablier: '0xc04Ad234E01327b24a831e3718DBFcbE245904CC'
  },
  137: {
    GovernanceToken: '',
    // PoS-Dai
    Stablecoin: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
    // PoS-Stablecoin
    // Stablecoin: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
  },
  80001: {
    GovernanceToken: '',
    Stablecoin: ''
  }
}

export const TOKEN_VALUES = {
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 5.6,
  '0x852358c72f0d38df475b58f90c9b24aadc63c9db': 1,
  '0x334cbb5858417aee161b53ee0d5349ccf54514cf': 1,
  '0x9d942bd31169ed25a1ca78c776dab92de104e50e': 279.31
  // '0x117c2aca45d87958ba054cb85af0fd57be00d624': 603.98,
  // '0xea0bea4d852687c45fdc57f6b06a8a92302baabc': 250.49
}

export const TOKEN_NAMES = {
  '0x495f947276749ce646f68ac8c248420045cb7b5e': 'OpenSea NFT Token',
  '0x334cbb5858417aee161b53ee0d5349ccf54514cf': 'PoolTogether DAI Tickets'
}

export const HISTORICAL_TOKEN_VALUES = {
  prizeNumber: {
    1: {
      '0x06f65b8cfcb13a9fe37d836fe9708da38ecb29b2': 970.23,
      '0x117c2aca45d87958ba054cb85af0fd57be00d624': 603.98,
      '0xea0bea4d852687c45fdc57f6b06a8a92302baabc': 250.49
    }
  }
}

export const V2_CUSTOM_CONTRACT_ADDRESSES = [
  '0x29fe7D60DdF151E5b52e5FAB4f1325da6b2bD958'.toLowerCase(),
  '0x0034Ea9808E620A0EF79261c51AF20614B742B24'.toLowerCase(),
  '0x9F4C5D8d9BE360DF36E67F52aE55C1B137B4d0C4'.toLowerCase(),
  '0x6F5587E191C8b222F634C78111F97c4851663ba4'.toLowerCase(),
  '0x49d716DFe60b37379010A75329ae09428f17118d'.toLowerCase(),
  '0xBD87447F48ad729C5c4b8bcb503e1395F62e8B98'.toLowerCase(),
  '0x801b4872a635dccc7e679eeaf04bef08e562972a'.toLowerCase()
]

export const STRINGS = {
  transfer: 'transfer',
  withdraw: 'withdraw'
}

export const POOL_LIST_TABS = {
  pools: 'pools',
  community: 'community'
}

export const HOTKEYS_KEY_MAP = {
  TOGGLE_THEME: 'ctrl+shift+t'
}

export const UI_LOADER_ANIM_DEFAULTS = {
  gradientRatio: 2.5,
  interval: 0.05,
  speed: 0.6
}

export const DEFAULT_QUERY_OPTIONS = Object.freeze({
  refetchInterval: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  staleTime: 15000
})
