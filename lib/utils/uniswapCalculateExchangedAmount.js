import { ethers } from 'ethers'

import { DEFAULT_TOKEN_DECIMAL_PRECISION } from '../../lib/constants' 

const bn = ethers.utils.bigNumberify

export function uniswapCalculateExchangedAmount(inputAmountBN, exchangeRate, tokenDecimals) {
  let normalizedExchangedBN = bn(0)

  const decimalPrecisionDiff = DEFAULT_TOKEN_DECIMAL_PRECISION - tokenDecimals

  const normalizer = bn(Math.pow(10, decimalPrecisionDiff))

  let normalizedInputAmountBN
  if (exchangeRate > 1) {
    normalizedInputAmountBN = inputAmountBN.div(normalizer)
  } else {
    normalizedInputAmountBN = inputAmountBN.mul(normalizer)
  }

  exchangeRate = ethers.utils.parseEther(exchangeRate)

  normalizedExchangedBN = normalizedInputAmountBN.mul(exchangeRate)

  let exchangedBN
  if (exchangeRate > 1) {
    exchangedBN = normalizedExchangedBN.div(ethers.constants.WeiPerEther)
  } else {
    exchangedBN = normalizedExchangedBN.mul(ethers.constants.WeiPerEther)
  }
  
  return exchangedBN
}
