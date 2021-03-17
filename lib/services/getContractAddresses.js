// import { contractAddresses } from '@pooltogether/current-pool-data'

const contractAddresses = {
  1: {
    reserve: '0xdb8E47BEFe4646fCc62BE61EEE5DF350404c124F',
    reserveRegistry: '0x3e8b9901dBFE766d3FE44B36c180A1bca2B9A295',
    lootBox: '0x4d695c615a7AACf2d7b9C481B66045BB2457Dfde',
    lootBoxController: '0x2c2a966b7F5448A36EC9f896088DfB99B21d8A24',
    lootBoxPrizeStrategyListener: '0xfe7205DF55BA42c8801e44B55BF05F06cCe8565E',
    daiFaucet: '0xF362ce295F2A4eaE4348fFC8cDBCe8d729ccb8Eb',
    usdcFaucet: '0xbd537257fad96e977b9e545be583bbf7028f30b9',
    uniFaucet: '0xa5dddefD30e234Be2Ac6FC1a0364cFD337aa0f61',
    merkleDistributor: '0xBE1a33519F586A4c8AA37525163Df8d67997016f',
    poolToken: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
    compFaucet: '0x72F06a78bbAac0489067A1973B0Cef61841D58BC',
    dai: {
      prizePool: '0xEBfb47A7ad0FD6e57323C8A42B2E5A6a4F68fc1a',
      prizeStrategy: '0x178969A87a78597d303C47198c66F68E8be67Dc2'
    },
    uni: {
      prizePool: '0x0650d780292142835F6ac58dd8E2a336e87b4393',
      prizeStrategy: '0xe8726B85236a489a8E84C56c95790d07a368f913'
    },
    usdc: {
      prizePool: '0xde9ec95d7708b8319ccca4b8bc92c0a3b70bf416',
      prizeStrategy: '0x3d9946190907ada8b70381b25c71eb9adf5f9b7b'
    },
    comp: {
      prizePool: '0xBC82221e131c082336cf698F0cA3EBd18aFd4ce7',
      prizeStrategy: '0x3ec4694b65e41f12d6b5d5ba7c2341f4d6859773'
    },
    pool: {
      prizePool: '0x396b4489da692788e327e2e4b2b0459a5ef26791',
      prizeStrategy: '0x21e5e62e0b6b59155110cd36f3f6655fbbcf6424'
    }
  },
  31337: {
    dai: {
      prizePool: '',
      prizeStrategy: ''
    },
    usdc: {
      prizePool: '',
      prizeStrategy: ''
    },
    usdt: {
      prizePool: '',
      prizeStrategy: ''
    }
  },
  3: {
    dai: {
      prizePool: '0x7e72cfd7F2a0dB4Aa4B1A5b3FaBadc98d45bbeD7',
      prizeStrategy: '0x29c70754A028B377B04595f11eFcb825566e9A21'
    },
    usdc: {
      prizePool: '0x4B5980f347aDae56e8cb2f9C3BFD7ECf19a0b805',
      prizeStrategy: '0x55c06f1Ed5c73E70e07f99dB1dE2FfF697c2d5a1'
    },
    usdt: {
      prizePool: '0x1bd5dd378B4aFF78f09Dcae425A00FC4A8e13B24',
      prizeStrategy: '0x906f199B89B5e3D5d615e2aaB323a77E8CfAD778'
    }
  },
  4: {
    lootBox: '0xfbC6677806253dB9739d0F6CBD89b9e7Ed4A5c66',
    lootBoxController: '0xb1EAc75da9bc31B078742C5AF9EDe62EFE31299D',
    merkleDistributor: '0x93a6540DcE05a4A5E5B906eB97bBCBb723768F2D',
    poolToken: '0xc4E90a8Dc6CaAb329f08ED3C8abc6b197Cf0F40A',
    dai: {
      prizePool: '0x4706856FA8Bb747D50b4EF8547FE51Ab5Edc4Ac2',
      prizeStrategy: '0x5E0A6d336667EACE5D1b33279B50055604c3E329'
    },
    usdc: {
      prizePool: '0xde5275536231eCa2Dd506B9ccD73C028e16a9a32',
      prizeStrategy: '0x1b92BC2F339ef25161711e4EafC31999C005aF21'
    },
    usdt: {
      prizePool: '0xDCB24C5C96D3D0677add5B688DCD144601410244',
      prizeStrategy: '0x1607ce8aDe05C324043D7f5362A6d856cd4Ae589'
    },
    bat: {
      prizePool: '0xab068F220E10eEd899b54F1113dE7E354c9A8eB7',
      prizeStrategy: '0x41CF0758b7Cc2394b1C2dfF6133FEbb0Ef317C3b'
    }
  }
}

export const getContractAddresses = (chainId) => {
  let daiPoolAddress,
    batPoolAddress,
    uniPoolAddress,
    usdcPoolAddress,
    compPoolAddress,
    poolPoolAddress,
    lootBox,
    lootBoxController

  batPoolAddress = contractAddresses[chainId].bat?.prizePool?.toLowerCase()
  daiPoolAddress = contractAddresses[chainId].dai?.prizePool?.toLowerCase()
  uniPoolAddress = contractAddresses[chainId].uni?.prizePool?.toLowerCase()
  usdcPoolAddress = contractAddresses[chainId].usdc?.prizePool?.toLowerCase()
  compPoolAddress = contractAddresses[chainId].comp?.prizePool?.toLowerCase()
  poolPoolAddress = contractAddresses[chainId].pool?.prizePool?.toLowerCase()

  lootBox = contractAddresses[chainId].lootBox?.toLowerCase()
  lootBoxController = contractAddresses[chainId].lootBoxController?.toLowerCase()

  const pools = [
    daiPoolAddress,
    batPoolAddress,
    uniPoolAddress,
    usdcPoolAddress,
    compPoolAddress,
    poolPoolAddress
  ].filter((pool) => pool !== undefined)

  return {
    pools,
    'PT-cDAI': daiPoolAddress,
    'PT-cBAT': batPoolAddress,
    'PT-cUNI': uniPoolAddress,
    'PT-cUSDC': usdcPoolAddress,
    'PT-cCOMP': compPoolAddress,
    'PT-pPOOL': poolPoolAddress,
    'lootBox': lootBox,
    'lootBoxController': lootBoxController,
    'v2DAIPool': '0x29fe7D60DdF151E5b52e5FAB4f1325da6b2bD958'.toLowerCase(),
    'v2USDCPool': '0x0034Ea9808E620A0EF79261c51AF20614B742B24'.toLowerCase(),
    'v2DAIPod': '0x9F4C5D8d9BE360DF36E67F52aE55C1B137B4d0C4'.toLowerCase(),
    'v2USDCPod': '0x6F5587E191C8b222F634C78111F97c4851663ba4'.toLowerCase(),
    'v2PoolDAIToken': '0x49d716DFe60b37379010A75329ae09428f17118d'.toLowerCase(),
    'v2PoolUSDCToken': '0xBD87447F48ad729C5c4b8bcb503e1395F62e8B98'.toLowerCase(),
    'v2MigrationContractAddress': '0x801b4872a635dccc7e679eeaf04bef08e562972a'.toLowerCase()
  }
}
