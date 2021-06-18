import React from 'react'

import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'

export const ContentOrSpinner = (props) => {
  const { children, isLoading } = props

  return isLoading ? <ThemedClipSpinner size={12} /> : children
}
