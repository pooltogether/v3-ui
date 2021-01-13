import React from 'react'
import classnames from 'classnames'


export const Banner = (props) => {
  const { className, children, style } = props

  return <div className={classnames('p-4 sm:p-8 pool-gradient-1 rounded-lg', className)} style={style}>
    {children}
  </div>
}