import React from 'react'
import classnames from 'classnames'

import DaiSvg from 'assets/images/dai-new-transparent.png'
import WbtcSvg from 'assets/images/asset_BTC.svg'
// import DaiSvg from 'assets/images/dai.svg'
import MissingCurrencySvg from 'assets/images/help-circle.svg'
import UsdcSvg from 'assets/images/usdc-new-transparent.png'
// import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt-new-transparent.png'
// import UsdtSvg from 'assets/images/usdt.svg'

export const PoolCurrencyIcon = (
  props,
) => {
  const {
    className,
    pool
  } = props
  const symbol = pool && pool.underlyingCollateralSymbol
  const tokenSymbol = symbol && symbol.toLowerCase()

  let currencyIcon = 'circle'
  if (tokenSymbol === 'dai') {
    currencyIcon = DaiSvg
  } else if (tokenSymbol === 'usdc') {
    currencyIcon = UsdcSvg
  } else if (tokenSymbol === 'usdt') {
    currencyIcon = UsdtSvg
  } else if (tokenSymbol === 'wbtc') {
    currencyIcon = WbtcSvg
  } else {
    currencyIcon = MissingCurrencySvg
  }

  return <>
    <img
      src={currencyIcon}
      className={classnames(
        {
          [className]: className,
          'inline-block w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mr-2': !className,
        }
      )}
    />
  </>
}
