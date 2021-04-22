import React, { useContext } from 'react'
import classnames from 'classnames'
import { isUndefined } from 'lodash'
import { motion } from 'framer-motion'

import { TOKEN_IMAGES } from 'lib/constants/tokenImages'
import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'
import { useCoingeckoTokenInfoQuery } from 'lib/hooks/useCoingeckoTokenInfoQuery'

import DaiSvg from 'assets/images/dai-new-transparent.png'
import UsdcSvg from 'assets/images/usdc-new-transparent.png'
import UsdtSvg from 'assets/images/usdt-new-transparent.png'
import PoolSvg from 'assets/images/pool-icon.svg'
import BatSvg from 'assets/images/bat-new-transparent.png'
import CompSvg from 'assets/images/comp.svg'
import UniSvg from 'assets/images/token-uni.png'
import UniThemeLightSvg from 'assets/images/uniwap-theme-light-logo.svg'
import ZrxSvg from 'assets/images/zrx-new-transparent.png'

// This was separated into it's own component to comply with the rules of hooks
const CoingeckoOrPlaceholder = (props) => {
  const { address, className } = props

  let src

  // Check Coingecko for img
  const { data: tokenInfo } = useCoingeckoTokenInfoQuery(address)
  src = tokenInfo?.image?.small

  // Fallback to placeholder
  if (!src) {
    src = '/tokens/eth-placeholder.png'
  }

  return (
    <motion.img
      src={src}
      className={className}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
    />
  )
}

export const PoolCurrencyIcon = (props) => {
  const { className, noMediaQueries, sm, lg, xl, xs, address } = props
  const symbol = props.symbol?.toLowerCase()
  const { theme } = useContext(ThemeContext)

  const noMargin = props.noMargin || false

  let src
  if (symbol === 'dai') {
    src = DaiSvg
  } else if (symbol === 'usdc') {
    src = UsdcSvg
  } else if (symbol === 'usdt') {
    src = UsdtSvg
  } else if (symbol === 'comp') {
    src = CompSvg
  } else if (symbol === 'pool') {
    src = PoolSvg
  } else if (symbol === 'bat') {
    src = BatSvg
  } else if (symbol === 'zrx') {
    src = ZrxSvg
  } else if (symbol === 'uni') {
    src = theme === 'light' ? UniThemeLightSvg : UniSvg
  }

  let sizeClasses = 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10'
  if (isUndefined(noMediaQueries)) {
    if (xs) {
      sizeClasses = 'w-3 h-3 sm:w-5 sm:h-5 lg:w-6 lg:h-6'
    } else if (sm) {
      sizeClasses = 'w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8'
    } else if (lg) {
      sizeClasses = 'w-8 h-8 sm:w-14 sm:h-14'
    } else if (xl) {
      sizeClasses = 'w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18'
    }
  } else {
    if (lg) {
      sizeClasses = 'w-10 h-10'
    } else if (xl) {
      sizeClasses = 'w-12 h-12'
    } else {
      sizeClasses = 'w-8 h-8'
    }
  }

  const classes = classnames(sizeClasses, {
    [className]: className,
    'inline-block': !className,
    'mr-1': !noMargin
  })

  // Get from hard-coded img URL store
  if (!src) {
    src = TOKEN_IMAGES[address?.toLowerCase()]
  }

  return !src ? (
    <CoingeckoOrPlaceholder address={address} className={classes} />
  ) : (
    <img src={src} className={classes} />
  )
}
