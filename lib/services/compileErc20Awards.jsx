import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import { DEFAULT_TOKEN_PRECISION, TOKEN_VALUES, TOKEN_NAMES } from 'lib/constants'

// This is for current prize / non-TimeTravelPool only
export const compileErc20Awards = (erc20ChainData, poolData, uniswapPriceData) => {
  const erc20GraphData = poolData?.externalErc20Awards

  const data = []

  if (isEmpty(erc20ChainData) || isEmpty(erc20GraphData) || isEmpty(uniswapPriceData)) {
    return data
  }

  erc20GraphData.forEach((obj) => {
    const chainData = erc20ChainData.find((token) => obj.address === token.address)
    const priceData = uniswapPriceData[obj.address]

    const name = TOKEN_NAMES?.[obj.address] || obj?.name

    let priceUSD = TOKEN_VALUES?.[obj.address] || priceData?.usd

    const balanceBN = chainData?.balance
    const balance = balanceBN.toString()

    let balanceFormatted = ''
    if (chainData?.balance) {
      balanceFormatted = ethers.utils.formatUnits(
        chainData.balance,
        parseInt(obj?.decimals || DEFAULT_TOKEN_PRECISION, 10)
      )
    }
    const value = priceUSD && balanceFormatted && parseFloat(balanceFormatted) * priceUSD

    data.push({
      ...obj,
      ...chainData,
      ...priceData,
      balance,
      balanceBN,
      balanceFormatted,
      name,
      value,
    })
  })

  return data
}
