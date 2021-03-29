import React, { useContext } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'

import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'

export function ThemedClipLoader(props) {
  const { size } = props

  const { theme } = useContext(ThemeContext)

  const spinnerColor = theme === 'light' ? '#401C94' : 'rgba(255, 255, 255, 0.3)'

  return <ClipLoader size={size || 14} color={spinnerColor} />
}
