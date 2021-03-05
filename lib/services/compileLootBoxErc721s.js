import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import { DEFAULT_TOKEN_PRECISION, TOKEN_VALUES, TOKEN_NAMES } from 'lib/constants'

export const compileLootBoxErc721s = (erc721Awards) => {
  let formattedErc721s = {}

  if (isEmpty(erc721Awards)) {
    return formattedErc721s
  }

  const erc721s = Object.keys(erc721Awards)

  erc721s.forEach((key) => {
    const award = erc721Awards[key]

    const tokenAddress = award?.erc721Entity?.id || award?.address

    const name =
      TOKEN_NAMES?.[award.address] || award?.name || award?.erc721Entity?.name || 'ERC721 NFT Token'

    const erc721Entity = award.erc721Entity

    const balance = '1'
    const balanceBN = ethers.BigNumber.from(balance)
    const balanceFormatted = balance

    formattedErc721s[award.id] = {
      ...award,
      ...erc721Entity,
      address: tokenAddress,
      balance,
      balanceFormatted,
      balanceBN,
      name
    }
  })

  return formattedErc721s
}
