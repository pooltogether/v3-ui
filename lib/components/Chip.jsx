import React from 'react'
import classnames from 'classnames'

export const Chip = (
  props,
) => {
  const {
    text,
  } = props

  const color = props.color || 'highlight-3'

  const sizeClasses = 'text-xxxxs lg:text-xxxs'
  const colorClasses = `text-${color} border-${color}`

  const classes = classnames(
    'inline-block border relative inline-block tracking-wide py-1 px-2 rounded-full uppercase',
    colorClasses,
    sizeClasses,
  )

  return <>
    <span
      className={classes}
      style={{
        top: -4,
        left: 4,
      }}
    >
      {text}
    </span>
  </>
}
