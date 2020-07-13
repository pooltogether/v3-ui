import React from 'react'

import { getDemoPoolContractAddress } from 'lib/utils/getDemoPoolContractAddress'

import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'

export const CurrencyAndYieldSource = (
  props,
) => {
  const {
    pool
  } = props

  const kovanDaiPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'dai')
  const kovanUsdcPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'usdc')
  const kovanUsdtPrizePoolContractAddress = getDemoPoolContractAddress('kovan', 'usdt')

  let currencyIcon = 'circle'
  if (kovanDaiPrizePoolContractAddress.toLowerCase() === pool.id) {
    currencyIcon = DaiSvg
  } else if (kovanUsdcPrizePoolContractAddress.toLowerCase() === pool.id) {
    currencyIcon = UsdcSvg
  } else if (kovanUsdtPrizePoolContractAddress.toLowerCase() === pool.id) {
    currencyIcon = UsdtSvg
  }

  return <>
    <img
      src={currencyIcon}
      className='inline-block w-6 h-6 lg:w-8 lg:h-8 mr-2'
    />
    <div
      className='bg-darkened rounded-lg px-2 uppercase text-xxs sm:text-sm font-bold mr-1'
    >
      {pool.underlyingCollateralSymbol}
    </div>
    {/* <div
      className='bg-darkened rounded-lg px-2 uppercase text-xxs sm:text-sm font-bold mr-1'
    >
      {pool.yieldSource}
    </div> */}
  </>
}
