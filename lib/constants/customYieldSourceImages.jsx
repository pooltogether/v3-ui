export const CUSTOM_YIELD_SOURCE_NAMES = Object.freeze({
  1: {
    '0x829df2cb6748b9fd619efcd23cc5c351957ecac9': 'rari',
    '0x4c8d99b0c7022923ef1a81adb4e4e326f8e91ac9': 'aave',
    '0x858415fdb262f17f7a63f6b1f6fed7af8308a1a7': 'aave',
    '0x2ba1e000a381ad42af10c6e33afe5994ee878d72': 'aave',
    '0x6e159b199423383572b7cb05fbbd54103a827f2b': 'aave',
    '0x9858ac37e385e52da6385d828cfe55a182d8ffa6': 'sushiBar'
  },
  4: {},
  137: {
    '0x3c7cdfb942eb98cce7e4d004e2927788cd9e54fe': 'aave',
    '0xabcea7b7f5ea7929b1df9e3e7241547fe7b7af14': 'aave'
  },
  80001: {}
})

export const KNOWN_YIELD_SOURCES = Object.keys(CUSTOM_YIELD_SOURCE_NAMES).reduce(
  (KNOWN_YIELD_SOURCES, chainId) => {
    const addresses = Object.keys(CUSTOM_YIELD_SOURCE_NAMES[chainId])
    KNOWN_YIELD_SOURCES[chainId] = addresses
    return KNOWN_YIELD_SOURCES
  },
  {}
)

export const CUSTOM_YIELD_SOURCE_TOKEN_ADDRESS = {
  comp: '0xc00e94cb662c3520282e6f5717214004a7f26888',
  cream: '0x2ba592F78dB6436527729929AAf6c908497cB200',
  rari: '0xD291E7a03283640FDc51b121aC401383A46cC623',
  aave: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  sushiBar: '0x8798249c2e607446efb7ad49ec89dd1865ff4272'
}
