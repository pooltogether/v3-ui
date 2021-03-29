import React, { useContext } from 'react'
import ContentLoader from 'react-content-loader'
import { isMobile } from 'react-device-detect'

import { UI_LOADER_ANIM_DEFAULTS } from 'lib/constants'
import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'

export const TicketsUILoader = (props) => {
  if (!window) {
    return null
  }

  const { theme } = useContext(ThemeContext)

  const bgColor = theme === 'light' ? '#ffffff' : '#401C94'
  const foreColor = theme === 'light' ? '#f5f5f5' : '#501C94'

  if (isMobile) {
    return (
      <ContentLoader
        {...UI_LOADER_ANIM_DEFAULTS}
        viewBox='0 0 190 80'
        backgroundColor={bgColor}
        foregroundColor={foreColor}
      >
        <rect x='0' y='0' rx='5' ry='5' width='190' height='80' />
      </ContentLoader>
    )
  }

  return (
    <ContentLoader
      {...UI_LOADER_ANIM_DEFAULTS}
      viewBox='0 0 400 100'
      backgroundColor={bgColor}
      foregroundColor={foreColor}
    >
      <rect x='0' y='0' rx='5' ry='5' width='190' height='100' />{' '}
      <rect x='210' y='0' rx='5' ry='5' width='190' height='100' />
    </ContentLoader>
  )
}
