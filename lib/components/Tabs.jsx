import React from 'react'
import classnames from 'classnames'

export const Tabs = ({ children }) => {
  return <nav className='flex items-center justify-center mb-2 mx-auto text-center'>{children}</nav>
}

export const Tab = ({ isSelected, onClick, children }) => {
  return (
    <a
      onClick={onClick}
      className={classnames(
        'cursor-pointer border-b-4 relative capitalize text-center leading-none flex justify-start items-center text-sm xs:text-lg lg:text-xl py-2  lg:px-8 trans tracking-wider outline-none focus:outline-none active:outline-none font-bold mx-1 xs:mx-2 sm:mx-3',
        {
          'text-default hover:text-highlight-2 border-transparent': !isSelected,
          'selected border-highlight-2': isSelected,
        }
      )}
    >
      {children}
    </a>
  )
}

export const ContentPane = ({ children, isSelected, alwaysPresent }) => {
  let hiddenClassName = 'hidden'
  let visibleClassName = 'flex-1'

  if (alwaysPresent) {
    hiddenClassName = 'pointer-events-none opacity-0 w-0 flex-shrink'
  }

  return (
    <div
      className={classnames(
        'w-full',{
          [hiddenClassName]: !isSelected,
          [visibleClassName]: isSelected
        }
      )}
    >
      {children}
    </div>
  )
}
