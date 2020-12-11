import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import { TOKEN_VALUES } from 'lib/constants'

export const compileErc20Awards = (erc20ChainData, poolData, uniswapPriceData) => {
  const erc20GraphData = poolData?.externalErc20Awards
  // const erc20GraphData = poolData?.prizeStrategy?.singleRandomWinner?.externalErc20Awards

  if (
    isEmpty(erc20ChainData) ||
    isEmpty(erc20GraphData) ||
    isEmpty(uniswapPriceData)
  ) {
    return {}
  }

  let data = {}

  erc20GraphData.forEach(obj => {
    const chainData = erc20ChainData.find(token => obj.address === token.address)
    const priceData = uniswapPriceData[obj.address]

    let priceUSD = TOKEN_VALUES?.[obj.address]
    if (!priceUSD) {
      priceUSD = priceData?.usd
    }

    const balanceFormatted = ethers.utils.formatUnits(chainData.balance, parseInt(obj.decimals, 10))
    const value = priceUSD && parseFloat(balanceFormatted) * priceUSD

    data[obj.address] = {
      ...obj,
      ...chainData,
      ...priceData,
      value
    }
  })

  return data
}
