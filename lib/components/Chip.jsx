import React from 'react'
import classnames from 'classnames'

export const Chip = (props) => {
  const { className, text } = props
  let { bgClasses, textClasses } = props

  bgClasses = bgClasses || 'bg-accent-grey-5'
  textClasses = textClasses || 'text-accent-1'

  const sizeClasses = props.size || 'text-xxxxxs xs:text-xxxxs sm:text-xxxxs lg:text-xxxs'

  const classes = classnames(
    'mb-2 xs:mb-0 inline-block relative inline-block py-2 px-2 rounded-full text-center',
    className,
    textClasses,
    bgClasses,
    sizeClasses
  )

  return (
    <>
      <span
        className={classes}
        style={{
          lineHeight: '0.35rem',
        }}
      >
        {text}
      </span>
    </>
  )
}
