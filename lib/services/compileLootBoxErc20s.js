import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import { DEFAULT_TOKEN_PRECISION, TOKEN_VALUES } from 'lib/constants'

export const compileLootBoxErc20s = (erc20Awards, uniswapPriceData) => {
  let formattedErc20s = {}

  if (isEmpty(erc20Awards)) {
    return formattedErc20s
  }

  const erc20s = Object.keys(erc20Awards)

  erc20s.forEach(key => {
    console.log('************************')
    const award = erc20Awards[key]

    const tokenAddress = award?.erc20Entity?.id || award?.address
    const tokenDecimals = award?.erc20Entity?.decimals || award?.decimals || DEFAULT_TOKEN_PRECISION

    const erc20Entity = award.erc20Entity
    const priceData = uniswapPriceData?.[tokenAddress]

    let priceUSD = TOKEN_VALUES[tokenAddress]
    if (!priceUSD) {
      priceUSD = priceData?.usd
    }

    const balanceBN = ethers.utils.bigNumberify(award.balance)
    const balanceFormatted = ethers.utils.formatUnits(balanceBN, parseInt(tokenDecimals, 10))

    const value = priceUSD && parseFloat(balanceFormatted) * priceUSD

    formattedErc20s[award.id] = {
      ...award,
      ...erc20Entity,
      ...priceData,
      address: tokenAddress,
      balanceBN,
      value
    }
  })

  return formattedErc20s
}
