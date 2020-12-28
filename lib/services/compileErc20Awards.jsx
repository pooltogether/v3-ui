import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import { DEFAULT_TOKEN_PRECISION, TOKEN_VALUES, TOKEN_NAMES } from 'lib/constants'

export const compileErc20Awards = (erc20ChainData, poolData, uniswapPriceData) => {
  const erc20GraphData = poolData?.externalErc20Awards

  const data = []
  
  if (
    isEmpty(erc20ChainData) ||
    isEmpty(erc20GraphData) ||
    isEmpty(uniswapPriceData)
  ) {
    return data
  }

  erc20GraphData.forEach(obj => {
    const chainData = erc20ChainData.find(token => obj.address === token.address)
    const priceData = uniswapPriceData[obj.address]

    const name = TOKEN_NAMES?.[obj.address] || obj?.name

    let priceUSD = TOKEN_VALUES?.[obj.address]
    if (!priceUSD) {
      priceUSD = priceData?.usd
    }
   
    let balanceFormatted = ''
    if (chainData?.balance) {
      balanceFormatted = ethers.utils.formatUnits(chainData.balance, parseInt(obj?.decimals || DEFAULT_TOKEN_PRECISION, 10))
    }
    const value = priceUSD && balanceFormatted && parseFloat(balanceFormatted) * priceUSD

    data.push({
      ...obj,
      ...chainData,
      ...priceData,
      name,
      value
    })
  })

  return data
}
