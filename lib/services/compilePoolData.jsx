import { isEmpty } from 'lodash'
import { ethers } from 'ethers'

import {
  QUERY_KEYS
} from 'lib/constants'

import { calculateEstimatedPoolPrize } from 'lib/services/calculateEstimatedPoolPrize'
import { calculateEstimatedExternalAwardsValue } from 'lib/services/calculateEstimatedExternalAwardsValue'
import { calculateEstimatedExternalItemAwardsValue } from 'lib/services/calculateEstimatedExternalItemAwardsValue'

const _compileErc20Awards = (erc20ChainData, poolData, uniswapPriceData) => {
  const erc20GraphData = poolData?.prizeStrategy?.externalErc20Awards

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

    const balanceFormatted = ethers.utils.formatUnits(chainData.balance, parseInt(obj.decimals, 10))
    const value = priceData?.usd && parseFloat(balanceFormatted) * priceData.usd

    data[obj.address] = {
      ...obj,
      ...chainData,
      ...priceData,
      value
    }
  })

  return data
}

const _compileErc721Awards = (erc721ChainData, poolData) => {
  const erc721GraphData = poolData?.prizeStrategy?.externalErc721Awards

  if (!erc721ChainData || isEmpty(erc721ChainData) || !erc721GraphData || isEmpty(erc721GraphData)) {
    return {}
  }

  const keys = Object.keys(erc721ChainData)

  return keys.map(key => ({
    ...erc721ChainData[key],
    ...erc721GraphData[key],
  }))
}

// this gathers the current data for a pool
// note: when calculating value of ERC20 tokens this uses current chain data (infura/alchemy) to get the balance
// but uses the Uniswap subgraph to get the prices
// 
// in the compilePoolWithBlockNumber(), the balance is pulled from the pooltogether subgraph as we want the balance
// at the time the prize was awarded, etc

export const compilePoolData = (
  poolInfo,
  poolAddress,
  cache,
  poolChainData,
  poolGraphData,
  // prizeStrategyGraphData,
) => {
  const poolObj = {
    ...poolChainData,
    ...poolGraphData,
    // ...prizeStrategyGraphData
  }

  const uniswapPriceData = cache.getQueryData([QUERY_KEYS.uniswapTokensQuery, poolAddress, -1])
  const ethereumErc20Awards = cache.getQueryData([QUERY_KEYS.ethereumErc20sQuery, poolAddress])
  const ethereumErc721Awards = cache.getQueryData([QUERY_KEYS.ethereumErc721sQuery, poolAddress])

  const externalErc20Awards = _compileErc20Awards(ethereumErc20Awards, poolGraphData, uniswapPriceData)
  const externalErc721Awards = _compileErc721Awards(ethereumErc721Awards, poolGraphData)

  const externalAwardsEstimate = calculateEstimatedExternalAwardsValue(externalErc20Awards)
  // const externalItemAwardsEstimate = calculateEstimatedExternalItemAwardsValue(
  //   ethereumErc721Awards
  // )

  const interestPrizeEstimate = calculateEstimatedPoolPrize(poolObj)

  const totalPrizeEstimate = externalAwardsEstimate ?
    interestPrizeEstimate.add(ethers.utils.parseEther(
      externalAwardsEstimate.toString()
    )) :
    interestPrizeEstimate

  return {
    ...poolInfo,
    ...poolObj,
    prizeEstimate: totalPrizeEstimate,
    interestPrizeEstimate,
    externalAwardsEstimate,
    // externalItemAwardsEstimate,
    externalErc20Awards,
    externalErc721Awards
  }
}
// ethereumErc721Awards