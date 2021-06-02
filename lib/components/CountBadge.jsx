import React from 'react'
import classnames from 'classnames'

export function CountBadge(props) {
  const { backgroundClass, count, sizeClasses, textStyle } = props

  return (
    <span
      title='active proposals to vote on'
      className={classnames(
        'text-white rounded-full flex flex-col items-center justify-center font-normal',
        sizeClasses,
        backgroundClass
      )}
      style={{
        lineHeight: '12px'
      }}
    >
      <span className='relative' style={textStyle}>
        {count}
      </span>
    </span>
  )
}
