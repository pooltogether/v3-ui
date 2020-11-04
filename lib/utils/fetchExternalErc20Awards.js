import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'
import { isEmpty } from 'lodash'

import ERC20Abi from 'lib/../abis/ERC20Abi'

import { TOKEN_VALUES } from 'lib/constants'

const debug = require('debug')('pool-app:fetchGenericChainData')

export const fetchExternalErc20Awards = async ({
  provider,
  graphErc20Awards,
  poolAddress,
  coingeckoData,
}) => {
  const poolsExternalErc20AwardsData = []
  const batchCalls = []
  
  let etherplexTokenContract
  let erc20Address
  let values
  let i
  
  const awards = graphErc20Awards?.map(award => award.address)

  // Prepare batched calls
  for (i = 0; i < awards?.length; i++) {
    erc20Address = awards[i]
    etherplexTokenContract = contract(erc20Address, ERC20Abi, erc20Address)

    batchCalls.push(
      etherplexTokenContract
        .balanceOf(poolAddress)
        .name()
        .symbol()
        .decimals()
    )
  }

  // Execute batched calls
  values = await batch(
    provider,
    ...batchCalls
  )

  // Map batch call results to erc20 data
  for (i = 0; i < awards?.length; i++) {
    erc20Address = awards[i]
    etherplexTokenContract = awards[erc20Address]

    const decimals = values[erc20Address].decimals[0]
    const balance = values[erc20Address].balanceOf[0]

    let value
    if (!isEmpty(coingeckoData)) {
      const priceData = coingeckoData[erc20Address]
      const priceUsd = priceData ? priceData?.usd : TOKEN_VALUES[erc20Address]

      const balanceFormatted = ethers.utils.formatUnits(balance, decimals)

      value = priceUsd && parseFloat(balanceFormatted) * priceUsd
    }

    poolsExternalErc20AwardsData.push({
      ...etherplexTokenContract,
      address: erc20Address,
      name: values[erc20Address].name[0],
      symbol: values[erc20Address].symbol[0],
      decimals,
      balance,
      value,
    })
  }

  return poolsExternalErc20AwardsData
}
