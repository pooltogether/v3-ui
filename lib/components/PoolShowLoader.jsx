import React, { useContext } from 'react'
import ContentLoader from 'react-content-loader'

import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'

export const PoolShowLoader = (
  props,
) => {
  if (!window) {
    return null
  }
  
  const themeContext = useContext(ThemeContext)
  const theme = themeContext.theme

  const bgColor = theme === 'light' ? '#ffffff' : '#401C94'
  const foreColor = theme === 'light' ? '#f5f5f5' : '#501C94'

  return <>
    <ContentLoader
      gradientRatio={2.5}
      interval={0.05}
      speed={0.6}
      viewBox='0 0 600 600'
      backgroundColor={bgColor}
      foregroundColor={foreColor}
    >
      <rect x='0' y='0' rx='5' ry='5' width='150' height='35' /> <rect x='400' y='0' rx='5' ry='5' width='200' height='35' />

      <rect x='0' y='80' rx='5' ry='5' width='600' height='80' />

      <rect x='0' y='200' rx='5' ry='5' width='190' height='100' /> <rect x='205' y='200' rx='5' ry='5' width='190' height='100' /> <rect x='410' y='200' rx='5' ry='5' width='190' height='100' />

      <rect x='0' y='310' rx='5' ry='5' width='190' height='100' /> <rect x='205' y='310' rx='5' ry='5' width='190' height='100' /> <rect x='410' y='310' rx='5' ry='5' width='190' height='100' />
    </ContentLoader>
  </> 
}
