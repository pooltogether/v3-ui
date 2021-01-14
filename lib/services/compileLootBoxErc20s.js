import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import { DEFAULT_TOKEN_PRECISION, TOKEN_VALUES, TOKEN_NAMES } from 'lib/constants'

export const compileLootBoxErc20s = (erc20Awards, uniswapPriceData) => {
  let formattedErc20s = {}

  if (isEmpty(erc20Awards)) {
    return formattedErc20s
  }

  const erc20s = Object.keys(erc20Awards)
    

  erc20s.forEach(key => {
    const award = erc20Awards[key]

    const tokenAddress = award?.erc20Entity?.id || award?.address
    const tokenDecimals = award?.erc20Entity?.decimals || award?.decimals || DEFAULT_TOKEN_PRECISION

    const name = TOKEN_NAMES?.[award.address] || award?.name || award?.erc20Entity?.name

    const erc20Entity = award.erc20Entity
    const priceData = uniswapPriceData?.[tokenAddress]

    const priceUSD = TOKEN_VALUES[tokenAddress] || priceData?.usd || award?.usd

    let balanceBN = award?.balance || award?.balanceAwarded || ethers.utils.bigNumberify(0)
    if (typeof balanceBN === 'string') {
      balanceBN = ethers.utils.bigNumberify(balanceBN)
    }

    const balanceFormatted = ethers.utils.formatUnits(balanceBN, parseInt(tokenDecimals, 10))

    const value = priceUSD && parseFloat(balanceFormatted) * priceUSD

    formattedErc20s[award.id] = {
      ...award,
      ...erc20Entity,
      ...priceData,
      name,
      address: tokenAddress,
      balanceFormatted,
      balanceBN,
      value
    }
  })

  return formattedErc20s
}
