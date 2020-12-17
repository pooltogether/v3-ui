import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import { TOKEN_VALUES } from 'lib/constants'

export const compileLootBoxErc20s = (erc20s, uniswapPriceData) => {
  if (isEmpty(erc20s)) {
    return {}
  }

  let formattedErc20s = {}

  erc20s.forEach(obj => {
    const erc20Entity = obj.erc20Entity
    const priceData = uniswapPriceData?.[erc20Entity.id]

    let priceUSD = TOKEN_VALUES[erc20Entity.id]
    if (!priceUSD) {
      priceUSD = priceData?.usd
    }

    const balanceBN = ethers.utils.bigNumberify(obj.balance)
    const balanceFormatted = ethers.utils.formatUnits(balanceBN, parseInt(erc20Entity.decimals, 10))

    const value = priceUSD && parseFloat(balanceFormatted) * priceUSD

    formattedErc20s[obj.id] = {
      ...obj,
      ...erc20Entity,
      ...priceData,
      balanceBN,
      value
    }
  })

  return formattedErc20s
}
