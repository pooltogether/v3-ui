const _mergeErc20Awards = (externalErc20s, erc20Balances) => {
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
  delete erc20Awards['0x6ca105d2af7095b1bceeb6a2113d168dddcd57cf']

  return erc20Awards
}

export const getLootBoxAwards = (lootBox, externalAwards) => {
  const externalErc20s = externalAwards?.compiledExternalErc20Awards || []
  const externalErc721s = externalAwards?.compiledExternalErc721Awards || []

  const erc20Balances = lootBox?.erc20Balances || []
  const erc721Tokens = lootBox?.erc721Tokens || []
  const erc1155Tokens = lootBox?.erc1155Balances || []

  const erc20Awards = _mergeErc20Awards(externalErc20s, erc20Balances)

  const erc721Awards = {
    ...externalErc721s,
    ...erc721Tokens
  }
  
  const erc1155Awards = {
    ...erc1155Tokens
  }

  return {
    erc20Awards,
    erc721Awards,
    erc1155Awards
  }
}
