import React from 'react'
import classnames from 'classnames'

import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'

export const PoolCurrencyIcon = (
  props,
) => {
  const {
    className,
    pool
  } = props
  const tokenSymbol = pool.underlyingCollateralSymbol.toLowerCase()

  let currencyIcon = 'circle'
  if (tokenSymbol === 'dai') {
    currencyIcon = DaiSvg
  } else if (tokenSymbol === 'usdc') {
    currencyIcon = UsdcSvg
  } else if (tokenSymbol === 'usdt') {
    currencyIcon = UsdtSvg
  }

  return <>
    <img
      src={currencyIcon}
      className={classnames(
        {
          [className]: className,
          'inline-block w-6 h-6 lg:w-8 lg:h-8 mr-2': !className,
        }
      )}
    />
  </>
}
