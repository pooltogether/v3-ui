import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import { DEFAULT_TOKEN_PRECISION, TOKEN_VALUES } from 'lib/constants'

export const compileLootBoxErc20s = (erc20s, uniswapPriceData) => {
  if (isEmpty(erc20s)) {
    return {}
  }

  let formattedErc20s = {}

  erc20s.forEach(obj => {
    const tokenAddress = obj?.erc20Entity?.id || obj?.address
    const tokenDecimals = obj?.erc20Entity?.decimals || obj?.decimals || DEFAULT_TOKEN_PRECISION

    const erc20Entity = obj.erc20Entity
    const priceData = uniswapPriceData?.[tokenAddress]

    let priceUSD = TOKEN_VALUES[tokenAddress.id]
    if (!priceUSD) {
      priceUSD = priceData?.usd
    }

    const balanceBN = ethers.utils.bigNumberify(obj.balance)
    const balanceFormatted = ethers.utils.formatUnits(balanceBN, parseInt(tokenDecimals, 10))

    const value = priceUSD && parseFloat(balanceFormatted) * priceUSD

    formattedErc20s[obj.id] = {
      ...obj,
      ...erc20Entity,
      ...priceData,
      address: tokenAddress,
      balanceBN,
      value
    }
  })

  return formattedErc20s
}
