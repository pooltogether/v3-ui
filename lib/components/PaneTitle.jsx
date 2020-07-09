import React from 'react'

export const PaneTitle = (props) => {
  const {
    children
  } = props

  return <>
    <div
      className='font-bold mb-2 py-2 text-2xl sm:text-5xl lg:text-5xl text-inverse'
    >
      {children}
    </div>
  </>

}