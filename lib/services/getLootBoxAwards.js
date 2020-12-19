const MY_CRYPTO_MEMBERSHIP_ADDRESS = '0x6ca105d2af7095b1bceeb6a2113d168dddcd57cf'

const _mergeErc20Awards = (externalErc20s, erc20Balances, lootBoxAddress) => {
  let erc20Awards = {}

  externalErc20s.forEach(externalErc20 => {
    const tokenAddress = externalErc20.address
    
    erc20Awards[tokenAddress] = {
      ...externalErc20
    }
  })

  erc20Balances.forEach(erc20Balance => {
    const tokenAddress = erc20Balance.erc20Entity.id

    if (Boolean(erc20Awards[tokenAddress])) {
      const newBalance = erc20Awards[tokenAddress].balance.add(
        erc20Balance.balance
      )

      erc20Awards[tokenAddress] = {
        ...erc20Balance,
        ...erc20Awards[tokenAddress],
        address: tokenAddress,
        balance: newBalance
      }
    } else {
      erc20Awards[tokenAddress] = {
        ...erc20Balance,
        address: tokenAddress,
      }
    }
  })

  // delete MyCrypto Memberships which are ERC20s with a 0 balance (wtf?)
  delete erc20Awards[MY_CRYPTO_MEMBERSHIP_ADDRESS]

  // also remove our loot box if it's showing up as erc20 (wtf?)
  delete erc20Awards[lootBoxAddress]

  Object.keys(erc20Awards)
    .filter(key => {
      const nilBalance = parseInt(erc20Awards[key]['balance']) === 0
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

export const getLootBoxAwards = (lootBox, externalAwards) => {
  const lootBoxAddress = lootBox?.erc721

  const externalErc20s = externalAwards?.compiledExternalErc20Awards || []
  const externalErc721s = externalAwards?.compiledExternalErc721Awards || []

  const erc20Balances = lootBox?.erc20Balances || []
  const erc721Tokens = lootBox?.erc721Tokens || []
  const erc1155Tokens = lootBox?.erc1155Balances || []

  const erc20Awards = _mergeErc20Awards(externalErc20s, erc20Balances, lootBoxAddress)

  const erc721Awards = _mergeErc721Awards(externalErc721s, erc721Tokens, lootBoxAddress)

  const erc1155Awards = {
    ...erc1155Tokens
  }

  return {
    erc20Awards,
    erc721Awards,
    erc1155Awards
  }
}
