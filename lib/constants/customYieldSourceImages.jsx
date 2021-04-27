export const CUSTOM_YIELD_SOURCE_NAMES = Object.freeze({
  1: {
    '0x829df2cb6748b9fd619efcd23cc5c351957ecac9': 'rari',
    '0x4c8d99b0c7022923ef1a81adb4e4e326f8e91ac9': 'aave',
    '0x858415fdb262f17f7a63f6b1f6fed7af8308a1a7': 'aave',
    '0x2ba1e000a381ad42af10c6e33afe5994ee878d72': 'aave',
    '0x6e159b199423383572b7cb05fbbd54103a827f2b': 'aave'
  },
  4: {},
  137: {
    '0x3c7cdfb942eb98cce7e4d004e2927788cd9e54fe': 'aave'
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

export const CUSTOM_YIELD_SOURCE_IMAGES = {
  rari: '/custom-yield-source-images/rari.png',
  aave: '/custom-yield-source-images/aave.png'
}
