import { ethers } from 'ethers'

const MY_CRYPTO_MEMBERSHIP_ADDRESS = '0x6ca105d2af7095b1bceeb6a2113d168dddcd57cf'
const GOLDSTORAGE_TOKEN = '0x0d16450d347c12c086d6c94c76c5aaac35ea07e0'

const _mergeErc20Awards = (externalErc20s, erc20Balances, lootBoxAddress) => {
  let erc20Awards = {}

  externalErc20s = externalErc20s
    .filter((externalErc20) => externalErc20.address !== MY_CRYPTO_MEMBERSHIP_ADDRESS)
    .filter((externalErc20) => externalErc20.address !== lootBoxAddress)

  erc20Balances = erc20Balances.filter(
    (erc20Balance) => erc20Balance.erc20Entity.id !== GOLDSTORAGE_TOKEN
  )

  externalErc20s.forEach((externalErc20) => {
    const tokenAddress = externalErc20.address

    erc20Awards[tokenAddress] = {
      ...externalErc20
    }
  })

  erc20Balances.forEach((erc20Balance) => {
    const tokenAddress = erc20Balance.erc20Entity.id

    if (erc20Awards.hasOwnProperty(tokenAddress)) {
      const currentBalance = erc20Awards[tokenAddress].balanceBN
      const newBalance = erc20Balance?.balanceBN
        ? currentBalance.add(erc20Balance.balanceBN)
        : currentBalance

      erc20Awards[tokenAddress] = {
        ...erc20Balance,
        ...erc20Awards[tokenAddress],
        address: tokenAddress,
        balance: newBalance
      }
    } else {
      const decimals = erc20Balance.erc20Entity.decimals

      const balance = erc20Balance.balance
      const balanceBN = ethers.BigNumber.from(balance)

      const balanceFormatted =
        balance && decimals
          ? ethers.utils.formatUnits(balance, parseInt(decimals, 10))
          : balance.toString()

      erc20Awards[tokenAddress] = {
        ...erc20Balance,
        ...erc20Balance.erc20Entity,
        address: tokenAddress,
        balanceBN,
        balanceFormatted
      }
    }
  })

  Object.keys(erc20Awards).filter((key) => {
    const nilBalance = erc20Awards[key]['balanceBN'].eq(0)
    if (nilBalance) {
      delete erc20Awards[key]
    }
  })

  return erc20Awards
}

const _mergeErc721Awards = (externalErc721s, erc721Tokens, lootBoxAddress) => {
  let erc721Awards = {}

  externalErc721s.forEach((externalErc721) => {
    const tokenAddress = externalErc721.address

    erc721Awards[tokenAddress] = {
      ...externalErc721
    }
  })

  erc721Tokens.forEach((erc721Token) => {
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

  erc1155Balances.forEach((erc1155Token) => {
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

  const lootBoxAwards = {
    erc20s: erc20Balances,
    erc721s: erc721Tokens,
    erc1155s: erc1155Balances
  }

  const erc20Awards = _mergeErc20Awards(externalErc20s, erc20Balances, lootBoxAddress)
  const erc721Awards = _mergeErc721Awards(externalErc721s, erc721Tokens, lootBoxAddress)
  const erc1155Awards = _mergeErc1155Awards(erc1155Balances, lootBoxAddress)

  return {
    lootBoxAwards,
    erc20Awards,
    erc721Awards,
    erc1155Awards
  }
}
