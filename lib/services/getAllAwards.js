import { ethers } from 'ethers'

const MY_CRYPTO_MEMBERSHIP_ADDRESS = '0x6ca105d2af7095b1bceeb6a2113d168dddcd57cf'

const _mergeErc20Awards = (externalErc20s, erc20Balances, lootBoxAddress) => {
  let erc20Awards = {}

  externalErc20s = externalErc20s
    .filter(externalErc20 => externalErc20.address !== MY_CRYPTO_MEMBERSHIP_ADDRESS)
    .filter(externalErc20 => externalErc20.address !== lootBoxAddress)
  
    erc20Balances = erc20Balances
    .filter(erc20Balance => erc20Balance.address !== MY_CRYPTO_MEMBERSHIP_ADDRESS)
    .filter(erc20Balance => erc20Balance.address !== lootBoxAddress)

  // // delete MyCrypto Memberships which are ERC20s with a 0 balance (wtf?)
  // delete erc20Awards[MY_CRYPTO_MEMBERSHIP_ADDRESS]

  // // also remove our loot box if it's showing up as erc20 (wtf?)
  // delete erc20Awards[lootBoxAddress]

  

  externalErc20s.forEach(externalErc20 => {
    const tokenAddress = externalErc20.address
    
    erc20Awards[tokenAddress] = {
      ...externalErc20
    }
  })

  erc20Balances.forEach(erc20Balance => {
    const tokenAddress = erc20Balance.erc20Entity.id

    if (erc20Awards.hasOwnProperty(tokenAddress)) {
      const currentBalance = erc20Awards[tokenAddress].balanceBN
      const newBalance = erc20Balance?.balanceBN ?
        currentBalance.add(erc20Balance.balanceBN) :
        currentBalance


      erc20Awards[tokenAddress] = {
        ...erc20Balance,
        ...erc20Awards[tokenAddress],
        address: tokenAddress,
        balance: newBalance
      }
    } else {
      const decimals = erc20Balance.erc20Entity.decimals

      const balance = erc20Balance.balance
      const balanceBN = ethers.utils.bigNumberify(balance)

      const balanceFormatted = balance && decimals ?
        ethers.utils.formatUnits(balance, parseInt(decimals, 10)) :
        balance.toString()

      erc20Awards[tokenAddress] = {
        ...erc20Balance,
        ...erc20Balance.erc20Entity,
        address: tokenAddress,
        balanceBN,
        balanceFormatted,
      }
    }
  })

  Object.keys(erc20Awards)
    .filter(key => {
      const nilBalance = erc20Awards[key]['balanceBN'].eq(0)
      if (nilBalance) {
        delete erc20Awards[key]
      }
    })

  return erc20Awards
}

const _mergeErc721Awards = (externalErc721s, erc721Tokens, lootBoxAddress) => {
  let erc721Awards = {}

  externalErc721s.forEach(externalErc721 => {
    const tokenAddress = externalErc721.address

    erc721Awards[tokenAddress] = {
      ...externalErc721
    }
  })

  erc721Tokens.forEach(erc721Token => {
    const tokenAddress = erc721Token.erc721Entity.id

    erc721Awards[tokenAddress] = {
      ...erc721Token,
      ...erc721Awards[tokenAddress],
      address: tokenAddress
    }
  })

  // remove our loot box if it's showing up
  delete erc721Awards[lootBoxAddress]

  return erc721Awards
}


const _mergeErc1155Awards = (erc1155Balances, lootBoxAddress) => {
  let erc1155Awards = {}

  erc1155Balances.forEach(erc1155Token => {
    const tokenAddress = erc1155Token.erc1155Entity.id

    erc1155Awards[tokenAddress] = {
      ...erc1155Token,
      address: tokenAddress
    }
  })

  return erc1155Awards
}

export const getAllAwards = (lootBox, externalAwards) => {
  const lootBoxAddress = lootBox?.erc721

  const externalErc20s = externalAwards?.compiledExternalErc20Awards || []
  const externalErc721s = externalAwards?.compiledExternalErc721Awards || []

  const erc20Balances = lootBox?.erc20Balances || []
  const erc721Tokens = lootBox?.erc721Tokens || []
  const erc1155Balances = lootBox?.erc1155Balances || []

  const erc20Awards = _mergeErc20Awards(externalErc20s, erc20Balances, lootBoxAddress)
  const erc721Awards = _mergeErc721Awards(externalErc721s, erc721Tokens, lootBoxAddress)
  const erc1155Awards = _mergeErc1155Awards(erc1155Balances, lootBoxAddress)

  const erc20Addresses = erc20Balances
    .map(erc20Balance => erc20Balance.erc20Entity.id)
    .map(address => ({ address }))

  const erc721Addresses = erc721Tokens
    .map(erc721Token => erc721Token.erc721Entity.id)
    .map(address => ({ address }))

  const erc1155Addresses = erc1155Balances
    .map(erc1155Balance => erc1155Balance.erc1155Entity.id)
    .map(address => ({ address }))

  const lootBoxAwards = {
    erc20Addresses,
    erc721Addresses,
    erc1155Addresses,
  }

  return {
    lootBoxAwards,
    erc20Awards,
    erc721Awards,
    erc1155Awards
  }
}
