import React from 'react'

export function ThemedClipSpinner(props) {
  const size = props.size ?? 20

  return (
    <div
      className='lds-dual-ring'
      style={{
        width: size,
        height: size
      }}
    />
  )
}
