import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import { DEFAULT_TOKEN_PRECISION, TOKEN_VALUES, TOKEN_NAMES } from 'lib/constants'

export const compileLootBoxErc1155s = (erc1155Awards) => {
  let formattedErc1155s = {}

  if (isEmpty(erc1155Awards)) {
    return formattedErc1155s
  }

  const erc1155s = Object.keys(erc1155Awards)

  erc1155s.forEach((key) => {
    const award = erc1155Awards[key]

    const tokenAddress = award?.erc1155Entity?.id || award?.address

    const name = TOKEN_NAMES?.[award.address] || 'ERC1155 Token'

    const erc1155Entity = award.erc1155Entity

    const balance = award.balance.toString()
    const balanceBN = ethers.utils.bigNumberify(award.balance)
    const balanceFormatted = balance

    formattedErc1155s[award.id] = {
      ...award,
      ...erc1155Entity,
      address: tokenAddress,
      balanceFormatted,
      balanceBN,
      balance,
      name,
    }
  })

  return formattedErc1155s
}
