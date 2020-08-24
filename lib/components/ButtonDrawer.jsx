import React from 'react'
import ReactDOM from 'react-dom'

export const ButtonDrawer = (props) => {
  const { children } = props

  return <>
    <div
      className='hidden sm:flex items-center justify-between mt-12'
    >
      {children}
    </div>

    <div
      className='flex items-center justify-between sm:hidden h-20 l-0 r-0 b-0 fixed w-full mx-auto px-4'
      id='button-portal'
      style={{
        zIndex: 123141241
      }}
    >
      {children}
    </div>
  </>
}
